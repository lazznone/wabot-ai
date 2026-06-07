# 🤖 WaBot AI — WhatsApp AI Agent Bot

> Modular, Scalable, Production-Ready WhatsApp Group Bot dengan Multi-LLM AI Agent

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## ✨ Fitur Utama

### 🤖 AI Agent System
- Multi-provider: **OpenAI, Gemini, Claude, DeepSeek, Grok, OpenRouter, Ollama, LM Studio**
- Smart routing (coding → Claude, cepat → Gemini, dll)
- Memory per user & per grup
- Persona system (assistant, tsundere, mentor, galak, funny)
- Anti prompt injection & abuse protection
- Async queue untuk low-spec hardware

### 🛡️ Moderasi
- Anti link, anti spam, anti kata kasar, anti delete
- Sistem warn → auto kick
- Welcome/goodbye message
- Auto moderation

### 💰 Economy
- Koin & bank system
- Daily reward + streak
- Transfer antar user
- Leaderboard XP/coins/level

### 🎮 Mini Games
- RPG battle system
- Fishing (mancing)
- Trivia quiz (auto reward)
- Slot machine
- Coin flip dengan taruhan
- Truth or Dare

### ⭐ VIP/Premium
- 4 tier: Free → VIP → Premium → Owner
- Limit AI berbeda per tier
- Redeem code system
- Auto expiry

### 📊 Dashboard Admin
- Real-time stats & monitoring
- User management
- Group configuration
- Redeem code manager
- AI usage analytics
- WebSocket live update

---

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/yourrepo/wabot-ai
cd wabot-ai
bash scripts/setup.sh
```

### 2. Konfigurasi `.env`
```env
OWNER_NUMBER=628xxxxxxxxxx
GEMINI_API_KEY=AIza...          # Minimal 1 AI key
DASHBOARD_PASS=password_kuat
```

### 3. Jalankan
```bash
# Development
npm run dev

# Production (PM2 - recommended)
npm run build
pm2 start ecosystem.config.js

# Docker
docker-compose up -d
```

### 4. Scan QR Code
Scan QR yang muncul di terminal dengan WhatsApp.

---

## 📋 Deployment Guide

### VPS (Ubuntu/Debian) — Recommended
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone & setup
git clone https://github.com/yourrepo/wabot-ai
cd wabot-ai
bash scripts/setup.sh

# Edit config
nano .env

# Build & start
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Termux (Android)
```bash
pkg update && pkg upgrade
pkg install nodejs-lts git python make clang

git clone https://github.com/yourrepo/wabot-ai
cd wabot-ai
bash scripts/setup.sh

nano .env
npm run build
node dist/index.js
```

### Docker
```bash
# Build & run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

### Windows (Development)
```powershell
# Install Node.js 18+ dari nodejs.org
# Install Git dari git-scm.com

git clone https://github.com/yourrepo/wabot-ai
cd wabot-ai
npm install
copy .env.example .env
# Edit .env dengan Notepad
npm run dev
```

---

## 🔧 Konfigurasi

### Mode Deployment

| Mode | RAM | CPU | Cocok Untuk |
|------|-----|-----|-------------|
| `lowspec` | ~100MB | Minimal | VPS 1GB, Termux, AMD A4 |
| `normal` | ~200MB | Moderat | VPS 2GB, PC biasa |
| `highperformance` | ~400MB | Tinggi | Server dedicated |

```env
DEPLOY_MODE=lowspec   # Ganti sesuai hardware
```

### AI Providers

Minimal butuh **1 API key**. Gratis terbaik: **Gemini** (Google AI Studio).

```env
# Paling mudah & ada free tier
GEMINI_API_KEY=AIza...

# Untuk model lebih powerful
OPENAI_API_KEY=sk-...

# Gratis dengan banyak model
OPENROUTER_API_KEY=sk-or-...

# Offline/lokal (tanpa internet)
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
```

---

## 💬 Command List

