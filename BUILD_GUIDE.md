# WealthIQ — Build Execution Guide

## How This Document Works

This is your **single command center** for building WealthIQ end-to-end. It's designed for:

- **Claude Code** as primary builder (Pro plan — budget your messages wisely)
- **Gemini CLI / Antigravity** as backup when Claude Code hits message limits
- **Any agent** can pick up where the last one stopped by reading `PROGRESS.md`

### Pro Plan Strategy
You have limited messages per day on Pro. The key is **batching**: give Claude Code ONE big prompt per session that covers multiple tasks, rather than chatting back-and-forth. Each "Sprint" below is designed as a single-prompt block.

---

## Step 0: Initial Setup (YOU do this manually — 5 minutes)

```bash
# 1. Extract the project archive
tar xzf wealthiq-project.tar.gz
cd wealthiq

# 2. Initialize git
git init
git add .
git commit -m "Initial WealthIQ scaffold from master plan"

# 3. Install dependencies
npm install

# 4. Create env file
cp .env.example .env.local
# Optional: add your ANTHROPIC_API_KEY for AI insights

# 5. Verify it starts
npm run dev
# Visit http://localhost:3000 — you should see the landing page
# Ctrl+C to stop

# 6. Create the progress tracker
touch PROGRESS.md
```

Then paste this into `PROGRESS.md`:

```markdown
# WealthIQ Build Progress

Last updated: [DATE]
Last agent: [Claude Code / Gemini CLI / Antigravity]
Current sprint: 1

## Sprint Status

- [ ] Sprint 1: Fix & Compile (make it build clean)
- [ ] Sprint 2: Score Engine Hardening (tests pass, edge cases handled)
- [ ] Sprint 3: Questionnaire Polish (all 9 sections interactive, validated)
- [ ] Sprint 4: Results Dashboard (score gauge, categories, insights render)
- [ ] Sprint 5: What-If Simulator (interactive sliders, projection chart)
- [ ] Sprint 6: Visual Design Pass (animations, mobile, RTL polish)
- [ ] Sprint 7: SEO, Sharing & Deploy (OG images, meta tags, Vercel)
- [ ] Sprint 8: Growth Features (OCR, accounts, PDF export)

## Detailed Checklist

### Sprint 1: Fix & Compile
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run type-check` passes
- [ ] All imports resolve correctly
- [ ] Dev server runs without crashes
- [ ] Landing page renders at /
- [ ] Questionnaire page renders at /check
- [ ] Results page renders at /results (with mock data)

### Sprint 2: Score Engine Hardening
- [ ] `npm run test` — all tests pass
- [ ] Added tests for each scoring module individually
- [ ] Edge case: age 23, zero everything
- [ ] Edge case: age 65, high net worth
- [ ] Edge case: all crypto portfolio
- [ ] Edge case: massive debt
- [ ] Score engine returns consistent results (deterministic)
- [ ] Insights context object has all required fields

### Sprint 3: Questionnaire Polish
- [ ] Section 1 (Profile): all fields work, data persists in store
- [ ] Section 2 (Income): salary input, additional income expand/collapse
- [ ] Section 3 (Pension): fund type, track, fees with "I don't know"
- [ ] Section 4 (Real Estate): property add, mortgage expand, rental income
- [ ] Section 5 (Investments): brokerage, crypto toggle, allocation
- [ ] Section 6 (Savings): emergency fund, deposits, child savings
- [ ] Section 7 (Debt): loans, credit card, total obligations auto-calc
- [ ] Section 8 (Insurance): life/disability/health/property/will
- [ ] Section 9 (Cash Flow): expenses, savings rate, budget discipline
- [ ] Step navigation works (next/back/dot click)
- [ ] Progress bar animates correctly
- [ ] Micro-insights show after relevant sections
- [ ] Form validation: required fields highlighted
- [ ] "Submit" at end calls /api/score and redirects to /results

