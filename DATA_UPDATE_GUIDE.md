# Tax Data Update Guide

## Quick Update Process (Weekly)

### Step 1: Open this file and tell AI:
"请帮我更新税务数据库，以下是本周需要更新的国家："

### Step 2: AI will:
1. Search for latest tax rates from official sources
2. Update the `tax-data.js` file
3. Push changes to GitHub

---

## Countries to Update Regularly

### High Priority (Major Economies)
- [ ] United States (US)
- [ ] China (CN)
- [ ] Japan (JP)
- [ ] Germany (DE)
- [ ] United Kingdom (GB)
- [ ] France (FR)
- [ ] India (IN)
- [ ] Australia (AU)

### Asia-Pacific
- [ ] Singapore (SG)
- [ ] Hong Kong (HK)
- [ ] Malaysia (MY)
- [ ] Thailand (TH)
- [ ] Vietnam (VN)
- [ ] Indonesia (ID)
- [ ] Philippines (PH)
- [ ] South Korea (KR)
- [ ] Taiwan (TW)
- [ ] New Zealand (NZ)

### Europe
- [ ] Netherlands (NL)
- [ ] Switzerland (CH)
- [ ] Ireland (IE)
- [ ] Luxembourg (LU)
- [ ] Belgium (BE)
- [ ] Austria (AT)
- [ ] Sweden (SE)
- [ ] Norway (NO)
- [ ] Denmark (DK)
- [ ] Finland (FI)
- [ ] Italy (IT)
- [ ] Spain (ES)
- [ ] Poland (PL)
- [ ] Czech Republic (CZ)

### Americas
- [ ] Canada (CA)
- [ ] Mexico (MX)
- [ ] Brazil (BR)
- [ ] Argentina (AR)
- [ ] Chile (CL)
- [ ] Colombia (CO)

### Middle East & Africa
- [ ] UAE (AE)
- [ ] Saudi Arabia (SA)
- [ ] Israel (IL)
- [ ] South Africa (ZA)
- [ ] Egypt (EG)

---

## Recent Tax Rate Changes (2025-2026)

| Country | Change | Effective Date | Notes |
|---------|--------|----------------|-------|
| Malaysia | SST expansion: Service Tax 6%/8% | July 2025 | Digital Service Tax raised to 8% |
| Indonesia | VAT nominal rate 12% | Jan 2025 | **Effective rate remains 11%** for most goods/services via DPP Nilai Lain calculation. Luxury goods: 12% |
| Estonia | CIT increased from 20% to 22% | Jan 2025 | Will increase to 24% in 2026 |
| France | CIT increased from 25.83% to 36.13% | 2025 | Significant increase |
| Lithuania | CIT increased from 15% to 16% | Jan 2025 | Will increase to 17% in 2026 |
| Slovakia | CIT increased from 21% to 24% | 2025 | |
| Russia | CIT increased from 20% to 25% | 2025 | |
| Namibia | CIT reduced from 32% to 30% | 2025 | |
| Luxembourg | CIT reduced from 25% to 24% | 2025 | |
| Iceland | CIT reduced from 21% to 20% | 2025 | |

---

## Data Sources

### Primary Sources (Most Reliable)
1. **PwC Tax Summaries**: https://taxsummaries.pwc.com/ - Comprehensive tax guides for 150+ countries
2. **OECD Tax Database**: https://www.oecd.org/tax/tax-policy/ - Official OECD tax statistics
3. **KPMG Corporate Tax Rates**: https://kpmg.com/dk/en/services/tax/corporate-tax/corporate-tax-rates-table.html
4. **Tax Foundation**: https://taxfoundation.org/data/all/global/corporate-tax-rates-by-country-2025/

### Official Tax Authorities (First-Hand Data)
- China: https://www.chinatax.gov.cn/
- Hong Kong: https://www.ird.gov.hk/
- Singapore: https://www.iras.gov.sg/
- Malaysia: https://lhdn.gov.my/
- Indonesia: https://www.pajak.go.id/
- US: https://www.irs.gov/
- UK: https://www.gov.uk/government/organisations/hm-revenue-customs
- More in `search.js` `getOfficialTaxAuthority()` function

### Withholding Tax Treaty Sources
- **OECD MLI Database**: https://www.oecd.org/tax/treaties/
- **IBFD**: https://www.ibfd.org/ (Subscription required)
- **PwC WHT Quick Chart**: https://taxsummaries.pwc.com/quick-charts/withholding-tax-wht-rates

---

## Update History

| Date | Countries Updated | Notes |
|------|-------------------|-------|
| 2026-03-26 | Malaysia | Updated SST rates to 2025 (Service Tax 6%/8%) |
| 2026-03-26 | Hong Kong | Fixed WHT rates (No WHT on interest/dividends) |
| 2026-03-26 | Indonesia | Added note about VAT effective rate (11% vs 12%) |
| | | |

---

## Known Issues

### Countries with Complex Tax Structures
1. **Indonesia**: VAT nominal rate is 12%, but effective rate for most goods/services is 11% via DPP Nilai Lain
2. **Malaysia**: Uses SST (Sales & Service Tax), not VAT/GST
3. **Hong Kong**: No WHT on interest/dividends, only royalties
4. **UAE**: CIT 9% + 15% QDMTT for large MNEs
5. **India**: GST has multiple rates (0.25%, 1.5%, 3%, 5%, 12%, 18%, 28%)

### Treaty Limitations
- HK-SG treaty: Only covers shipping and air transport
- HK-US treaty: Only covers shipping and air transport
- Some treaties have limited scope (e.g., only certain income types)

---

## How to Request Update

Copy and paste this template:

```
请帮我更新以下国家的税务数据：

1. [Country Name] - [Tax Type to update]
2. [Country Name] - [Tax Type to update]
...

请从PwC和官方来源获取最新数据。
```

Example:
```
请帮我更新以下国家的税务数据：

1. Indonesia - VAT rate
2. Thailand - VAT rate
3. Vietnam - CIT rate

请从PwC和官方来源获取最新数据。
```