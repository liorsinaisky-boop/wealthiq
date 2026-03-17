# WealthIQ Build Progress

Last updated: March 18, 2026
Last agent: Claude Code — Sprint 6
Current sprint: 9

## Sprint Status

- [x] Sprint 1: Fix & Compile (make it build clean) ✅
- [x] Sprint 2: Score Engine Hardening (tests pass, edge cases handled) ✅
- [x] Sprint 3: Questionnaire Polish (all 9 sections interactive, validated) ✅
- [x] Sprint 4: Results Dashboard (score gauge, categories, insights render) ✅
- [x] Sprint 5: What-If Simulator (interactive sliders, projection chart) ✅
- [x] Sprint 6: Visual Design Pass — Luminous Observatory theme ✅
- [x] Sprint 7: SEO, Sharing & Deploy (OG images, meta tags, Vercel) ✅
- [x] Sprint 8: Null safety + vehicle + expense breakdown ✅
- [ ] Sprint 9: Growth Features (OCR, accounts, PDF export)

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

## Sprint 3 Checklist

- [x] `npm run build` passes with zero errors
- [x] `npm run type-check` passes with zero errors
- [x] 94/94 tests still pass
- [x] RTL slide animation fixed: sections enter from right (start), exit to left (end)
- [x] `NavButtons` uses ChevronLeft (forward) / ChevronRight (back) — proper RTL icons
- [x] `Expandable` animated with Framer Motion (height + opacity, 200ms)
- [x] `NumberField` and `PercentField` suffix position fixed (right-3, pr-8)
- [x] Duplicate navigation removed: sections 1-3 have internal NavButtons; page-level nav hidden for them
- [x] Section 2: salary required validation (blocks Next if ₪0)
- [x] Section 3: pension balance required validation (blocks Next if never entered)
- [x] Section 7: `totalMonthlyObligations` auto-calculated from loan payments + mortgage payment

### What was fixed in Sprint 3:

**`components/questionnaire/FieldComponents.tsx`**
- `NavButtons`: replaced "הבא ←" text with `ChevronLeft` icon (RTL-correct); `ChevronRight` for Back
- `Expandable`: replaced instant show/hide with Framer Motion height+opacity animation
- `NumberField`: fixed suffix at `left-3` → `right-3` (was overlapping numbers); `pe-8` → `pr-8`
- `PercentField`: same suffix fix (`left-3` → `right-3`, `pe-8` → `pr-8`)
- Added `FieldError` component for inline validation display

**`components/questionnaire/Section1Profile.tsx`**
- Added `error` state + `FieldError` display
- Validates age is 18–100 before advancing

**`components/questionnaire/Section2Income.tsx`**
- Added salary required validation: blocks Next with error message if `monthlyGrossSalary <= 0`
- Error clears as user types

**`components/questionnaire/Section3Pension.tsx`**
- Added `balanceTouched` flag: tracks whether user explicitly interacted with pension balance field
- Blocks Next with error if balance was never entered

**`components/questionnaire/Section7Debt.tsx`**
- Added `realEstate` from store to access mortgage payment
- `autoCalcObligations = mortgagePayment + loanPayments`
- Loan payment updates now also update `totalMonthlyObligations` automatically
- `totalMonthlyObligations` field shows auto-calc hint and pre-fills with computed value

**`app/check/page.tsx`**
- Fixed RTL slide: `enter: { x: 80 }` (from right/start), `exit: { x: -80 }` (to left/end)
- Added `hasInternalNav` flag; page-level nav hidden for profile/income/pension steps

## Sprint 4 Checklist

