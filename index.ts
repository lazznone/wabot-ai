import 'dotenv/config';
import { config } from './config';
import { logger } from './utils/logger';
import { getDb } from './database';
import { loadCommands } from './commandHandler';
import { startBot } from './whatsapp/connection';
import { startDashboard } from './dashboard/server';
import { startScheduler } from './services/scheduler';

// Expose gc for manual GC in lowspec mode
if (config.app.deployMode === 'lowspec') {
  try { require('v8').setFlagsFromString('--expose_gc'); (global as any).gc = require('vm').runInNewContext('gc'); } catch {}
}

const banner = `
╔═══════════════════════════════════════╗
║         WaBot AI — v${config.app.version}             ║
║   Modular WhatsApp AI Agent Bot       ║
╚═══════════════════════════════════════╝
Mode: ${config.app.deployMode.toUpperCase()} | DB: ${config.db.type.toUpperCase()}
`;

async function main() {
  console.log(banner);

  // Init DB
  logger.info('[BOOT] Initializing database...');
  getDb();

  // Load all commands
  logger.info('[BOOT] Loading commands...');
  await loadCommands();

  // Start WhatsApp bot
  logger.info('[BOOT] Starting WhatsApp connection...');
  await startBot();

  // Start dashboard
  if (config.app.env !== 'test') {
    logger.info('[BOOT] Starting dashboard...');
    startDashboard();
  }

  // Start scheduler/cron
  logger.info('[BOOT] Starting scheduler...');
  startScheduler();

  logger.info('✅ WaBot AI is running!');
  logger.info(`📊 Dashboard: http://localhost:${config.dashboard.port}`);
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`[SHUTDOWN] Received ${signal}...`);
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
  logger.error('[FATAL] Uncaught exception:', err);
  if (config.app.env === 'production') process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('[FATAL] Unhandled rejection:', reason);
});

main().catch((err) => {
  logger.error('[FATAL] Boot failed:', err);
  process.exit(1);
});
