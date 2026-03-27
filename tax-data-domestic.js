// Domestic WHT rates (Non-Treaty rates) - Add this to the end of tax-data.js
// after the closing brace of the 'withholding' object (before the closing brace of TAX_DATA)

    // Domestic WHT rates (Non-Treaty rates) - Rates under domestic law without treaty benefits
    domesticWHT: {
        // Hong Kong
        "HK_dividends": { rate: "0%", note: "HK does not impose WHT on dividends under domestic law" },
        "HK_interest": { rate: "0%", note: "HK does not impose WHT on interest under domestic law" },
        "HK_royalties": { rate: "1.475-4.95%", note: "Royalties paid to non-residents are subject to withholding" },
        "HK_services": { rate: "0%", note: "No WHT on service fees under domestic law" },
        "HK_management": { rate: "0%", note: "No WHT on management fees under domestic law" },

        // Singapore
        "SG_dividends": { rate: "0%", note: "Singapore does not impose WHT on dividends" },
        "SG_interest": { rate: "15%", note: "Standard domestic rate for interest paid to non-residents" },
        "SG_royalties": { rate: "10%", note: "Standard domestic rate for royalties paid to non-residents" },
        "SG_services": { rate: "15%", note: "WHT applies to certain services performed by non-residents" },
        "SG_management": { rate: "15%", note: "WHT applies to management fees paid to non-residents" },

        // China
        "CN_dividends": { rate: "10%", note: "Standard domestic WHT rate for dividends" },
        "CN_interest": { rate: "10%", note: "Standard domestic WHT rate for interest" },
        "CN_royalties": { rate: "10%", note: "Standard domestic WHT rate for royalties" },
        "CN_services": { rate: "10%", note: "WHT on service fees paid to non-residents" },
        "CN_management": { rate: "10%", note: "WHT on management fees paid to non-residents" },

        // United States
        "US_dividends": { rate: "30%", note: "Default domestic rate for dividends paid to non-residents" },
        "US_interest": { rate: "30%", note: "Default domestic rate for interest (portfolio interest exemption may apply)" },
        "US_royalties": { rate: "30%", note: "Default domestic rate for royalties" },
        "US_services": { rate: "30%", note: "Default rate for FDAP income" },
        "US_management": { rate: "30%", note: "Default rate for FDAP income" },

        // United Kingdom
        "GB_dividends": { rate: "0%", note: "UK does not impose WHT on dividends" },
        "GB_interest": { rate: "20%", note: "Domestic WHT rate for interest (often reduced/exempt)" },
        "GB_royalties": { rate: "20%", note: "Domestic WHT rate for royalties" },
        "GB_services": { rate: "0%", note: "No WHT on service fees" },
        "GB_management": { rate: "0%", note: "No WHT on management fees" },

        // Germany
        "DE_dividends": { rate: "25%", note: "Kapitalertragsteuer (plus 5.5% solidarity surcharge)" },
        "DE_interest": { rate: "0%", note: "Germany generally does not impose WHT on interest" },
        "DE_royalties": { rate: "15%", note: "WHT on royalties (plus solidarity surcharge)" },
        "DE_services": { rate: "0%", note: "No WHT on service fees" },
        "DE_management": { rate: "0%", note: "No WHT on management fees" },

        // Japan
        "JP_dividends": { rate: "20.42%", note: "20% + 2.1% reconstruction tax" },
        "JP_interest": { rate: "15.315%", note: "15% + reconstruction tax" },
        "JP_royalties": { rate: "20.42%", note: "20% + 2.1% reconstruction tax" },
        "JP_services": { rate: "20.42%", note: "WHT on service fees" },
        "JP_management": { rate: "20.42%", note: "WHT on management fees" },

        // South Korea
        "KR_dividends": { rate: "25%", note: "Standard domestic WHT rate for dividends" },
        "KR_interest": { rate: "25%", note: "Standard domestic WHT rate for interest" },
        "KR_royalties": { rate: "25%", note: "Standard domestic WHT rate for royalties" },
        "KR_services": { rate: "20%", note: "WHT on service fees" },
        "KR_management": { rate: "20%", note: "WHT on management fees" },

        // India
        "IN_dividends": { rate: "10%", note: "Domestic WHT rate (plus surcharge and cess)" },
        "IN_interest": { rate: "20%", note: "Domestic WHT rate for interest" },
        "IN_royalties": { rate: "10%", note: "Domestic WHT rate" },
        "IN_services": { rate: "10%", note: "WHT on fees for technical services" },
        "IN_management": { rate: "10%", note: "WHT on management fees" },

        // Australia
        "AU_dividends": { rate: "30%", note: "Domestic rate for unfranked dividends" },
        "AU_interest": { rate: "10%", note: "Domestic WHT rate for interest" },
        "AU_royalties": { rate: "30%", note: "Domestic WHT rate for royalties" },
        "AU_services": { rate: "0%", note: "No WHT on service fees" },
        "AU_management": { rate: "0%", note: "No WHT on management fees" },

        // Canada
        "CA_dividends": { rate: "25%", note: "Part XIII tax on dividends" },
        "CA_interest": { rate: "25%", note: "Part XIII tax on interest (often exempt)" },
        "CA_royalties": { rate: "25%", note: "Part XIII tax on royalties" },
        "CA_services": { rate: "0%", note: "No WHT on service fees" },
        "CA_management": { rate: "0%", note: "No WHT on management fees" },

        // Malaysia
        "MY_dividends": { rate: "0%", note: "Malaysia does not impose WHT on dividends" },
        "MY_interest": { rate: "15%", note: "WHT on interest paid to non-residents" },
        "MY_royalties": { rate: "10%", note: "WHT on royalties paid to non-residents" },
        "MY_services": { rate: "10%", note: "WHT on certain services" },
        "MY_management": { rate: "10%", note: "WHT on management fees" },

        // Indonesia
        "ID_dividends": { rate: "20%", note: "PPh 26 rate for dividends paid to non-residents" },
        "ID_interest": { rate: "20%", note: "PPh 26 rate for interest paid to non-residents" },
        "ID_royalties": { rate: "20%", note: "PPh 26 rate for royalties paid to non-residents" },
        "ID_services": { rate: "20%", note: "PPh 26 rate for services" },
        "ID_management": { rate: "20%", note: "PPh 26 rate for management fees" },

        // Thailand
        "TH_dividends": { rate: "10%", note: "Domestic WHT rate for dividends" },
        "TH_interest": { rate: "15%", note: "Domestic WHT rate for interest" },
        "TH_royalties": { rate: "15%", note: "Domestic WHT rate for royalties" },
        "TH_services": { rate: "15%", note: "WHT on service fees" },
        "TH_management": { rate: "15%", note: "WHT on management fees" },

        // Vietnam
        "VN_dividends": { rate: "5%", note: "Domestic WHT rate for dividends" },
        "VN_interest": { rate: "5%", note: "Domestic WHT rate for interest" },
        "VN_royalties": { rate: "10%", note: "Domestic WHT rate for royalties" },
        "VN_services": { rate: "10%", note: "WHT on service fees" },
        "VN_management": { rate: "10%", note: "WHT on management fees" },

        // Philippines
        "PH_dividends": { rate: "25%", note: "Domestic WHT rate for dividends" },
        "PH_interest": { rate: "20%", note: "Domestic WHT rate for interest" },
        "PH_royalties": { rate: "25%", note: "Domestic WHT rate for royalties" },
        "PH_services": { rate: "25%", note: "WHT on service fees" },
        "PH_management": { rate: "25%", note: "WHT on management fees" },

        // Taiwan
        "TW_dividends": { rate: "21%", note: "Domestic WHT rate for dividends" },
        "TW_interest": { rate: "20%", note: "Domestic WHT rate for interest" },
        "TW_royalties": { rate: "20%", note: "Domestic WHT rate for royalties" },
        "TW_services": { rate: "20%", note: "WHT on service fees" },
        "TW_management": { rate: "20%", note: "WHT on management fees" },

        // UAE
        "AE_dividends": { rate: "0%", note: "UAE does not impose WHT on dividends" },
        "AE_interest": { rate: "0%", note: "UAE does not impose WHT on interest" },
        "AE_royalties": { rate: "0%", note: "UAE does not impose WHT on royalties" },
        "AE_services": { rate: "0%", note: "No WHT on service fees" },
        "AE_management": { rate: "0%", note: "No WHT on management fees" },

        // Saudi Arabia
        "SA_dividends": { rate: "5%", note: "Domestic WHT rate for dividends" },
        "SA_interest": { rate: "5%", note: "Domestic WHT rate for interest" },
        "SA_royalties": { rate: "15%", note: "Domestic WHT rate for royalties" },
        "SA_services": { rate: "5-20%", note: "WHT on service fees" },
        "SA_management": { rate: "5-20%", note: "WHT on management fees" },

        // Switzerland
        "CH_dividends": { rate: "35%", note: "High domestic WHT rate (Verrechnungssteuer)" },
        "CH_interest": { rate: "0%", note: "No WHT on interest" },
        "CH_royalties": { rate: "0%", note: "No WHT on royalties" },
        "CH_services": { rate: "0%", note: "No WHT on service fees" },
        "CH_management": { rate: "0%", note: "No WHT on management fees" },

        // Netherlands
        "NL_dividends": { rate: "15%", note: "Domestic WHT rate for dividends" },
        "NL_interest": { rate: "0%", note: "No WHT on interest" },
        "NL_royalties": { rate: "0%", note: "No WHT on royalties" },
        "NL_services": { rate: "0%", note: "No WHT on service fees" },
        "NL_management": { rate: "0%", note: "No WHT on management fees" },

        // France
        "FR_dividends": { rate: "25%", note: "Standard domestic WHT rate for dividends" },
        "FR_interest": { rate: "0%", note: "France generally does not impose WHT on interest" },
        "FR_royalties": { rate: "33.33%", note: "Domestic WHT rate for royalties" },
        "FR_services": { rate: "0%", note: "No WHT on service fees" },
        "FR_management": { rate: "0%", note: "No WHT on management fees" },

        // Italy
        "IT_dividends": { rate: "26%", note: "Domestic WHT rate for dividends" },
        "IT_interest": { rate: "26%", note: "Domestic WHT rate for interest" },
        "IT_royalties": { rate: "22%", note: "Domestic WHT rate for royalties" },
        "IT_services": { rate: "22%", note: "WHT on service fees" },
        "IT_management": { rate: "22%", note: "WHT on management fees" },

        // Spain
        "ES_dividends": { rate: "19%", note: "Domestic WHT rate for dividends" },
        "ES_interest": { rate: "19%", note: "Domestic WHT rate for interest" },
        "ES_royalties": { rate: "24%", note: "Domestic WHT rate for royalties" },
        "ES_services": { rate: "24%", note: "WHT on service fees" },
        "ES_management": { rate: "24%", note: "WHT on management fees" },

        // Macao
        "MO_dividends": { rate: "0%", note: "Macao does not impose WHT on dividends" },
        "MO_interest": { rate: "0%", note: "Macao does not impose WHT on interest" },
        "MO_royalties": { rate: "0%", note: "Macao does not impose WHT on royalties" },
        "MO_services": { rate: "0%", note: "No WHT on service fees" },
        "MO_management": { rate: "0%", note: "No WHT on management fees" },

        // Brazil
        "BR_dividends": { rate: "0%", note: "Brazil does not impose WHT on dividends" },
        "BR_interest": { rate: "15%", note: "Standard domestic WHT rate for interest" },
        "BR_royalties": { rate: "15%", note: "Standard domestic WHT rate for royalties" },
        "BR_services": { rate: "15%", note: "WHT on service fees" },
        "BR_management": { rate: "15%", note: "WHT on management fees" },

        // Mexico
        "MX_dividends": { rate: "10%", note: "Domestic WHT rate for dividends" },
        "MX_interest": { rate: "35%", note: "WHT on interest (may vary)" },
        "MX_royalties": { rate: "35%", note: "WHT on royalties" },
        "MX_services": { rate: "25%", note: "WHT on service fees" },
        "MX_management": { rate: "25%", note: "WHT on management fees" },

        // Russia
        "RU_dividends": { rate: "15%", note: "Domestic WHT rate for dividends" },
        "RU_interest": { rate: "20%", note: "Domestic WHT rate for interest" },
        "RU_royalties": { rate: "20%", note: "Domestic WHT rate for royalties" },
        "RU_services": { rate: "20%", note: "WHT on service fees" },
        "RU_management": { rate: "20%", note: "WHT on management fees" },

        // South Africa
        "ZA_dividends": { rate: "20%", note: "Dividends tax" },
        "ZA_interest": { rate: "0%", note: "No WHT on interest" },
        "ZA_royalties": { rate: "12%", note: "Domestic WHT rate for royalties" },
        "ZA_services": { rate: "0%", note: "No WHT on service fees" },
        "ZA_management": { rate: "0%", note: "No WHT on management fees" }
    }

// Also add this function at the end of the file:

/*
// Function to get domestic WHT rate for a country and payment type
function getDomesticWHTRate(countryCode, paymentType) {
    const key = `${countryCode}_${paymentType}`;
    const domesticRate = TAX_DATA.domesticWHT?.[key];
    if (domesticRate) {
        return domesticRate;
    }
    return {
        rate: getDefaultWHTRate(paymentType),
        note: "Default rate - verify with local tax authority"
    };
}

// Update the export line:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TAX_DATA, getDefaultWHTRate, getDomesticWHTRate };
}
*/