- [x] `npm run build` passes with zero errors
- [x] `npm run type-check` passes with zero errors
- [x] 94/94 tests still pass
- [x] `LoadingAnalysis` component: 3 animated steps, spring checkmarks, calls `onComplete` after ~3.4s
- [x] `results/page.tsx`: replaced inline loading JSX with `<LoadingAnalysis onComplete={...} />`; removed `LOADING_STEPS`, `loadingStep` state, step timer
- [x] `CategoryCard`: switched to Framer Motion `variants` (hidden→visible); delay prop removed
- [x] `results/page.tsx` category grid: `staggerChildren: 0.1, delayChildren: 0.2` on container
- [x] `ScoreGauge`: score ring has `drop-shadow` glow matching score color (double shadow for bloom effect)

### What was added in Sprint 4:

**`components/results/LoadingAnalysis.tsx`** (new)
- 3 steps at 1s intervals: "מנתח את הנתונים שלך...", "מחשב ציון WealthIQ...", "יוצר תובנות מותאמות אישית..."
- Each step shows an animated circle indicator (pulsing while active, gold filled when done)
- Checkmarks animate in with spring bounce (`type: "spring"`)
- Calls `onComplete` 400ms after the last checkmark

**`app/results/page.tsx`**
- Removed: `LOADING_STEPS`, `loadingStep` state, `setInterval` step timer, `setTimeout` phase transition
- Added: `import LoadingAnalysis`; loading phase renders `<LoadingAnalysis onComplete={() => setPhase("results")} />`
- Added: `categoryGridVariants` with `staggerChildren: 0.1`; grid wrapped in `motion.div variants`

**`components/results/CategoryCard.tsx`**
- Removed `delay` prop
- Uses `cardVariants = { hidden: { opacity:0, y:20 }, visible: { opacity:1, y:0 } }`
- Progress bar uses fixed `delay: 0.3` (relative to card appearance)

**`components/results/ScoreGauge.tsx`**
- Score ring circle: `style={{ filter: "drop-shadow(0 0 10px {color}) drop-shadow(0 0 20px {color}40)" }}`

## Sprint 5 Checklist

