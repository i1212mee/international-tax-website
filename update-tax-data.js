const fs = require('fs');

// Read the file
let content = fs.readFileSync('tax-data.js', 'utf8');

// Define the domestic WHT data
const domesticWHT = `"MO_PT_royalties": "5%"
    },

    // Domestic Withholding Tax Rates (Non-Treaty Rates)
    // These are the rates that apply when no Double Taxation Treaty exists
    domesticWHT: {
        // China (CN)
        "CN_interest": { rate: "20%", note: "Standard rate for interest paid to non-residents" },
        "CN_dividends": { rate: "10%", note: "Standard rate for dividends paid to non-residents" },
        "CN_royalties": { rate: "10%", note: "Standard rate for royalties paid to non-residents" },
        "CN_services": { rate: "15%", note: "Technical service fees paid to non-residents" },
        "CN_management": { rate: "15%", note: "Management fees paid to non-residents" },

        // Hong Kong (HK)
        "HK_interest": { rate: "0%", note: "Hong Kong does not impose WHT on interest" },
        "HK_dividends": { rate: "0%", note: "Hong Kong does not impose WHT on dividends" },
        "HK_royalties": { rate: "2.475-4.95%", note: "Royalties are subject to withholding under certain conditions" },
        "HK_services": { rate: "0%", note: "No WHT on services in Hong Kong" },
        "HK_management": { rate: "0%", note: "No WHT on management fees in Hong Kong" },

        // Singapore (SG)
        "SG_interest": { rate: "15%", note: "Standard rate for interest paid to non-residents" },
        "SG_dividends": { rate: "0%", note: "Singapore does not impose WHT on dividends" },
        "SG_royalties": { rate: "10%", note: "Standard rate for royalties paid to non-residents" },
        "SG_services": { rate: "17%", note: "Technical services provided by non-residents" },
        "SG_management": { rate: "17%", note: "Management fees paid to non-residents" },

        // United States (US)
        "US_interest": { rate: "30%", note: "Standard rate for FDAP income including interest" },
        "US_dividends": { rate: "30%", note: "Standard rate for dividends paid to non-residents" },
        "US_royalties": { rate: "30%", note: "Standard rate for royalties paid to non-residents" },
        "US_services": { rate: "30%", note: "Technical services performed outside US" },
        "US_management": { rate: "30%", note: "Management fees paid to non-residents" },

        // United Kingdom (UK/GB)
        "GB_interest": { rate: "20%", note: "Standard rate for interest paid to non-residents" },
        "GB_dividends": { rate: "0%", note: "No WHT on dividends in the UK" },
        "GB_royalties": { rate: "20%", note: "Standard rate for royalties paid to non-residents" },
        "GB_services": { rate: "20%", note: "Technical services paid to non-residents" },
        "GB_management": { rate: "20%", note: "Management fees paid to non-residents" },

        // Japan (JP)
        "JP_interest": { rate: "20.42%", note: "Standard rate including local income tax" },
        "JP_dividends": { rate: "20.42%", note: "Standard rate for dividends paid to non-residents" },
        "JP_royalties": { rate: "20.42%", note: "Standard rate for royalties paid to non-residents" },
        "JP_services": { rate: "20.42%", note: "Technical services paid to non-residents" },
        "JP_management": { rate: "20.42%", note: "Management fees paid to non-residents" },

        // South Korea (KR)
        "KR_interest": { rate: "25%", note: "Standard rate for interest paid to non-residents" },
        "KR_dividends": { rate: "25%", note: "Standard rate for dividends paid to non-residents" },
        "KR_royalties": { rate: "25%", note: "Standard rate for royalties paid to non-residents" },
        "KR_services": { rate: "25%", note: "Technical services paid to non-residents" },
        "KR_management": { rate: "25%", note: "Management fees paid to non-residents" },

        // Malaysia (MY)
        "MY_interest": { rate: "15%", note: "Standard rate for interest paid to non-residents" },
        "MY_dividends": { rate: "0%", note: "Malaysia does not impose WHT on dividends" },
        "MY_royalties": { rate: "10%", note: "Standard rate for royalties paid to non-residents" },
        "MY_services": { rate: "10%", note: "Technical services paid to non-residents" },
        "MY_management": { rate: "10%", note: "Management fees paid to non-residents" },

        // Australia (AU)
        "AU_interest": { rate: "10%", note: "Standard rate for interest paid to non-residents" },
        "AU_dividends": { rate: "30%", note: "Unfranked dividends paid to non-residents" },
        "AU_royalties": { rate: "30%", note: "Standard rate for royalties paid to non-residents" },
        "AU_services": { rate: "30%", note: "Technical services paid to non-residents" },
        "AU_management": { rate: "30%", note: "Management fees paid to non-residents" },

        // Germany (DE)
        "DE_interest": { rate: "0%", note: "No WHT on interest under domestic law" },
        "DE_dividends": { rate: "25%", note: "Standard rate plus solidarity surcharge (5.5%)" },
        "DE_royalties": { rate: "15%", note: "Standard rate for royalties paid to non-residents" },
        "DE_services": { rate: "15%", note: "Technical services paid to non-residents" },
        "DE_management": { rate: "15%", note: "Management fees paid to non-residents" },

        // France (FR)
        "FR_interest": { rate: "0%", note: "No WHT on interest under domestic law" },
        "FR_dividends": { rate: "30%", note: "Standard rate for dividends paid to non-residents" },
        "FR_royalties": { rate: "33.33%", note: "Standard rate for royalties paid to non-residents" },
        "FR_services": { rate: "15%", note: "Technical services paid to non-residents" },
        "FR_management": { rate: "15%", note: "Management fees paid to non-residents" },

        // Netherlands (NL)
        "NL_interest": { rate: "0%", note: "No WHT on interest under domestic law" },
        "NL_dividends": { rate: "15%", note: "Standard rate for dividends paid to non-residents" },
        "NL_royalties": { rate: "0%", note: "No WHT on royalties under domestic law" },
        "NL_services": { rate: "0%", note: "No WHT on services under domestic law" },
        "NL_management": { rate: "0%", note: "No WHT on management fees under domestic law" }
    }
};`;

// Replace the pattern
const pattern = `"MO_PT_royalties": "5%"
    }
};`;

content = content.replace(pattern, domesticWHT);

// Write the file
fs.writeFileSync('tax-data.js', content, 'utf8');

console.log('tax-data.js has been updated with domesticWHT data!');