# CLAUDE.md

## Project: WealthIQ
Full-stack Israeli financial health platform. Analyzes pension, real estate, investments, savings, debt, and insurance to produce a comprehensive WealthIQ Score (0–100) with AI-powered Hebrew insights.

## Required Reading (Skills)
Before making ANY changes, read these project skills:
1. `.skills/wealthiq-dev/SKILL.md` — Master dev guide (architecture rules, patterns, pitfalls)
2. `.skills/hebrew-rtl-nextjs/SKILL.md` — RTL layout rules (MUST read before touching UI)
3. `.skills/israeli-fintech-data/SKILL.md` — Israeli financial system reference (pension, tax, regulatory)

## Core Principle
Score engine = deterministic TypeScript math. AI = Hebrew language generation ONLY. Never mix them.

## Tech Stack
- **Framework:** Next.js 14+ (App Router), TypeScript strict mode
- **Styling:** Tailwind CSS + shadcn/ui, dark theme primary, gold accent (#D4A843)
- **Animation:** Framer Motion (step transitions, score reveals, chart animations)
- **State:** Zustand (questionnaire form state persists across steps)
- **Charts:** Recharts (net worth projections, allocation pie charts, score radar)
- **AI:** Claude API (claude-sonnet-4-20250514) for Hebrew insight generation only
- **Deployment:** Vercel
- **Testing:** Vitest + React Testing Library

## Architecture Rules
1. Score engine is PURE TYPESCRIPT — no AI, no randomness, no side effects, 100% deterministic
2. AI is ONLY used for natural language generation (Hebrew insights, explanations)
3. All financial calculations MUST have unit tests with edge cases
4. Every component MUST support RTL (`dir="rtl"`)
5. Hebrew is primary language. All user-facing strings live in `/lib/i18n/he.ts`
6. Money values stored as numbers in NIS (₪). Format only at display layer using `formatCurrency()`
7. Percentages stored as decimals in calculations (0.05 not 5%). Display as `formatPercent()`
8. All API routes return typed responses using shared types from `/lib/types`
9. No database in V1 — everything computed on the fly. Stateless API.
10. Server components by default. `'use client'` only when interactivity needed.

## File Structure
```
/app                          → Next.js App Router pages
  /app/page.tsx               → Landing page (SSR, SEO-optimized)
  /app/check/page.tsx         → Questionnaire flow (client component)
  /app/results/page.tsx       → Results dashboard + simulator
  /app/api/score/route.ts     → POST: FinancialProfile → WealthIQResult
  /app/api/insights/route.ts  → POST: ScoreContext → HebrewInsights[]
  /app/api/simulate/route.ts  → POST: Profile + Scenarios → ProjectionResult
  /app/api/share/route.ts     → GET: Generate OG share image

/components
  /components/ui/             → shadcn/ui base components
  /components/questionnaire/  → Multi-step form (9 sections)
    Section1Profile.tsx       → About you
    Section2Income.tsx        → Income & employment
    Section3Pension.tsx       → Pension & long-term savings
    Section4RealEstate.tsx    → Real estate & mortgage
    Section5Investments.tsx   → Stocks, crypto, other
    Section6Savings.tsx       → Savings & emergency fund
    Section7Debt.tsx          → Loans & credit
    Section8Insurance.tsx     → Insurance coverage
    Section9CashFlow.tsx      → Monthly expenses & budget
    QuestionnaireShell.tsx    → Step navigation, progress bar, transitions
    FieldComponents.tsx       → Reusable: CurrencyInput, PercentInput, SliderField, etc.
  /components/results/
    ScoreGauge.tsx            → Animated 0-100 gauge
    CategoryCard.tsx          → Individual category score card
    InsightCard.tsx           → AI-generated insight with icon & impact badge
    NetWorthChart.tsx         → Recharts projection over time
    AllocationPie.tsx         → Asset allocation breakdown
    ShareCard.tsx             → Branded shareable score image
  /components/simulator/
    ScenarioSlider.tsx        → Individual what-if slider
    SimulatorPanel.tsx        → All sliders + real-time chart update
    ComparisonView.tsx        → Before/after side-by-side

/lib
  /lib/score-engine/
    retirement-readiness.ts   → Pension health scoring
    financial-stability.ts    → Emergency fund, debt ratio, cash flow
    wealth-growth.ts          → Net worth, investments, real estate
    risk-management.ts        → Insurance, diversification, concentration
    fee-efficiency.ts         → Pension fees, investment fees, loan rates
    goal-alignment.ts         → Goal tracking and timeline feasibility
    composite.ts              → Weighted composite + bonus/penalty modifiers
    projections.ts            → Future value calculations, scenario modeling
    constants.ts              → Israeli financial constants (rates, limits, etc.)
  /lib/ai/
    insight-generator.ts      → Claude API call + prompt construction
    system-prompts.ts         → All system prompts (versioned, testable)
  /lib/data/
    pension-benchmarks.json
    fee-benchmarks.json
    salary-percentiles.json
    real-estate-indices.json
    insurance-benchmarks.json
    track-allocations.json
  /lib/types/
    profile.ts                → FinancialProfile and all section types
    scores.ts                 → WealthIQResult, CategoryScore, SubScore
    insights.ts               → Insight, InsightCategory, InsightImpact
    simulation.ts             → Scenario, ProjectionResult, TimeseriesPoint
    api.ts                    → API request/response types
  /lib/store/
    questionnaire-store.ts    → Zustand store for form state
  /lib/i18n/
    he.ts                     → All Hebrew strings
  /lib/utils/
    format.ts                 → formatCurrency, formatPercent, formatDate
    validation.ts             → Input validation helpers
    calculations.ts           → Shared financial math (FV, PV, PMT, etc.)

/__tests__/
  score-engine/               → Unit tests for every scoring module
  api/                        → API route integration tests
  utils/                      → Utility function tests
```

## Questionnaire Sections (9 sections, ~45 questions)
1. **Profile** (8 Qs): age, gender, marital status, dependents, city, risk tolerance, goal, target retirement age
2. **Income** (6 Qs): employment status, salary bruto/neto, additional income, years at job, industry
3. **Pension** (9 Qs): type, fund name, track, balance, fees, קרן השתלמות, old accounts, voluntary contributions
4. **Real Estate** (variable): property ownership, value, mortgage details, rental income, additional properties, purchase plans
5. **Investments** (variable): brokerage account, allocation breakdown, crypto, other investments
6. **Savings** (5 Qs): liquid savings, emergency fund, deposits, savings plans, חיסכון לכל ילד
7. **Debt** (variable): loans (type, balance, rate, term), credit card debt, total obligations
8. **Insurance** (5 Qs): life, disability, health, property, will
9. **Cash Flow** (3 Qs): monthly expenses (or breakdown), monthly savings, budget discipline

## Scoring System
Composite WealthIQ Score (0-100):
- Retirement Readiness: 25%
- Financial Stability: 20%
- Wealth Growth: 20%
- Risk Management: 15%
- Fee Efficiency: 10%
- Goal Alignment: 10%

Bonus: +5 (emergency fund >6mo), +3 (DTI <20%)
Penalty: -5 (no disability insurance + dependents), -5 (>50% single asset), -3 (no will + dependents), -10 (crypto >20%)

## Regulatory Constraint — CRITICAL
This is an EDUCATIONAL TOOL, not licensed financial advice (ייעוץ פנסיוני).
- NEVER recommend specific funds, products, or companies by name
- NEVER use "כדאי להחליף" (you should switch) — use "שווה לבדוק" (worth checking)
- ALWAYS show disclaimer: "מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני או המלצה."
- Show comparisons to averages, never to specific competing products

## Design Direction
- Dark theme primary (#0A0A0F background, #FFFFFF text, #D4A843 gold accent)
- Hebrew-first, RTL-native (not LTR flipped)
- Fonts: Heebo (Google Fonts) — Black for headlines, Regular for body
- Framer Motion for all transitions (questionnaire steps, score reveal, chart animations)
- Premium feel: glassmorphism cards, subtle gradients, gold accents on key metrics
- Mobile-first responsive design

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run Vitest
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
```
