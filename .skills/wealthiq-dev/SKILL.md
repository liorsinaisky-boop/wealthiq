---
name: wealthiq-dev
description: "Master development skill for the WealthIQ project — an Israeli AI-powered financial health platform. Read this skill BEFORE making any changes to the codebase. Covers: project architecture, score engine rules, AI integration patterns, component patterns, testing strategy, deployment, and coordination between Claude Code and Antigravity agents. ALWAYS trigger when working on any WealthIQ file, fixing bugs, adding features, or running the project."
---

# WealthIQ Development Guide

## Read First
Before working on this project, also read:
- `CLAUDE.md` in project root (architecture, file structure, coding standards)
- `.skills/hebrew-rtl-nextjs/SKILL.md` (RTL patterns and common pitfalls)
- `.skills/israeli-fintech-data/SKILL.md` (financial system reference data)

## Architecture Golden Rules

### Rule 1: Score Engine = Pure Math. AI = Language Only.
```
SCORE ENGINE (lib/score-engine/)     → TypeScript pure functions
  - Deterministic                     - No randomness
  - No API calls                      - No side effects
  - All inputs typed                  - All outputs typed
  - 100% unit tested                  - Auditable by regulators

AI LAYER (lib/ai/)                   → Claude API
  - Hebrew text generation ONLY       - Explains scores in plain Hebrew
  - NEVER calculates numbers          - Takes score context as input
  - Fallback insights if API fails    - Rate-limited, cached
```

### Rule 2: Regulatory Compliance is Non-Negotiable
Every feature, every component, every AI prompt must follow these rules:
- NO specific fund/product recommendations
- NO "you should switch to X" language
- ALWAYS show disclaimer on results pages
- Use "שווה לבדוק" pattern, never "כדאי להחליף"
- See `.skills/israeli-fintech-data/SKILL.md` for full regulatory guide

### Rule 3: Hebrew RTL is a First-Class Concern
Not "English app translated to Hebrew" — Hebrew-native from the ground up:
- All animations reverse direction (Framer Motion)
- All arrow icons flip (ChevronLeft = forward in RTL)
- Number inputs stay LTR with `dir="ltr"`
- See `.skills/hebrew-rtl-nextjs/SKILL.md` for complete guide

## Project Setup

### First-time setup
```bash
git clone <repo>
cd wealthiq
npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY if you want AI insights (optional)
npm run dev
```

### Verify it works
```bash
npm run type-check   # Zero errors required
npm run test         # All tests pass
npm run build        # Production build succeeds
```

## File Ownership Map
When modifying files, know which domain they belong to:

| Directory | Owner | Rules |
|-----------|-------|-------|
| `lib/score-engine/` | Score Engine | Pure functions, no imports from React/Next |
| `lib/ai/` | AI Layer | Only Claude API calls, structured output |
| `lib/types/` | Type System | Single source of truth, never duplicate |
| `lib/data/` | Benchmark Data | JSON files, cite sources in comments |
| `lib/store/` | State | Zustand only, no direct API calls |
| `lib/i18n/` | Hebrew Strings | ALL user-facing Hebrew strings go here |
| `components/questionnaire/` | Form UI | Uses store, never calls API directly |
| `components/results/` | Display UI | Read-only display of score results |
| `components/simulator/` | Interactive | Calls /api/simulate, real-time updates |
| `app/api/` | API Routes | Server-only, calls score engine + AI |
| `app/` (pages) | Pages | Thin wrappers, compose components |

## Component Patterns

### Questionnaire Section Pattern
Every section follows this structure:
```tsx
"use client";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { he } from "@/lib/i18n/he";

export default function SectionNName() {
  const { sectionData, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof sectionData>) => {
    updateSection("sectionKey", data);
  };

  return (
    <div className="glass-card space-y-6 p-6 md:p-8">
      <div className="mb-2">
        <h2 className="text-xl font-bold">{he.sectionNames.key}</h2>
        <p className="text-sm text-gray-400">Section description</p>
      </div>
      {/* Fields */}
    </div>
  );
}
```

