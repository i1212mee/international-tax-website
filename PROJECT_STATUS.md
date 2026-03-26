# International Tax Rate Query Website

## Project Overview

An international tax rate query website that allows users to search for:
- **National Tax Rates**: VAT/GST/SST, Income Tax, Business Tax
- **Withholding Tax Rates**: Cross-border payment tax rates with treaty information

## Live Website

**https://international-tax.netlify.app/**

---

## Features Implemented

### 1. National Tax Rates Query
- VAT/GST/SST automatic detection based on country
- Multiple tax tiers display (e.g., China VAT: 13%, 9%, 6%, 3%, 0%)
- Income Tax (Corporate & Individual)
- Business Tax

### 2. Withholding Tax Query
- Single query: Payer Country → Payee Country → Payment Type
- Batch comparison: Compare WHT rates across multiple countries
- Bidirectional comparison: Show both directions (Payer→Payee and Payee→Payer)
- Treaty scope detection (e.g., HK-SG treaty only covers shipping/air transport)

### 3. Country Input Auto-Complete
- Real-time filtering as user types
- Keyboard navigation support
- 150+ countries/regions covered

### 4. History & Bookmarks
- Query history saved locally (last 50 queries)
- Bookmark favorite queries
- Quick replay from history/bookmarks

### 5. Real-time Data (Partial)
- Backend fetches PwC Tax Summaries pages
- Attempts to parse tax rates from HTML
- Shows live indicator when real-time data available
- Provides official source links for verification

---

## File Structure

```
tax-website/
├── index.html          # Main page
├── styles.css          # Styles
├── countries.js        # 150+ countries list
├── tax-data.js         # Local tax rate database
├── app.js              # Main application logic
├── netlify/
│   └── functions/
│       └── search.js   # Serverless function for real-time search
├── package.json        # Netlify config
└── netlify.toml        # Netlify deployment config
```

---

## Known Issues & TODO

### Issues Found by User
1. **Data Accuracy**: Some tax rates may be outdated or incorrect
   - Example: Malaysia SST was showing wrong rates (fixed)
   - Need continuous data updates

2. **Real-time Parsing**: 
   - PwC page parsing is basic, may not capture all rates
   - Need more robust HTML parsing

3. **Source Links**:
   - Links point to PwC main pages, not specific rate tables
   - User cannot directly see the specific rate from the link

### TODO List
1. [ ] Improve real-time data parsing for all tax types
2. [ ] Add more countries' official tax authority links
3. [ ] Implement proper WHT treaty database
4. [ ] Add rate update timestamp for each country
5. [ ] Consider using official APIs (OECD, IBFD) for more reliable data

---

## Recent Changes

### 2026-03-26
- Fixed Malaysia SST display (was showing VAT, now shows SST correctly)
- Updated Malaysia SST rates to 2025: Sales Tax 5%/10%, Service Tax 6%/8%
- Enhanced real-time data parsing from PwC
- Added live indicator when real-time data available
- Added data disclaimer for local database rates
- Fixed HK-SG WHT issue (no comprehensive treaty for interest/dividends)

---

## Deployment

### GitHub Repository
https://github.com/i1212mee/international-tax-website

### Netlify Deployment
- Connected to GitHub repo
- Auto-deploys on push to main branch
- Serverless functions enabled

### Push Updates
Run the batch file:
```
push-realtime.bat
```

Or manually:
```bash
cd d:\CodeFuse\claude-test-project\tax-website
git add .
git commit -m "Your commit message"
git push
```

---

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Netlify Serverless Functions
- **Data Sources**: 
  - Local database (tax-data.js)
  - PwC Tax Summaries (web scraping)
  - Official tax authority links

---

## User Feedback Log

| Date | Issue | Status |
|------|-------|--------|
| 2026-03-26 | Malaysia showing VAT instead of SST | Fixed |
| 2026-03-26 | Malaysia SST rates outdated | Fixed (updated to 2025) |
| 2026-03-26 | HK→SG Interest WHT showing 15% (incorrect) | Fixed (should be 0%, no comprehensive treaty) |
| 2026-03-26 | Source links only show homepage | Partial fix (added specific pages) |