### Sprint 4: Results Dashboard
- [ ] ScoreGauge animates on load (count-up effect)
- [ ] 6 CategoryCards render with correct scores and colors
- [ ] Bonuses/penalties section shows applied items
- [ ] NetWorthBreakdown renders asset/liability bars
- [ ] AI insights load (or fallback insights show)
- [ ] InsightCards render with impact badges
- [ ] Share button works (Web Share API + clipboard fallback)
- [ ] "Try again" button resets store and goes to /check
- [ ] Disclaimer visible at bottom

### Sprint 5: What-If Simulator
- [ ] SimulatorPanel component created
- [ ] Sliders: contribution increase, retirement age, fee reduction
- [ ] /api/simulate returns baseline + modified projections
- [ ] Recharts LineChart shows both projections
- [ ] Real-time updates as sliders move (debounced)
- [ ] Summary card: "This change would add ₪X by retirement"
- [ ] Integrated into results page below insights

### Sprint 6: Visual Design Pass
- [ ] Framer Motion entrance animations on all pages
- [ ] Mobile responsive: works on 375px (iPhone SE)
- [ ] RTL audit: all arrows correct, numbers LTR, progress bar RTL
- [ ] Dark theme consistent: no white flashes, no mismatched grays
- [ ] Gold accent used consistently for interactive elements
- [ ] Loading states: skeleton screens during API calls
- [ ] Error states: graceful messages in Hebrew
- [ ] Smooth step transitions in questionnaire
- [ ] Score reveal animation on results page

### Sprint 7: SEO, Sharing & Deploy
- [ ] Meta tags on all pages (title, description, og:image)
- [ ] OG share image generated via /api/share (Vercel OG)
- [ ] Custom 404 page in Hebrew
- [ ] Vercel deployment works
- [ ] Environment variables set on Vercel
- [ ] Lighthouse performance > 85
- [ ] Lighthouse accessibility > 90
- [ ] Hebrew content reads naturally (not machine-translated)
- [ ] All disclaimers in place

### Sprint 8: Growth Features (Post-Launch)
- [ ] OCR upload for pension statements
- [ ] User accounts (Supabase)
- [ ] Score history tracking
- [ ] PDF report export
- [ ] Email digest
- [ ] Community benchmarks
```

---

## Sprint 1: Fix & Compile

**Goal:** Make the project build clean with zero TypeScript errors.

**Primary tool:** Claude Code
**Backup tool:** Gemini CLI
**Estimated messages:** 1-2 Claude Code prompts

### Claude Code Prompt (copy-paste this EXACTLY):

```
Read CLAUDE.md and .skills/wealthiq-dev/SKILL.md first.

Then do ALL of the following in one pass:

1. Run `npm run build` and fix every TypeScript error. Common issues to expect:
   - Import paths that don't resolve (@ alias)
   - Type mismatches between components and the Zustand store
   - Missing exports or wrong type names
   - Framer Motion API changes
   
2. Run `npm run type-check` and fix any remaining errors.

3. Make sure `npm run dev` starts without crashing.

4. Test these routes work in the browser:
   - / (landing page)
   - /check (questionnaire — should show Section 1)
   - /results (should show "no results" redirect message)

5. After everything compiles, update PROGRESS.md:
   - Check off all Sprint 1 items that pass
   - Note any items that still need work
   - Set "Last agent: Claude Code" and today's date

Commit when done: `git add . && git commit -m "Sprint 1: project compiles clean"`
```

### If Claude Code hits limit — Gemini CLI Fallback:

```bash
# Open project in Gemini CLI
gemini

# Then paste:
Read CLAUDE.md. Run `npm run build`. Fix every TypeScript error one by one.
After each fix, run `npm run build` again to check. Repeat until zero errors.
Then run `npm run dev` and verify /, /check, and /results load.
Update PROGRESS.md with what you completed.
```

### If using Antigravity:

```
Open the wealthiq/ folder as workspace. Read CLAUDE.md.
Task: Make this Next.js project compile and run.
Run `npm run build`, fix all errors, verify all 3 pages render in the browser.
Take screenshots of each page to confirm. Update PROGRESS.md.
```

---

## Sprint 2: Score Engine Hardening

**Goal:** All scoring functions tested, edge cases covered, deterministic results guaranteed.

**Primary tool:** Claude Code (this is pure logic work — Claude Code's strength)
**Estimated messages:** 1-2

### Claude Code Prompt:

```
Read CLAUDE.md and .skills/wealthiq-dev/SKILL.md.