### Field Component Patterns
```tsx
// Currency input (₪)
<div className="relative">
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₪</span>
  <input type="number" dir="ltr" className="input-field pr-8" />
</div>

// Percentage input
<div className="relative">
  <input type="number" step="0.01" dir="ltr" className="input-field" />
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
</div>

// Yes/No toggle
<div className="flex gap-3">
  <button className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
    value ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400"
  }`}>כן</button>
  <button className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
    !value ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400"
  }`}>לא</button>
</div>

// Card selection (multiple choice)
<div className="grid grid-cols-2 gap-3">
  {options.map(([value, label]) => (
    <button key={value} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
      selected === value ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400"
    }`}>{label}</button>
  ))}
</div>
```

## Testing Strategy

### Unit Tests (lib/score-engine/)
Every scoring function needs tests for:
1. **Normal case** — typical 30-year-old Israeli employee
2. **Young starter** — age 23, minimal savings
3. **Near retirement** — age 65, should have substantial savings
4. **Edge: zero values** — zero salary, zero balance
5. **Edge: extreme values** — ₪50M balance, 90% crypto allocation
6. **Edge: missing data** — null fees, undefined fields

### Integration Tests (app/api/)
- POST to `/api/score` with valid profile → returns valid WealthIQResult
- POST to `/api/score` with missing fields → returns 400
- POST to `/api/insights` with context → returns Insight[]

### E2E Flow Test (manual or Playwright)
1. Navigate to `/check`
2. Fill Profile section → next
3. Fill Income section → next
4. Fill Pension section → submit
5. Results page shows score, categories, insights
6. Share button works

## Deployment Checklist

### Before deploying to Vercel:
- [ ] `npm run type-check` — zero errors
- [ ] `npm run test` — all pass
- [ ] `npm run build` — succeeds
- [ ] All results pages show disclaimer
- [ ] No specific fund names in AI prompts
- [ ] OG image generation works
- [ ] Mobile responsive (test on 375px width)
- [ ] Hebrew text is natural, not machine-translated
- [ ] RTL layout correct on all pages
- [ ] Number inputs are LTR
- [ ] Arrow icons point correct RTL direction

### Vercel environment variables:
```
ANTHROPIC_API_KEY=sk-ant-...  (optional — fallback insights work without it)
```

## Agent Coordination: Claude Code vs Antigravity

### Claude Code handles:
- Score engine implementation and testing
- TypeScript type definitions
- API route logic
- Data model changes
- Complex business logic
- Bug fixes in calculation code
- CLAUDE.md updates

### Antigravity handles:
- UI component building and styling
- End-to-end feature flows
- Visual polish and animations
- Browser testing and screenshots
- Multi-file UI refactoring
- Mobile responsiveness fixes

### Conflict avoidance:
- Score engine (`lib/score-engine/`) — Claude Code only
- UI components (`components/`) — Antigravity only
- API routes (`app/api/`) — Claude Code only
- Pages (`app/*/page.tsx`) — either, but not simultaneously
- Types (`lib/types/`) — Claude Code only (Antigravity reads, doesn't write)

## Common Pitfalls

### 1. Floating point in currency
```typescript
// ❌ WRONG
const total = 0.1 + 0.2; // 0.30000000000000004

// ✅ CORRECT — round at calculation boundaries
const total = Math.round((0.1 + 0.2) * 100) / 100;
```

### 2. Hebrew string interpolation
```typescript
// ❌ WRONG — RTL bidi issues
const msg = `דמי ניהול: ${fee}%`;

// ✅ CORRECT — wrap LTR content
const msg = `דמי ניהול: \u200F${fee}%`; // RLM character
// Or in JSX:
<span>דמי ניהול: <span dir="ltr">{fee}%</span></span>
```

### 3. Zustand store updates
```typescript
// ❌ WRONG — nested object mutation
updateSection("pension", { kerenHishtalmut: { hasOne: true } });
// This REPLACES the entire kerenHishtalmut object, losing balance field

// ✅ CORRECT — spread existing data
updateSection("pension", {
  kerenHishtalmut: { ...pension.kerenHishtalmut, hasOne: true }
});
```

### 4. API route error handling
```typescript
// ❌ WRONG — no error boundary
const result = calculateWealthIQ(profile);
return NextResponse.json({ result });

// ✅ CORRECT — try/catch + typed response
try {
  const result = calculateWealthIQ(profile);
  return NextResponse.json<ScoreResponse>({ success: true, result });
} catch (error) {
  return NextResponse.json<ScoreResponse>(
    { success: false, error: "Calculation failed" },
    { status: 500 }
  );
}
```