### AI Commands
| Command | Deskripsi | Tier |
|---------|-----------|------|
| `!ai <tanya>` | Chat AI default | Free |
| `!gemini <tanya>` | Chat Gemini | Free |
| `!gpt <tanya>` | Chat GPT | VIP |
| `!claude <tanya>` | Chat Claude | Premium |
| `!deepseek <tanya>` | Chat DeepSeek | VIP |
| `!resetai` | Reset memori AI | Free |
| `@bot <tanya>` | Mention bot | Free |

### Economy
| Command | Deskripsi |
|---------|-----------|
| `!balance` | Cek saldo |
| `!daily` | Klaim reward harian |
| `!transfer @user <jml>` | Transfer koin |
| `!bank deposit/withdraw <jml>` | Bank |
| `!leaderboard` | Papan peringkat |

### Game
| Command | Deskripsi |
|---------|-----------|
| `!rpg` | Battle RPG (2 min cooldown) |
| `!fish` | Mancing (60s cooldown) |
| `!trivia` | Quiz berhadiah |
| `!slots <bet>` | Slot machine |
| `!coinflip [heads/tails] [bet]` | Lempar koin |
| `!dadu [sisi]` | Lempar dadu |
| `!tod` | Truth or Dare |
| `!profile` | Lihat profil |

### Moderation (Admin)
| Command | Deskripsi |
|---------|-----------|
| `!warn @user [alasan]` | Beri peringatan |
| `!kick @user` | Kick user |
| `!mute` | Mute grup |
| `!unmute` | Unmute grup |
| `!antilink on/off` | Toggle anti link |
| `!antibadword on/off` | Toggle filter kasar |
| `!groupsettings` | Lihat pengaturan grup |
| `!setpersona <persona>` | Set persona AI |
| `!setprovider <provider>` | Set AI provider |

### VIP
| Command | Deskripsi |
|---------|-----------|
| `!vip` | Info paket VIP |
| `!redeem <kode>` | Redeem kode |
| `!remind <menit> <pesan>` | Set reminder |

### Owner
| Command | Deskripsi |
|---------|-----------|
| `!stats` | Statistik bot |
| `!broadcast <pesan>` | Broadcast ke semua grup |
| `!banuser @user` | Ban user |
| `!unbanuser @user` | Unban user |
| `!grantvip @user vip/premium <hari>` | Grant VIP |
| `!createredeem vip/premium <hari>` | Buat kode redeem |

---

## 📊 Dashboard

Akses: `http://your-server-ip:3000`

Default login: `admin` / `admin123`

**⚠️ Ganti password di `.env` sebelum deploy!**

Fitur dashboard:
- Real-time stats (memory, uptime, AI queue)
- Analytics chart (7/14/30 hari)
- User management (edit tier, ban/unban)
- Group configuration toggle
- Redeem code generator
- AI usage logs

---

## 🗄️ Database Schema

SQLite by default. Tabel utama:
- `users` — profil, tier, XP, coins
- `groups` — konfigurasi per grup
- `ai_memory` — history chat AI
- `ai_usage_logs` — log AI per request
- `warnings` — riwayat warn
- `inventory` — item user
- `redeem_codes` — kode VIP
- `reminders` — reminder terjadwal
- `rpg_characters` — karakter game
- `analytics_daily` — data harian

---

## 🔌 Tambah AI Provider Baru

```typescript
// src/ai/providers/myProvider.ts
import { BaseProvider } from './base';
import { AIRequest, AIResponse } from '../../types';

export class MyProvider extends BaseProvider {
  readonly name = 'myprovider' as any;
  readonly displayName = 'My Custom Provider';

  isAvailable(): boolean { return !!process.env.MY_API_KEY; }

  async complete(request: AIRequest): Promise<AIResponse> {
    // implement API call
    return { content: '...', provider: this.name, model: 'my-model' };
  }
}

// Daftarkan di src/ai/providers/registry.ts
this.register(new MyProvider());
```

---

## 🔌 Tambah Command Baru