Current state: check PROGRESS.md for what's done.

Do ALL of the following:

1. Read __tests__/score-engine/composite.test.ts — there are 8 existing tests.

2. Add individual test files for each scoring module:
   - __tests__/score-engine/retirement-readiness.test.ts
   - __tests__/score-engine/financial-stability.test.ts
   - __tests__/score-engine/wealth-growth.test.ts
   - __tests__/score-engine/risk-management.test.ts
   - __tests__/score-engine/fee-efficiency.test.ts
   - __tests__/score-engine/goal-alignment.test.ts

3. Each test file needs at minimum:
   - Normal case (typical 32-year-old Israeli employee)
   - Young starter (age 23, no savings)
   - Near retirement (age 65, accumulated wealth)
   - Edge: zero salary/zero balance
   - Edge: extreme values (₪50M balance, 90% crypto)
   - Verify score is always 0-100
   - Verify grade is valid

4. Run `npm run test` and fix any failures. All tests must pass.

5. Check that the composite score engine:
   - Never returns NaN or Infinity
   - Handles null/undefined fees gracefully
   - Bonuses/penalties are correctly applied
   - insightsContext has all required fields populated

6. Update PROGRESS.md, commit: "Sprint 2: score engine hardened with full test coverage"
```

### Gemini CLI Fallback:

```
Read CLAUDE.md. Look at the score engine in lib/score-engine/.
Look at existing tests in __tests__/score-engine/composite.test.ts.

Create individual test files for each scoring module following the same 
pattern as composite.test.ts. Test normal cases and edge cases.
Run `npm run test` and fix all failures.
Update PROGRESS.md with results.
```

---

## Sprint 3: Questionnaire Polish

**Goal:** All 9 sections fully interactive with validation, micro-insights, and smooth navigation.

**Primary tool:** Antigravity (UI work — agent can see the browser)
**Backup:** Claude Code
**Estimated messages:** 2-3

### Antigravity Prompt:

```
Read CLAUDE.md and .skills/hebrew-rtl-nextjs/SKILL.md.

Open http://localhost:3000/check in the browser.

Task: Go through every questionnaire section (1-9) and fix issues:

1. Click through all 9 steps. For each step:
   - Verify all inputs work (type, click, toggle)
   - Verify data persists when going back and forward
   - Verify Hebrew text displays correctly (RTL)
   - Verify number inputs are LTR
   - Verify micro-insights appear when relevant data is entered

2. Fix these known issues:
   - Currency inputs need ₪ symbol on the RIGHT side (RTL)
   - Chevron arrows: "Next" should use ChevronLeft (RTL forward)
   - Section 4 (Real Estate): mortgage sub-form needs proper expand/collapse
   - Section 7 (Debt): totalMonthlyObligations should auto-calculate from loans

3. Add form validation:
   - Section 1: age is required (highlight if empty on "Next")
   - Section 2: salary is required
   - Section 3: pension balance is required
   - Other sections: no required fields (can skip with defaults)

4. Test the full flow: fill all sections → submit → should redirect to /results

5. Take screenshots of each section. Update PROGRESS.md.
```

### Claude Code Fallback:

```
Read CLAUDE.md and .skills/hebrew-rtl-nextjs/SKILL.md.

Check PROGRESS.md for current state.

Audit all questionnaire components (components/questionnaire/Section*.tsx):

1. Ensure every section uses the correct Zustand store pattern:
   - const { sectionName, updateSection } = useQuestionnaireStore();
   - const update = (data) => updateSection("sectionName", data);

