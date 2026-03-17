---
name: israeli-fintech-data
description: "Reference skill for Israeli financial system knowledge required by WealthIQ. Covers: Israeli pension system (קרנות פנסיה, ביטוח מנהלים, קופות גמל), contribution rates, tax rules, regulatory constraints (ייעוץ פנסיוני licensing), data sources (גמל נט, פנסיה נט, data.gov.il, הלמ"ס), real estate market data, and insurance benchmarks. ALWAYS consult when writing financial calculations, Hebrew financial terminology, regulatory disclaimers, or data source integrations for the Israeli market."
---

# Israeli Financial System Reference

## 1. Pension System (מערכת הפנסיה)

### Product Types
| Product | Hebrew | Description | Key Characteristic |
|---------|--------|-------------|-------------------|
| Pension Fund | קרן פנסיה | Most common. Includes disability + survivors insurance | Mandatory component. Most Israelis have this |
| Managers Insurance | ביטוח מנהלים | Older product, being phased out for new employees | Higher fees, more flexibility |
| Provident Fund | קופת גמל לקצבה | Savings-only, no built-in insurance | Good for those who want separate insurance |
| Training Fund | קרן השתלמות | Tax-advantaged savings, matures after 6 years (3 for academics) | Not a pension — but a key Israeli savings vehicle |
| Investment Provident | קופת גמל להשקעה | Post-2016 product, liquid after penalties | Popular for supplementary savings |
| Child Savings | חיסכון לכל ילד | Government-initiated savings for every child | ₪50/month from National Insurance |

### Mandatory Contribution Rates (2025-2026)
```
Employee contribution:      6.0%  of gross salary
Employer pension:           6.5%  of gross salary
Employer disability:        up to 2.5% (from employer's pension portion)
Employer severance:         8.33% of gross salary (Section 14)
────────────────────────────────────────────
Total to pension fund:      12.5% (employee + employer pension)
Total including severance:  20.83%
```

### Section 14 (סעיף 14)
- Employer severance contributions go directly into pension fund
- On termination (even voluntary), employee gets accumulated severance
- Most common arrangement in Israel since 2008

### Investment Tracks (מסלולי השקעה)
| Track | Hebrew | Typical Equity % | Risk Level |
|-------|--------|------------------|------------|
| General | כללי | ~50% | Medium |
| Stocks | מניות | ~80-90% | High |
| Bonds | אג"ח | ~10-20% | Low |
| Age-adapted <50 | תלוי גיל עד 50 | ~60-70% | Medium-High |
| Age-adapted 50-60 | תלוי גיל 50-60 | ~40-50% | Medium |
| Age-adapted 60+ | תלוי גיל 60+ | ~20-30% | Low-Medium |
| S&P 500 tracker | עוקב S&P 500 | ~95% | High |
| Halacha | הלכתי | ~40-50% | Medium |
| Shekel cash | כספי שקלי | ~0-5% | Very Low |

### Management Fees (דמי ניהול)
Two types of fees in Israel:
1. **Fee on accumulated balance** (דמי ניהול מצבירה) — annual % of total balance
2. **Fee on deposits** (דמי ניהול מהפקדה) — % of each monthly contribution

Market averages (2025):
| Product | Balance Fee Avg | Deposit Fee Avg |
|---------|----------------|-----------------|
| Pension Fund | 0.22% | 1.49% |
| Managers Insurance | 0.72% | 2.0% |
| Provident Fund | 0.53% | 0% |

Low-fee benchmarks:
- Balance fee: 0.08-0.10% (achievable by negotiation)
- Deposit fee: 0.00-0.50% (negotiable)

### Retirement Ages
- Male: 67 (has been stable)
- Female: 65 (gradually rising from 62, expected to reach 65)

## 2. Regulatory Constraints

### The Critical Line: Educational Info vs. Licensed Advice

**Licensed activity (requires רישיון יעוץ פנסיוני from רשות שוק ההון):**
- "You should switch from Fund A to Fund B"
- "Based on your situation, I recommend product X"
- Any personalized recommendation to buy/sell/switch specific products

**Permitted educational activity (no license needed):**
- "Your fees are X% vs. the market average of Y%"
- "Israelis your age typically have Z allocation"
- "If you increase contributions by ₪500/month, your projected balance would be..."
- General information about pension system mechanics
- Calculators showing mathematical projections
- Comparisons to statistical averages (not to specific products)

### Safe Language Patterns
```
✅ "שווה לבדוק" (worth checking)
✅ "כדאי לשקול" (worth considering)
✅ "ייתכן שכדאי לבחון" (it might be worth examining)
✅ "הממוצע בקטגוריה הוא..." (the category average is...)
✅ "חוסכים בגילך בדרך כלל..." (savers your age typically...)

❌ "כדאי להחליף ל-" (you should switch to)
❌ "אני ממליץ על" (I recommend)
❌ "עדיף לעבור ל-" (it's better to move to)
❌ Any specific fund/product name as a recommendation
```

