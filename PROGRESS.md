# WealthIQ Build Progress

Last updated: March 16, 2026
Last agent: Claude Code — Sprint 2
Current sprint: 3

## Sprint Status

- [x] Sprint 1: Fix & Compile (make it build clean) ✅
- [x] Sprint 2: Score Engine Hardening (tests pass, edge cases handled) ✅
- [ ] Sprint 3: Questionnaire Polish (all 9 sections interactive, validated)
- [ ] Sprint 4: Results Dashboard (score gauge, categories, insights render)
- [ ] Sprint 5: What-If Simulator (interactive sliders, projection chart)
- [ ] Sprint 6: Visual Design Pass (animations, mobile, RTL polish)
- [ ] Sprint 7: SEO, Sharing & Deploy (OG images, meta tags, Vercel)
- [ ] Sprint 8: Growth Features (OCR, accounts, PDF export)

## Sprint 1 Checklist

- [x] `npm run build` passes with zero errors
- [x] `npm run type-check` passes with zero errors
- [x] `npm run dev` starts without crashing
- [x] `/` (landing page) — returns 200
- [x] `/check` (questionnaire, Section 1 shown) — returns 200
- [x] `/results` (redirects to /check when no profile in sessionStorage) — returns 200

## What Was Fixed in Sprint 1

### Files Created:
- `lib/ai/system-prompts.ts` — was missing, blocked the build

### Files Modified:
- `lib/store/questionnaire-store.ts` — added section shortcut properties (`profile`, `income`, `pension`, etc.); changed `updateSection` to accept `Partial<>` and merge; fixed store API to match what sections use
- `app/check/page.tsx` — complete rewrite: fixed store API usage (`setCurrentStep→setStep`, `markStepComplete→markComplete`, `setCalculating→setSubmitting`, `isCalculating→isSubmitting`); fixed `currentStep` from number to string; fixed `completedSteps.has()→.includes()`; replaced `buildProfile()`+`setResult()` with sessionStorage write before navigate
- `app/results/page.tsx` — moved `LOADING_STEPS` outside component (ESLint fix); added `eslint-disable` for exhaustive-deps
- `app/api/simulate/route.ts` — fixed `annualGrowthRate→annualGrowth` param name; added `toTimeseries()` mapper to produce valid `TimeseriesPoint[]`
- `components/questionnaire/FieldComponents.tsx` — added missing exports: `NumberField`, `SelectField`, `ToggleGroup`, `SliderField`, `NavButtons`
- `components/results/NetWorthBreakdown.tsx` — fixed `he.netWorth→he.results.netWorth`, `he.totalAssets→he.results.assets`, `he.totalLiabilities→he.results.liabilities`

## Sprint 2 Checklist

- [x] `npm run test` — 94/94 tests pass
- [x] All 6 scoring modules have individual test files
- [x] Each test file covers: normal case, young starter, near-retirement, zero values, extreme values, grade validity
- [x] Composite score engine: never returns NaN/Infinity, handles null fees, bonuses/penalties apply correctly, insightsContext has all required fields
- [x] Fixed existing composite test: `crypto_penalty` → `crypto_heavy` (correct bonus ID)

### What was added in Sprint 2:
- `__tests__/score-engine/helpers.ts` — shared `makeProfile()` factory + `VALID_GRADES` constant
- `__tests__/score-engine/retirement-readiness.test.ts` — 12 tests
- `__tests__/score-engine/financial-stability.test.ts` — 13 tests
- `__tests__/score-engine/wealth-growth.test.ts` — 11 tests
- `__tests__/score-engine/risk-management.test.ts` — 12 tests
- `__tests__/score-engine/fee-efficiency.test.ts` — 16 tests
- `__tests__/score-engine/goal-alignment.test.ts` — 19 tests

### Still Needs Work (Sprint 3+):

- Questionnaire sections don't have full validation
- What-if simulator components not yet built
- OG share image, 404 page, PDF export

## What Exists Already

### Fully Written and Compiling:
- [x] Complete TypeScript type system (lib/types/index.ts) — 450+ lines
- [x] Score engine: 6 category scorers + composite + constants (9 files)
- [x] All 9 questionnaire sections (Section1-9 components)
- [x] Shared field components (FieldComponents.tsx)
- [x] Results page with ScoreGauge, CategoryCard, InsightCard, NetWorthChart, NetWorthBreakdown
- [x] 3 API routes: /api/score, /api/insights, /api/simulate
- [x] AI insight generator with fallback (works without API key)
- [x] Zustand store with full form state management
- [x] Hebrew i18n strings file
- [x] Landing page with hero, features, how-it-works
- [x] Global CSS with dark theme, glass cards, gold accents
- [x] 3 custom skills (.skills/ directory)
- [x] CLAUDE.md project spec
- [x] Unit tests for composite score engine (8 test cases)

### NOT Yet Built (Sprint 5+):
- [ ] What-If Simulator components
- [ ] Loading analysis animation (between submit and results)
- [ ] OG share image generator
- [ ] Custom 404 page
- [ ] PDF export
- [ ] User accounts

## Files Modified in Each Sprint

### Sprint 1:
- Files created: `lib/ai/system-prompts.ts`
- Files modified: `lib/store/questionnaire-store.ts`, `app/check/page.tsx`, `app/results/page.tsx`, `app/api/simulate/route.ts`, `components/questionnaire/FieldComponents.tsx`, `components/results/NetWorthBreakdown.tsx`
- Agent used: Claude Code
- Result: `npm run build` ✅ `npm run type-check` ✅ All 3 routes return 200 ✅
