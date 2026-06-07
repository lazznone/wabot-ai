import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { v4 as uuidv4 } from 'uuid';
import { AIRequest, AIResponse, AIProvider, UserTier, PersonaType } from '../../types';
import { providerRegistry } from '../providers/registry';
import { routeAIRequest } from '../routing';
import { getMemory, saveMemory } from '../memory';
import { getPersonaPrompt } from './persona';
import { checkSafety, sanitizeOutput } from '../safety';
import { config } from '../../config';
import { logger } from '../../utils/logger';
import { prepare } from '../../database';

// Queue to limit concurrent AI requests (critical for low-spec)
const aiQueue = new PQueue({
  concurrency: config.maxConcurrentAI,
  timeout: 60_000,
  throwOnTimeout: true,
});

interface AgentOptions {
  userId?: string;
  groupId?: string;
  groupName?: string;
  tier?: UserTier;
  persona?: PersonaType;
  customPersona?: string;
  preferProvider?: AIProvider;
  groupProvider?: string;
  noMemory?: boolean;
}

export async function runAgent(prompt: string, opts: AgentOptions = {}): Promise<string> {
  const {
    userId, groupId, groupName,
    tier = 'free',
    persona = 'assistant',
    customPersona,
    preferProvider,
    groupProvider,
    noMemory = false,
  } = opts;

  // Safety check
  const safety = checkSafety(prompt);
  if (!safety.safe) {
    if (safety.reason === 'prompt_injection') {
      return '⚠️ Permintaan ini tidak bisa diproses karena terdeteksi sebagai prompt injection.';
    }
    if (safety.reason === 'abuse_pattern') {
      return '🚫 Permintaan ini melanggar kebijakan penggunaan AI.';
    }
  }

  const cleanPrompt = safety.sanitized || prompt;

  // Get conversation history
  const history = noMemory ? [] : getMemory(userId, groupId, tier);

  // Build system prompt from persona
  const systemPrompt = getPersonaPrompt(persona, customPersona, groupName);

  // Route to best provider
  const { provider, reason } = routeAIRequest(cleanPrompt, tier, preferProvider, groupProvider);
  logger.debug(`[Agent] Routing to ${provider} (${reason})`);

  const request: AIRequest = {
    provider,
    systemPrompt,
    messages: [
      ...history,
      { role: 'user', content: cleanPrompt },
    ],
    temperature: 0.7,
    maxTokens: getTierMaxTokens(tier),
    userId,
    groupId,
    tier,
  };

  try {
    const response = await aiQueue.add(() =>
      pRetry(() => providerRegistry.complete(request), {
        retries: 2,
        minTimeout: 1000,
        onFailedAttempt: (err) => {
          logger.warn(`[Agent] Retry attempt ${err.attemptNumber}: ${err.message}`);
        },
      })
    );

    if (!response) throw new Error('Queue timeout');

    const output = sanitizeOutput(response.content);

    // Save to memory
    if (!noMemory && (userId || groupId)) {
      saveMemory(userId, groupId, 'user', cleanPrompt);
      saveMemory(userId, groupId, 'assistant', output);
    }

    // Log usage
    logAIUsage(userId || 'anonymous', groupId, response);

    return output;
  } catch (err: any) {
    logger.error('[Agent] Failed:', err?.message);
    return `❌ AI error: ${err?.message || 'Gagal mendapatkan respons'}. Coba lagi.`;
  }
}

function getTierMaxTokens(tier: UserTier): number {
  return { free: 512, vip: 1024, premium: 2048, owner: 4096 }[tier];
}

function logAIUsage(userId: string, groupId: string | undefined, response: AIResponse) {
  try {
    prepare(`
      INSERT INTO ai_usage_logs (id, user_id, group_id, provider, model, tokens, latency, success)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      uuidv4(), userId, groupId || null,
      response.provider, response.model,
      response.tokens || 0, 0
    );
  } catch (e) {
    // Non-critical
  }
}

export function getQueueStatus() {
  return {
    pending: aiQueue.pending,
    size: aiQueue.size,
    concurrency: aiQueue.concurrency,
  };
}
