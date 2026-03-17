---
name: hebrew-rtl-nextjs
description: "Master skill for building Hebrew-first, RTL-native Next.js applications. Covers bidirectional text handling, RTL layout pitfalls, Hebrew typography, number/currency formatting for Israeli context, Next.js App Router RTL setup, Tailwind RTL utilities, Framer Motion RTL animations, form input direction, and accessibility for Hebrew UIs. ALWAYS trigger when building any Hebrew or Arabic web application, any RTL layout, or any project targeting the Israeli market."
---

# Hebrew RTL Next.js Development

## Critical RTL Rules

### 1. Root HTML Setup
```tsx
// app/layout.tsx — ALWAYS set at root level
<html lang="he" dir="rtl">
```
Never set `dir="rtl"` on individual components — set it once at root.

### 2. Logical Properties (NOT physical)
```css
/* ❌ WRONG — breaks in RTL */
margin-left: 16px;
padding-right: 24px;
text-align: left;
float: right;

/* ✅ CORRECT — works in both directions */
margin-inline-start: 16px;
padding-inline-end: 24px;
text-align: start;
float: inline-end;
```

In Tailwind, use logical utilities:
```
ms-4  (margin-start)    instead of  ml-4
me-4  (margin-end)      instead of  mr-4
ps-4  (padding-start)   instead of  pl-4
pe-4  (padding-end)     instead of  pr-4
```

### 3. Flexbox Direction
Flexbox automatically reverses in RTL — `flex-row` becomes right-to-left.
```tsx
// ✅ This just works — items flow right-to-left automatically
<div className="flex gap-4">
  <span>ראשון</span>  {/* Appears on the right */}
  <span>שני</span>    {/* Appears on the left */}
</div>

// ⚠️ Be careful with order-dependent layouts
// Icons that should be on the "start" side:
<div className="flex items-center gap-2">
  <Icon />           {/* In RTL: appears on the RIGHT (start) */}
  <span>טקסט</span>  {/* In RTL: appears on the LEFT (end) */}
</div>
```

### 4. Arrow/Chevron Icons MUST Flip
```tsx
// ❌ WRONG — arrow points right (forward) in LTR but wrong in RTL
<ChevronRight className="h-4 w-4" />

// ✅ CORRECT — use RTL-aware logic
// "Next" arrow in RTL should point LEFT (ChevronLeft)
// "Back" arrow in RTL should point RIGHT (ChevronRight)
<ChevronLeft className="h-4 w-4" />   {/* Forward/Next in RTL */}
<ChevronRight className="h-4 w-4" />  {/* Back/Previous in RTL */}
```

### 5. Number & Currency Inputs
Numbers are ALWAYS LTR, even in RTL context:
```tsx
<input
  type="number"
  className="text-left"  /* Numbers stay left-aligned */
  style={{ direction: 'ltr' }}
  dir="ltr"
/>

// Currency display: symbol on the right in Hebrew
// Use Intl.NumberFormat:
new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
}).format(15000)  // → "‏15,000 ₪" or "₪15,000" depending on browser
```

### 6. Framer Motion RTL Animations
Slide animations must reverse in RTL:
```tsx
// ❌ WRONG — slides from left in LTR, but that's the END in RTL
const variants = {
  enter: { x: 100 },
  exit: { x: -100 },
};

// ✅ CORRECT for RTL — slide from start (right) to end (left)
const rtlSlideVariants = {
  enter: { x: -100, opacity: 0 },    // Enter from RIGHT (start in RTL)
  center: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },      // Exit to LEFT (end in RTL)
};
```

### 7. Progress Bars
```tsx
// ❌ WRONG — fills from left to right
<div className="h-2 bg-gray-200">
  <div style={{ width: '60%' }} className="h-full bg-blue-500" />
</div>

// ✅ CORRECT — CSS handles this automatically in RTL context
// The div fills from right to left because the parent has dir="rtl"
// No code change needed IF your root html has dir="rtl"
```

### 8. Bidirectional Text (Bidi)
Hebrew text mixed with English, numbers, or technical terms:
```tsx
// Phone numbers, emails, URLs need explicit LTR:
<span dir="ltr" className="inline-block">050-123-4567</span>

// Technical terms inside Hebrew:
<p>המסלול שלך הוא <bdi>S&P 500</bdi> עם תשואה של 8%</p>

// Percentage with Hebrew:
<span>דמי ניהול: <span dir="ltr">0.22%</span></span>
```

### 9. Hebrew Typography
```css
/* Best Hebrew web fonts (Google Fonts): */
font-family: 'Heebo', sans-serif;     /* Most popular, clean */
font-family: 'Assistant', sans-serif;  /* Modern, geometric */
font-family: 'Rubik', sans-serif;     /* Rounded, friendly */
font-family: 'Open Sans Hebrew';      /* Classic, professional */

/* Hebrew-specific typography rules: */
/* 1. Hebrew needs slightly more line-height than English */
line-height: 1.7;  /* vs 1.5 for English */

/* 2. Letter-spacing: NEVER add positive letter-spacing to Hebrew */
letter-spacing: normal;  /* Hebrew kerning is already built-in */

/* 3. Font weight: Hebrew often looks lighter than English at same weight */
/* Use 500-600 for body, 700-800 for headlines */
```

### 10. Form Validation Messages
```tsx
// Validation errors should appear on the START side (right in RTL)
<div className="relative">
  <input className="input-field" />
  <span className="absolute top-0 end-0 text-red-500">
    {/* Error icon on the start (right) side */}
  </span>
</div>
<p className="mt-1 text-sm text-red-400 text-start">שדה חובה</p>
```

### 11. Scrollbar Position
In RTL, scrollbars should appear on the LEFT side. Most browsers handle this automatically, but test in Chrome and Safari.

### 12. Tables
```tsx
// Tables in RTL: first column is on the RIGHT
// Tailwind's text-right becomes the start alignment
<table className="w-full text-start">
  <thead>
    <tr>
      <th>שם</th>      {/* Rightmost column (start) */}
      <th>ערך</th>     {/* Middle */}
      <th>סטטוס</th>   {/* Leftmost column (end) */}
    </tr>
  </thead>
</table>
```

## Testing RTL
1. Always test on actual Hebrew content, not just placeholder text
2. Test mixed content (Hebrew + English + numbers)
3. Check Chrome DevTools → Elements → toggle `dir="ltr"` to spot RTL-dependent layouts
4. Test on mobile Safari (iOS) — it handles RTL differently than Chrome
5. Use `document.dir` in JavaScript to detect direction