- [x] `npm run build` passes with zero errors
- [x] `npm run type-check` passes with zero errors
- [x] 94/94 tests still pass
- [x] `SimulatorPanel`: 4 sliders (extra contribution ₪0–5K, retirement age 55–75, fee reduction 0–0.5%, salary growth 0–10%), debounced 300ms
- [x] `ProjectionChart`: Recharts LineChart, baseline (dashed gray #4B5563) + modified (solid gold #D4A843), Y-axis with K/M formatting, RTL tooltip
- [x] `ImpactSummary`: 3 cards — net worth delta, monthly passive income, retirement age delta; green/red coloring
- [x] Integrated into `results/page.tsx` below AI insights with section header
- [x] Profile stored in state (`useState<FinancialProfile>`) and passed to SimulatorPanel

### What was added in Sprint 5:

**`components/simulator/ProjectionChart.tsx`** (new)
- Recharts `LineChart` with `ResponsiveContainer`
- Baseline: dashed gray line (`strokeDasharray="5 4"`)
- Modified: solid gold line (`stroke="#D4A843"`)
- Y-axis: `formatY()` helper outputs `₪1.2M` / `₪850K`
- Tooltip: RTL direction, dark background, both lines labeled in Hebrew
- Legend: aligned right, Hebrew labels

**`components/simulator/ImpactSummary.tsx`** (new)
- 3-column grid of `ImpactCard`s
- Net worth delta: `+₪X` / `-₪X` in green/red
- Monthly passive income (4% withdrawal rate from API summary)
- Retirement age with years delta

**`components/simulator/SimulatorPanel.tsx`** (new)
- 4 `SliderRow` components with Hebrew labels and gold value display
- `debounceRef` clears previous timeout on each slider move (300ms debounce)
- On mount: immediately calls `/api/simulate` with baseline (no scenarios) to populate chart
- Scenarios only added to API call when value differs from default (avoids empty array issues)

**`app/results/page.tsx`**
- Added `profile` state (`useState<FinancialProfile | null>`)
- `setProfile(parsed)` alongside `setResult(wealthIQResult)` in useEffect
- New section: `סימולטור ״מה אם?״` with subtitle and `<SimulatorPanel profile={profile} />`

## Sprint 7 Checklist

- [x] `npm run build` passes with zero errors
- [x] `npm run type-check` passes with zero errors
- [x] 94/94 tests still pass
- [x] Root `app/layout.tsx`: full SEO metadata (title template, description, keywords, OG, Twitter card, robots, canonical, `metadataBase`)
- [x] Root `app/layout.tsx`: JSON-LD WebApplication schema injected via `<script dangerouslySetInnerHTML>`
- [x] `app/check/layout.tsx`: route-level metadata (`noindex/nofollow`)
- [x] `app/results/layout.tsx`: route-level metadata with custom OG title for shares
- [x] `app/api/share/route.ts`: OG image endpoint (1200×630, edge runtime, dark bg, gold gauge, grade badge)
- [x] `app/not-found.tsx`: Hebrew 404 page with gold heading, two CTAs
- [x] `app/error.tsx`: root error boundary
- [x] `app/check/error.tsx`: check route error boundary
- [x] `app/results/error.tsx`: results route error boundary
- [x] `app/globals.css`: defined missing CSS classes (`btn-gold`, `btn-outline`, `input-field`, `progress-fill`)
- [x] `.env.example`: added `NEXT_PUBLIC_BASE_URL`
- [x] `README.md`: Vercel one-click + CLI deployment instructions

### What was added in Sprint 7:

**`app/api/share/route.ts`** (new)
- Edge runtime OG image generator (`export const runtime = "edge"`)
- Uses `React.createElement` (not JSX) to work in `.ts` file
- 1200×630px dark background, gold borders, WealthIQ branding on left, SVG score gauge on right
- Score → color mapping, SVG arc via `strokeDashoffset`

**`app/not-found.tsx`** (new)
- Hebrew 404: "404 — הדף לא נמצא" with gold heading, home + /check CTAs

**`app/error.tsx`**, **`app/check/error.tsx`**, **`app/results/error.tsx`** (new)
- Per-route error boundaries with `reset()` and route-specific Hebrew copy

**`app/layout.tsx`**
- Complete `metadata` export with `metadataBase`, title template, OG, Twitter, robots, canonical
- Inline JSON-LD WebApplication schema

**`app/check/layout.tsx`**, **`app/results/layout.tsx`** (new)
- Thin layout wrappers with route-level `metadata` export

**`app/globals.css`**
- Added `.btn-gold`, `.btn-outline`, `.input-field`, `.progress-fill` class definitions

## AI Migration: Anthropic → Gemini 2.5 Flash

- [x] `npm uninstall @anthropic-ai/sdk` — SDK removed (was never used directly anyway)
- [x] `lib/ai/insight-generator.ts` — replaced Anthropic fetch endpoint with Gemini `generateContent` API
- [x] `lib/ai/system-prompts.ts` — no change needed (prompt was already model-agnostic)
- [x] `.env.example` — `ANTHROPIC_API_KEY` → `GEMINI_API_KEY` (aistudio.google.com)
- [x] `CLAUDE.md` — AI line updated to "Gemini 2.5 Flash (free tier)"
- [x] `README.md` — all references updated (tech stack, architecture, env var instructions)
- [x] `npm run build` ✅ `npm run test` ✅ 94/94

### Gemini API details:
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Auth: `?key=GEMINI_API_KEY` query param
- systemInstruction + contents format (not system/messages like Anthropic)
- Fallback still works when `GEMINI_API_KEY` is absent

## Sprint 8 Checklist

- [x] `npm run type-check` ✅ `npm run build` ✅ `npm run test` ✅ 94/94

### Task 1: Null safety in score engine
- [x] `wealth-growth.ts` — `properties`, `otherInvestments`, `loans` all guarded with `?? []`
- [x] `financial-stability.ts` — `totalMonthlyObligations ?? 0`, added car payment to obligations
- [x] `risk-management.ts` — `properties` × 2 guarded
- [x] `fee-efficiency.ts` — `properties` and `loans` forEach guarded
- [x] `composite.ts` — all `.reduce()` on arrays guarded; `properties[0]?.mortgage` optional chained

### Task 2: Vehicle ownership (Section 4)
- [x] `lib/types/index.ts` — added `vehicleOwned`, `vehicleValue`, `monthlyCarPayment`, `isLeased` to `RealEstateSection`
- [x] `components/questionnaire/Section4RealEstate.tsx` — vehicle toggle + value/payment/lease fields with Expandable
- [x] `lib/score-engine/wealth-growth.ts` — vehicle value included at 85% (15% depreciation haircut)
- [x] `lib/score-engine/financial-stability.ts` — `monthlyCarPayment` included in total debt obligations
- [x] `lib/score-engine/composite.ts` — vehicle included in `otherAssets` breakdown

### Task 3: Optional expense breakdown (Section 9)
- [x] `lib/types/index.ts` — `ExpenseBreakdown` expanded to 9 categories (added `utilities`, `insurance`, `childcare`, `subscriptions`)
- [x] `lib/types/index.ts` — `InsightsContext` extended with `monthlyCarPayment?` and `expenseBreakdown?`
- [x] `components/questionnaire/Section9CashFlow.tsx` — breakdown toggle (local state), all 9 category inputs, auto-sum, >20% mismatch warning with "update" button, housing pre-fill from mortgage
- [x] `lib/score-engine/composite.ts` — `expenseBreakdown` passed through to `InsightsContext` for AI

## Sprint 6 Checklist

- [x] `npm run build` ✅ zero errors
- [x] `npm run test` ✅ 94/94 tests pass
- [x] `app/globals.css` — full redesign: Sora/DM Sans/JetBrains Mono import, new CSS variables (#06080C bg, #E8E4DC text, #C8A24E gold), updated card/button/input/progress styles
- [x] `tailwind.config.ts` — added `font-sora`, `font-dm-sans`, `font-jetbrains-mono`; updated gold palette (400=#C8A24E), dark palette (500=#06080C)
- [x] `app/layout.tsx` — body uses `font-dm-sans`, warm text color
- [x] `app/page.tsx` — complete rewrite: fixed nav (scroll blur), 2-col hero with animated SVG score ring + floating pills + stat counters, "how it works" 3-card with ghost numbers, scoring engine 2-col (category list + demo score card with progress bars), features 3×2 grid, CTA with radial glow, footer
- [x] `app/check/page.tsx` — dark bg, 3px gold progress bar, gold step dots with glow, Sora headings, new error/nav styling, JetBrains Mono counters
- [x] `app/results/page.tsx` — dark header (blur+border), Sora headings, muted text, warm gold accents, styled bonus/penalty cards
- [x] `components/results/ScoreGauge.tsx` — Sora score font, "הציון שלך" uppercase label, dark track, gold glow arc
- [x] `components/results/CategoryCard.tsx` — category-specific color dots, JetBrains Mono score, 3px progress bar, hover border color
- [x] `components/results/InsightCard.tsx` — 4px right border in impact color, Sora title, pill badge, DM Sans body
- [x] `components/results/LoadingAnalysis.tsx` — gold pulsing ring indicator (no emoji), animated inner dot, gold checkmarks, smooth step transitions

### Design tokens applied:
- Background: #06080C (warm near-black)
- Text: #E8E4DC (warm white), muted: #8A8680, dim: #5A5650
- Gold: #C8A24E (warm gold), light: #E0BA72
- Cards: rgba(255,255,255,0.03) bg, rgba(255,255,255,0.06) border, 16px radius
- Headings: Sora 700, tight letter-spacing
- Body: DM Sans 400, 15-17px
- Numbers: JetBrains Mono
- Section labels: gold, uppercase, 11px, 4px letter-spacing

### Still Needs Work (Sprint 9+):

- PDF export
- Mobile layout polish
- User accounts / OCR

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
