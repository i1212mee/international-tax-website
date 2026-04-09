# International Tax Website - Project Status

## Last Updated
2026-04-09

## Completed Tasks

### 1. User Guidance Page (前置指引页面) ✅
- Added welcome screen with two options:
  - "Domestic Transaction" (国内交易) - directs to National Tax Rates section
  - "Cross-border Transaction" (跨境交易) - directs to Withholding Tax section
- Added clear descriptions for each option
- Added continue button to proceed to selected section

### 2. Domestic Withholding Tax Option ✅
- Added "Domestic Withholding Tax" option to National Tax Rates section
- Users can now query domestic WHT rates for dividends, interest, royalties, etc.
- Added support for displaying domestic WHT rates in the results

### 3. Database Updates ✅
- Updated MO_PT_royalties from 5% to 10%
- Added domesticWHT data structure to tax-data.js
- Included 30+ countries' domestic WHT rates

## Query Logic
1. Backend API attempts to crawl PwC website for real-time data
2. If crawling fails, uses local tax-data.js database
3. Returns results with source links for verification

## Weekly Update Process
When user says "请帮我更新税务数据库":
1. Use WebSearch to find latest tax rates from PwC, OECD, KPMG
2. Update tax-data.js with new data
3. Push to GitHub → Netlify auto-deploys

## Website URL
https://international-tax.netlify.app/

## Next Steps
- Monitor for user feedback
- Continue weekly database updates
- Add more countries' tax treaty data as needed