```typescript
// src/commands/mycategory/mycommand.ts
import { Command, BotMessage } from '../../types';

export const myCommand: Command = {
  meta: {
    name: 'mycommand',
    aliases: ['mc'],
    description: 'Command kustom',
    usage: '!mycommand <arg>',
    category: 'utility',
    cooldown: 5,
    minTier: 'free',  // 'free' | 'vip' | 'premium' | 'owner'
  },
  async execute(msg: BotMessage) {
    const { socket, jid, args, userProfile } = msg;
    await socket.sendMessage(jid, { text: `Hello ${userProfile.name}!` });
  },
};

export default myCommand;
```

Command otomatis ter-load dari folder `src/commands/`.

---

## 📦 Struktur Project

```
wabot-ai/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/index.ts          # Konfigurasi
│   ├── types/index.ts           # TypeScript types
│   ├── database/index.ts        # DB & migrations
│   ├── ai/
│   │   ├── providers/           # AI providers
│   │   ├── agents/              # Agent & persona
│   │   ├── memory/              # Conversation memory
│   │   ├── routing/             # Smart routing
│   │   └── safety/              # Anti-injection
│   ├── commands/
│   │   ├── ai/                  # AI commands
│   │   ├── economy/             # Economy commands
│   │   ├── game/                # Game commands
│   │   ├── moderation/          # Mod commands
│   │   ├── vip/                 # VIP commands
│   │   ├── utility/             # Utility commands
│   │   ├── fun/                 # Fun commands
│   │   └── admin/               # Admin commands
│   ├── whatsapp/
│   │   ├── connection.ts        # Baileys connection
│   │   └── messageHandler.ts    # Message processing
│   ├── middleware/
│   │   └── autoModeration.ts    # Auto-mod middleware
│   ├── services/
│   │   ├── userService.ts       # User CRUD
│   │   ├── groupService.ts      # Group CRUD
│   │   └── scheduler.ts         # Cron jobs
│   ├── dashboard/
│   │   ├── server.ts            # Express + WebSocket
│   │   └── public/index.html    # Dashboard UI
│   └── utils/logger.ts          # Winston logger
├── scripts/setup.sh             # Setup script
├── ecosystem.config.js          # PM2 config
├── docker-compose.yml           # Docker config
├── Dockerfile
├── .env.example
├── tsconfig.json
└── package.json
```

---

## ⚡ Optimasi Low-Spec

Untuk VPS 1GB RAM / AMD A4:

```env
DEPLOY_MODE=lowspec
MAX_CONCURRENT_AI=2
CACHE_SIZE_MB=64
QUEUE_CONCURRENCY=3
LOG_LEVEL=warn
MEMORY_CLEANUP_INTERVAL=300000
```

PM2:
```bash
pm2 start ecosystem.config.js --env production
```

Node flags:
```
--max-old-space-size=384 --optimize-for-size
```

---

## 🔒 Security Checklist

- [ ] Ganti `DASHBOARD_PASS` di .env
- [ ] Ganti `DASHBOARD_SECRET` (random 32 char)
- [ ] Ganti `ENCRYPTION_KEY` (random 32 char)
- [ ] Set `OWNER_NUMBER` dengan benar
- [ ] Aktifkan `ANTI_INJECT_ENABLED=true`
- [ ] Firewall: buka hanya port yang diperlukan
- [ ] Gunakan HTTPS untuk dashboard (Nginx + SSL)

---

## 🆘 Troubleshooting

**Bot tidak connect / QR tidak muncul:**
```bash
# Hapus session dan restart
rm -rf sessions/
npm start
```

**Memory tinggi:**
```bash
# Cek memory
pm2 monit
# Restart
pm2 restart wabot-ai
```

**AI tidak merespons:**
- Cek API key di .env
- Cek `!stats` untuk lihat provider aktif
- Coba provider lain

**Database error:**
```bash
# Backup & reset DB
cp data/wabot.db data/wabot.db.bak
rm data/wabot.db
npm start  # Auto-recreate
```

---

## 📄 License

MIT License — bebas digunakan dan dimodifikasi.

---

Made with ❤️ for the Indonesian WhatsApp community
