# 🏆 WealthIQ — הציון הפיננסי שלך

**AI-powered Israeli financial health platform.**

WealthIQ analyzes your complete financial picture — pension, real estate, investments, savings, debt, and insurance — and gives you a personalized health score (0–100) with AI-powered Hebrew insights.

## The Problem

Thousands of Israelis post pension screenshots in Facebook groups asking "is this good for my age?" — with zero personalized context. Existing tools only look at one piece. WealthIQ sees the whole picture.

## Features

- 🧠 **WealthIQ Score (0–100)** — composite financial health metric
- 📊 **6 Category Scores** — retirement readiness, stability, growth, risk, fees, goal alignment
- 🤖 **AI Insights in Hebrew** — powered by Gemini 2.5 Flash, explains findings in plain language
- 📱 **Mobile-first, RTL-native** — designed for Hebrew from day one
- 🔒 **No data stored** — stateless, everything calculated on the fly
- 🎯 **Shareable score card** — built for social virality

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand |
| Charts | Recharts |
| AI | Gemini 2.5 Flash (free tier) |
| Hosting | Vercel |

## Architecture

```
Score Engine (TypeScript)  →  deterministic financial math, no AI
AI Layer (Gemini 2.5 Flash) →  Hebrew language generation ONLY
Frontend (Next.js)         →  RTL-native, dark theme, gold accents
```

**Key principle:** AI is for language, not calculations. All financial math is pure, deterministic, testable TypeScript.

## Getting Started

```bash
# Clone
git clone https://github.com/yourusername/wealthiq.git
cd wealthiq

# Install
npm install

# Set up env (optional — works without API key using fallback insights)
cp .env.example .env.local
# Add your GEMINI_API_KEY if you want AI-generated insights (free at aistudio.google.com)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    → Pages and API routes
components/             → React components
  questionnaire/        → Multi-step form sections
  results/              → Score gauge, cards, insights
  simulator/            → What-if interactive (coming soon)
lib/
  score-engine/         → All scoring algorithms (pure TS)
  ai/                   → Claude API integration
  types/                → Complete TypeScript type system
  store/                → Zustand state management
  i18n/                 → Hebrew strings
  utils/                → Financial math, formatting
```

## Deployment

### One-click Vercel (recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add environment variable in Vercel dashboard:
   - `GEMINI_API_KEY` — your Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))
   - `NEXT_PUBLIC_BASE_URL` — your production URL (e.g. `https://wealthiq.co.il`)
4. Deploy — Vercel auto-detects Next.js, no config needed

### Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Set env vars:
```bash
vercel env add GEMINI_API_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
```

### Local production test

```bash
npm run build
npm run start
# Open http://localhost:3000
```

> **Note:** The app works without `GEMINI_API_KEY` — it uses fallback Hebrew insights.
> Score calculation is fully client-side and requires no environment variables.

## Regulatory Notice

WealthIQ is an **educational tool**, not a licensed financial advisor. It does not provide personalized investment recommendations (ייעוץ פנסיוני). All outputs are general information only.

## Built By

**Lior** — CS & Entrepreneurship BSc, Reichman University

Built with Claude Code + Google Antigravity.

---

*מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, או המלצה לפעולה כלשהי.*