### Disclaimer (must appear on every results page)
```
מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, 
או המלצה לפעולה כלשהי. לקבלת ייעוץ מותאם אישית, 
פנה/י ליועץ פנסיוני מורשה.
```

## 3. Data Sources

### גמל נט (Gemel-Net) — Ministry of Finance
- **URL:** `gemelnet.cma.gov.il`
- **What it has:** Fund returns, fees, asset allocation, fund details
- **API access:** XML endpoints available
  ```
  http://gemelnet.cma.gov.il/tsuot/ui...adTkfDivuach=YYYYMM&kupot=FUND_ID&Dochot=1&sug=4
  ```
  Replace `YYYYMM` with month and `FUND_ID` with fund number
- **Update frequency:** Monthly
- **Note:** iGemel-net.co.il pulls from this same API with a friendlier UI

### פנסיה נט (Pensia-Net) — Ministry of Finance
- **URL:** `pensyanet.cma.gov.il`
- **What it has:** Pension fund specific data, disability coverage details

### data.gov.il
- **URL:** `data.gov.il/dataset/gemelnet`
- **What it has:** Structured datasets, CKAN API
- **Note:** Sometimes has client-side errors; the XML endpoints above are more reliable

### הלמ"ס (CBS — Central Bureau of Statistics)
- **URL:** `cbs.gov.il`
- **What it has:** Salary data by age/industry, housing price indices, CPI
- **Key datasets:**
  - Average salary by age group
  - Housing price index by city
  - Consumer price index (CPI)

### Madlan (מדלן)
- **URL:** `madlan.co.il`
- **What it has:** Real estate transaction data, price per sqm by neighborhood
- **Note:** No public API, but useful for manual benchmark research

## 4. Israeli Tax Context (Relevant to Scoring)

### Key Tax Brackets (2025)
| Annual Income (₪) | Rate |
|-------------------|------|
| 0 – 84,120 | 10% |
| 84,121 – 120,720 | 14% |
| 120,721 – 193,800 | 20% |
| 193,801 – 269,280 | 31% |
| 269,281 – 721,560 | 35% |
| 721,561 – 1,443,120 | 47% |
| Above 1,443,120 | 50% |

### Quick Net Salary Estimation
If user doesn't provide net salary:
```typescript
function estimateNetSalary(grossMonthly: number): number {
  const annualGross = grossMonthly * 12;
  // Simplified progressive tax + social security
  // This is a rough estimate — real calculation is much more complex
  let effectiveRate: number;
  if (annualGross <= 84_120) effectiveRate = 0.22; // tax + bituach leumi + health
  else if (annualGross <= 120_720) effectiveRate = 0.27;
  else if (annualGross <= 193_800) effectiveRate = 0.30;
  else if (annualGross <= 269_280) effectiveRate = 0.35;
  else effectiveRate = 0.40;
  
  return Math.round(grossMonthly * (1 - effectiveRate));
}
```

## 5. Real Estate Context

### Israeli Mortgage Rules
- **Minimum down payment:** 25% for first apartment, 50% for investment property
- **Maximum LTV:** 75% first home, 50% investment
- **Bank of Israel regulations:** No more than 1/3 of mortgage can be variable rate
- **Common track types:** Prime-based, fixed unlinked, CPI-linked fixed, CPI-linked variable

### Current Rates (approximate, 2025-2026)
- Prime rate: ~6.0%
- Typical mortgage spread: Prime + 0.3% to Prime + 1.5%
- Fixed unlinked 10yr: ~4.5-5.5%
- CPI-linked fixed: ~3.0-4.0%

## 6. Insurance Context

### ביטוח לאומי (National Insurance / Social Security)
- Provides basic disability, unemployment, old-age allowance
- NOT a substitute for private insurance
- Old-age allowance: ~₪1,800-3,600/month (depends on years of contribution)

### Key Insurance Types
| Type | Hebrew | Typical Monthly Cost | Why Important |
|------|--------|---------------------|---------------|
| Disability | אובדן כושר עבודה | ₪200-500 | Covers income if can't work |
| Life | ביטוח חיים | ₪100-300 | Critical with dependents |
| Health | ביטוח בריאות משלים | ₪100-400 | Beyond basic קופת חולים |
| Property | ביטוח דירה | ₪50-150 | Mortgage banks often require |

### Insurance Scoring Benchmarks
- Life insurance: 10x annual salary coverage recommended
- Disability: 75% of net salary replacement
- Without disability insurance + dependents = major risk flag
- Without will + dependents = estate planning gap
