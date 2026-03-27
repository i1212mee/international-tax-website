# International Tax Website Project Status

## 📋 Project Overview

**Project Name**: International Tax Rate Query Website  
**Live URL**: https://international-tax.netlify.app/  
**GitHub**: https://github.com/i1212mee/international-tax-website  
**Last Updated**: 2026-03-27

---

## ✅ Completed Features

### 1. National Tax Rates Query
- VAT/GST/SST/Turnover Tax (auto-detected by country)
- Corporate Income Tax (CIT)
- Personal Income Tax (PIT)
- Multi-tier rate display (e.g., China VAT: 13%, 9%, 6%, 3%, 0%)
- 150+ countries covered

### 2. Withholding Tax Query
- **Two-Section Display**:
  - Section 1: Domestic WHT Rate (Non-Treaty)
  - Section 2: Treaty WHT Rate
  - Applicable Rate (lower of the two)
- Bidirectional comparison support
- Batch comparison (multiple countries)
- Direction switching (One Payer → Multiple Payees OR Multiple Payers → One Payee)
- Payment types: Dividends, Interest, Royalties, Services, Management Fees

### 3. Real-time Search Indicators
- Live query timestamp
- Response time display
- Source type indicators (Official, Professional, Reference)
- PwC Tax Summaries links

### 4. Data Source & Disclaimer
- Yellow disclaimer banner on all pages
- Data source links for verification
- Clear warning about data accuracy

### 5. History & Bookmarks
- Recent query history (last 50)
- Bookmark favorite queries
- Quick re-run from history

### 6. Country Autocomplete
- Real-time filtering as you type
- Keyboard navigation support
- 150+ countries including Hong Kong, Macao, Taiwan

---

## 📁 File Structure

```
tax-website/
├── index.html          # Main page
├── styles.css          # Styling
├── countries.js        # 150+ country list
├── tax-data.js         # Tax rate database + domesticWHT data
├── app.js              # Main application logic
├── netlify/
│   └── functions/
│       └── search.js   # Backend API for web crawling
├── PROJECT_STATUS.md   # This file
└── DATA_UPDATE_GUIDE.md # Weekly update instructions
```

---

## ⚠️ Known Issues & Limitations

### Data Accuracy
- Local database may contain outdated rates
- Double taxation treaties are complex and may have limitations
- Always verify with official sources

### Real-time Crawling
- Backend API attempts to fetch from PwC but parsing is unreliable
- Primary data source is still local `tax-data.js`
- PwC links are correct but specific rate extraction may fail

### Treaty Limitations
- Some treaties only cover specific activities (e.g., HK-SG only covers shipping/air transport)
- Domestic rates shown separately for clarity

---

## 📅 Weekly Update Process

When asked to "update tax database":

1. Use WebSearch to verify current rates on PwC Tax Summaries
2. Cross-check with OECD Tax Database
3. Update `tax-data.js` with verified data
4. Update `domesticWHT` section for non-treaty rates
5. Push to GitHub (Netlify auto-deploys)

---

## 📝 Recent Changes (2026-03-27)

### Added
- `domesticWHT` data structure with 30+ countries' domestic WHT rates
- Two-section WHT display (Domestic Rate vs Treaty Rate)
- Applicable rate indicator (lower of domestic/treaty)
- Improved backend crawling with better country matching
- Yellow disclaimer banner

### Fixed
- Country matching issues (Indonesia now shows Indonesia, not India)
- Hong Kong WHT on interest correctly shows 0%
- Singapore domestic WHT rates displayed correctly
- Duplicate function definitions in app.js

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **PwC Tax Summaries** | https://taxsummaries.pwc.com/ |
| **OECD Tax Database** | https://www.oecd.org/tax/tax-policy/ |
| **KPMG Tax Rates** | https://home.kpmg/taxrates |
| **IBFD** | https://www.ibfd.org/ |

---

## 📧 Contact

For issues or updates, please open an issue on GitHub or contact the developer.