2. Add input validation to required fields (age, salary, pension balance):
   - Show red border + Hebrew error message if empty on "Next"
   - Use a "touched" state so errors only show after first submit attempt

3. Fix Section 7 (Debt): auto-calculate totalMonthlyObligations from:
   - Sum of all loan monthlyPayments
   - Plus mortgage payments from realEstate section
   - Make it editable (user can override)

4. Ensure all CurrencyField components have dir="ltr" on the input

5. Verify the check page (app/check/page.tsx) imports all 9 sections correctly

6. Run `npm run build` to verify no new errors.

Update PROGRESS.md, commit: "Sprint 3: questionnaire polished"
```

---

## Sprint 4: Results Dashboard

**Goal:** Score, categories, insights, and net worth all render beautifully.

**Primary tool:** Antigravity (visual work)
**Backup:** Claude Code
**Estimated messages:** 2

### Antigravity Prompt:

```
Read CLAUDE.md and .skills/wealthiq-dev/SKILL.md.

Task: Make the results dashboard at /results look production-quality.

1. First, go through /check, fill in test data, submit.
   (Use: age 32, salary 18000, pension balance 210000, owns apartment 
   worth 2.5M with 1.5M mortgage, 150K investments, 50K savings, no debt)

2. On the results page, verify:
   - ScoreGauge animates (number counts up from 0)
   - All 6 category cards show with colored bars
   - Net worth breakdown shows asset/liability bars with legend
   - AI insights load (fallback if no API key — that's fine)
   - Bonuses/penalties section renders applied items
   - Share button works
   - Layout is clean on mobile (375px width)

3. Fix visual issues:
   - Score gauge should have a glow effect matching the score color
   - Category cards should stagger-animate on entrance
   - Loading state should show shimmer skeletons, not just a spinner
   - Ensure all Hebrew text is RTL-correct

4. Add a "loading analysis" screen between submit and results:
   - 3-step progress: "מנתח נתונים..." → "מחשב ציון..." → "יוצר תובנות..."
   - Each step animates for ~1 second (even if calculation is instant)
   - Creates anticipation and perceived quality

5. Screenshot the final results page. Update PROGRESS.md.
```

### Claude Code Fallback:

```
Read CLAUDE.md. Check PROGRESS.md.

1. Create a LoadingAnalysis component (components/results/LoadingAnalysis.tsx):
   - Shows 3 animated steps with checkmarks
   - Step 1: "מנתח את הנתונים שלך..." (1s)
   - Step 2: "מחשב ציון WealthIQ..." (1s)  
   - Step 3: "יוצר תובנות מותאמות אישית..." (1s)
   - After all 3 complete, show results

2. Integrate LoadingAnalysis into app/results/page.tsx:
   - Show it for 3 seconds before revealing results
   - Use useState + useEffect for the timing

3. Add stagger animation to CategoryCards in results:
   - Each card enters 100ms after the previous one
   - Use Framer Motion's staggerChildren

4. Ensure ScoreGauge has a drop-shadow glow matching score color

5. Build, test, commit: "Sprint 4: results dashboard polished"
```

---

## Sprint 5: What-If Simulator

**Goal:** Interactive sliders that model financial scenarios with a real-time projection chart.

**Primary tool:** Claude Code (complex logic + Recharts)
**Estimated messages:** 2-3

### Claude Code Prompt:

```
Read CLAUDE.md. Check PROGRESS.md.

Build the What-If Simulator feature:

1. Create components/simulator/SimulatorPanel.tsx:
   - 4 scenario sliders:
     a. "הגדלת הפקדות חודשיות" (₪0 to ₪5,000, step ₪100)
     b. "גיל פרישה" (55 to 75)
     c. "הורדת דמי ניהול" (0% to 0.5%)
     d. "עליית שכר שנתית" (0% to 10%)
   - Each slider shows current value with Hebrew label
   - Debounced: updates chart 300ms after slider stops moving

2. Create components/simulator/ProjectionChart.tsx:
   - Uses Recharts LineChart
   - Two lines: "מסלול נוכחי" (baseline, gray) and "תרחיש חדש" (modified, gold)
   - X-axis: years / age
   - Y-axis: net worth in ₪ (formatted with K/M suffix)
   - Tooltip shows both values on hover
   - RTL: legend on the right side

3. Create components/simulator/ImpactSummary.tsx:
   - Shows the delta: "שינוי זה יוסיף ₪X עד הפרישה"
   - Shows monthly passive income comparison
   - Shows score impact estimate

4. Integrate into app/results/page.tsx:
   - Add below the AI insights section
   - Header: "סימולטור ״מה אם?״"
   - The simulator calls /api/simulate (already exists)
   - Pass the current profile + slider values as scenarios

5. Make sure the chart looks good in dark theme with gold accent color.

6. Test with different profiles. Update PROGRESS.md.
   Commit: "Sprint 5: what-if simulator with interactive projections"
```

### Gemini CLI Fallback:

```
Read CLAUDE.md. I need to build a What-If Simulator.

The API endpoint /api/simulate already exists. I need 3 React components:
1. SimulatorPanel.tsx — 4 sliders for financial scenarios
2. ProjectionChart.tsx — Recharts LineChart comparing baseline vs modified
3. ImpactSummary.tsx — shows the financial impact in Hebrew

Use Recharts (already installed), Framer Motion for animations.
Dark theme, gold (#D4A843) accent. Hebrew RTL.

Create the components, integrate into app/results/page.tsx.
Run `npm run build` to verify. Update PROGRESS.md.
```

---

## Sprint 6: Visual Design Pass

**Goal:** Production-quality visual polish — animations, mobile, RTL.

**Primary tool:** Antigravity (browser-based visual verification)
**Estimated messages:** 2

### Antigravity Prompt:

```
Read .skills/hebrew-rtl-nextjs/SKILL.md and .skills/wealthiq-dev/SKILL.md.

Full visual audit of the WealthIQ app. Go through every page and fix issues.

LANDING PAGE (/):
- Hero text should have a subtle gold gradient glow animation
- Feature cards should have hover state with gold border glow
- CTA button should pulse subtly on first load
- Mobile: stack layout vertically, increase CTA size
- Check: background radial gradient renders smoothly

QUESTIONNAIRE (/check):
- Step transitions should slide RTL (right to left = forward)
- Progress bar fills right-to-left (RTL native)
- All inputs have focus states with gold ring
- Mobile: inputs are full-width, buttons stack vertically
- Back/Next buttons: back has ChevronRight, next has ChevronLeft (RTL!)
- Error messages appear with a subtle shake animation

RESULTS (/results):
- Score gauge has a 1.5s entrance animation
- Category cards stagger in with 100ms delays
- Insight cards have colored left border matching impact level
- Net worth chart has animated bar fills
- Mobile: single column layout, cards full-width
- Simulator sliders have gold thumb color

GLOBAL:
- No white flash on page load (dark theme from start)
- No layout shift (CLS = 0)
- Scrollbar styled (thin, dark, gold thumb on hover)
- All text is actual Hebrew, not placeholder/lorem
- Font: Heebo loads from Google Fonts without FOUT

Fix everything you find. Screenshot before/after. Update PROGRESS.md.
```

---

## Sprint 7: SEO, Sharing & Deploy

**Goal:** Deploy to Vercel with proper SEO and social sharing.

**Primary tool:** Claude Code
**Estimated messages:** 2

### Claude Code Prompt:

```
Read CLAUDE.md. Check PROGRESS.md.

Prepare for production deployment:

1. SEO (app/layout.tsx and each page):
   - Root: title "WealthIQ — הציון הפיננסי שלך", description in Hebrew
   - /check: title "בדיקה פיננסית | WealthIQ"
   - /results: title "התוצאות שלך | WealthIQ"
   - Add JSON-LD structured data (WebApplication schema)
   - Add canonical URL
   - Add Hebrew Open Graph tags (og:locale = "he_IL")

2. OG Share Image (app/api/share/route.ts):
   - Use @vercel/og (ImageResponse) to generate share cards
   - Accept score + grade as query params
   - Design: dark background, gold score number, grade badge
   - Size: 1200x630 (standard OG)
   - Use in og:image meta tag on results page

3. Custom pages:
   - app/not-found.tsx — Hebrew 404 with link to home
   - Add error.tsx boundary for each route segment

4. Performance:
   - Ensure all images use next/image
   - Add `loading="lazy"` to below-fold content
   - Verify build output has no warnings

5. Create vercel.json if needed (usually not for Next.js)

6. Test: `npm run build` succeeds, `npm run start` works locally.

7. Deploy instructions in README:
   - vercel (if CLI installed)
   - Or: push to GitHub → connect to Vercel dashboard
   - Set ANTHROPIC_API_KEY in Vercel environment variables

Update PROGRESS.md. Commit: "Sprint 7: production ready"
```

---

## Sprint 8: Growth Features (Post-Launch)

These are optional, build them after launch based on user feedback.
No specific prompts — by this point you know the codebase.

Priority order:
1. **PDF Report Export** — highest LinkedIn impact (people share reports)
2. **User Accounts (Supabase)** — track scores over time
3. **OCR Upload** — snap pension statement, auto-fill fields
4. **Community Benchmarks** — "how do I compare to others in Tel Aviv"
5. **Email Digest** — monthly health update

---

## Agent Handoff Protocol

When you switch between Claude Code and Gemini CLI/Antigravity:

### Before stopping any agent:
```
Update PROGRESS.md with:
1. Which checkboxes you completed
2. What you were working on when you stopped
3. Any known bugs or incomplete work
4. Which files you modified
Commit everything: git add . && git commit -m "WIP: [what you did]"
```

### When starting a new agent:
```
Read these files in order:
1. PROGRESS.md — what's done, what's next
2. CLAUDE.md — project architecture
3. .skills/wealthiq-dev/SKILL.md — dev guide
4. git log --oneline -10 — recent changes

Then continue from where the last agent stopped.
```

### Quick status check command (paste into any agent):
```
Read PROGRESS.md. Then run:
- npm run build (does it compile?)
- npm run test (do tests pass?)
- npm run dev & check /, /check, /results in browser

Report: what works, what's broken, what's the next sprint to tackle.
```

---

## Message Budget Planner (Pro Plan)

Assuming ~45 messages/day on Pro plan:

| Day | Tool | Sprint | Messages | What to Accomplish |
|-----|------|--------|----------|--------------------|
| Day 1 | Claude Code | Sprint 1 | 2-3 | Fix all TypeScript errors, project compiles |
| Day 1 | Claude Code | Sprint 2 | 2-3 | Score engine tests all pass |
| Day 2 | Antigravity | Sprint 3 | 3-4 | Questionnaire all sections working |
| Day 2 | Claude Code | Sprint 4 | 2-3 | Results dashboard rendering |
| Day 3 | Claude Code | Sprint 5 | 2-3 | What-if simulator built |
| Day 3 | Antigravity | Sprint 6 | 2-3 | Visual polish pass |
| Day 4 | Claude Code | Sprint 7 | 2 | SEO + deploy to Vercel |

**Total: ~4 days to production** (with buffer for debugging)

**If you run out of Claude Code messages:**
- Switch to Gemini CLI with the fallback prompts above
- Antigravity has generous free-tier limits for UI work
- You can always do manual fixes — the codebase is well-structured

**Pro tip: Front-load Claude Code for logic (Sprints 1-2, 4-5), use Antigravity for UI (Sprints 3, 6).** This maximizes each tool's strength and spreads your message budget.

---

## Quick Reference: One-Line Status

Paste this into any agent to get oriented:

```
cat PROGRESS.md && echo "---BUILD---" && npm run build 2>&1 | tail -5 && echo "---TEST---" && npm run test 2>&1 | tail -10
```

---

*This document is your north star. When in doubt, check PROGRESS.md, read the sprint, paste the prompt. Ship it.*
