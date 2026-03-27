// Script to add domesticWHT data to tax-data.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tax-data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Check if domesticWHT already exists
if (content.includes('domesticWHT:')) {
    console.log('domesticWHT already exists in file');
    process.exit(0);
}

const domesticWHTData = `,

    // Domestic WHT rates (non-treaty rates) - what each country charges under domestic law
    domesticWHT: {
        // China
        "CN": {
            dividends: { rate: "20%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Hong Kong - NO WHT under domestic law
        "HK": {
            dividends: { rate: "0%", note: "Hong Kong does not impose WHT on dividends" },
            interest: { rate: "0%", note: "Hong Kong does not impose WHT on interest" },
            royalties: { rate: "1.475-4.95%", note: "Only on royalties paid to non-residents for use in HK" },
            services: { rate: "0%", note: "Hong Kong does not impose WHT on services" },
            management: { rate: "0%", note: "Hong Kong does not impose WHT on management fees" }
        },
        // Singapore
        "SG": {
            dividends: { rate: "0%", note: "Singapore does not impose WHT on dividends" },
            interest: { rate: "15%", note: "Standard domestic rate for interest" },
            royalties: { rate: "10%", note: "Standard domestic rate for royalties" },
            services: { rate: "15%", note: "For certain services" },
            management: { rate: "15%", note: "For management services" }
        },
        // Malaysia
        "MY": {
            dividends: { rate: "0%", note: "Malaysia does not impose WHT on dividends" },
            interest: { rate: "15%", note: "Standard domestic rate for interest" },
            royalties: { rate: "10%", note: "Standard domestic rate for royalties" },
            services: { rate: "10%", note: "For certain services" },
            management: { rate: "10%", note: "For management services" }
        },
        // Japan
        "JP": {
            dividends: { rate: "20.42%", note: "Standard domestic rate including reconstruction tax" },
            interest: { rate: "15.315%", note: "Standard domestic rate including reconstruction tax" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Korea (South)
        "KR": {
            dividends: { rate: "15.4%", note: "Standard domestic rate including local tax" },
            interest: { rate: "15.4%", note: "Standard domestic rate including local tax" },
            royalties: { rate: "22%", note: "Standard domestic rate including local tax" },
            services: { rate: "22%", note: "For certain services" },
            management: { rate: "22%", note: "For management services" }
        },
        // Thailand
        "TH": {
            dividends: { rate: "10%", note: "Standard domestic rate" },
            interest: { rate: "15%", note: "Standard domestic rate" },
            royalties: { rate: "15%", note: "Standard domestic rate" },
            services: { rate: "3%", note: "VAT on services, may apply WHT at 3-5%" },
            management: { rate: "5%", note: "Standard domestic rate for management fees" }
        },
        // Indonesia
        "ID": {
            dividends: { rate: "20%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "2-4%", note: "Article 23 WHT on services" },
            management: { rate: "2-4%", note: "Article 23 WHT on management services" }
        },
        // Vietnam
        "VN": {
            dividends: { rate: "5%", note: "Standard domestic rate" },
            interest: { rate: "5%", note: "Standard domestic rate" },
            royalties: { rate: "10%", note: "Standard domestic rate" },
            services: { rate: "5%", note: "Foreign contractor tax applies" },
            management: { rate: "5%", note: "Foreign contractor tax applies" }
        },
        // Philippines
        "PH": {
            dividends: { rate: "25%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "25%", note: "Standard domestic rate" },
            services: { rate: "25%", note: "Final tax on non-residents" },
            management: { rate: "25%", note: "Final tax on non-residents" }
        },
        // India
        "IN": {
            dividends: { rate: "20%", note: "Plus surcharge and cess" },
            interest: { rate: "20%", note: "Plus surcharge and cess" },
            royalties: { rate: "10%", note: "Standard domestic rate" },
            services: { rate: "10%", note: "Standard domestic rate" },
            management: { rate: "10%", note: "Standard domestic rate" }
        },
        // Australia
        "AU": {
            dividends: { rate: "30%", note: "Unfranked dividends" },
            interest: { rate: "10%", note: "Standard domestic rate" },
            royalties: { rate: "30%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // New Zealand
        "NZ": {
            dividends: { rate: "30%", note: "Standard domestic rate" },
            interest: { rate: "N/A", note: "No WHT on interest under domestic law (RWT may apply)" },
            royalties: { rate: "15%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // United Kingdom
        "GB": {
            dividends: { rate: "0%", note: "UK does not impose WHT on dividends" },
            interest: { rate: "20%", note: "Income tax may apply" },
            royalties: { rate: "20%", note: "Income tax may apply" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Germany
        "DE": {
            dividends: { rate: "25%", note: "Plus solidarity surcharge (5.5% of the tax)" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "15%", note: "Plus solidarity surcharge" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // France
        "FR": {
            dividends: { rate: "25%", note: "Standard domestic rate" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "33.33%", note: "Corporate tax rate applies" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Netherlands
        "NL": {
            dividends: { rate: "15%", note: "Standard domestic rate" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "0%", note: "No WHT on royalties under domestic law" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Luxembourg
        "LU": {
            dividends: { rate: "15%", note: "Standard domestic rate" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "0%", note: "No WHT on royalties under domestic law" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Switzerland
        "CH": {
            dividends: { rate: "35%", note: "Standard domestic rate - can be reduced with treaty" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "0%", note: "No WHT on royalties under domestic law" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Ireland
        "IE": {
            dividends: { rate: "25%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // United States
        "US": {
            dividends: { rate: "30%", note: "Standard domestic rate for non-residents" },
            interest: { rate: "30%", note: "Standard domestic rate for non-residents (portfolio interest exemption may apply)" },
            royalties: { rate: "30%", note: "Standard domestic rate for non-residents" },
            services: { rate: "30%", note: "Standard domestic rate for non-residents" },
            management: { rate: "30%", note: "Standard domestic rate for non-residents" }
        },
        // Canada
        "CA": {
            dividends: { rate: "25%", note: "Standard domestic rate" },
            interest: { rate: "25%", note: "Standard domestic rate (exemptions may apply)" },
            royalties: { rate: "25%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Mexico
        "MX": {
            dividends: { rate: "10%", note: "Standard domestic rate" },
            interest: { rate: "35%", note: "Standard domestic rate (reduced rates may apply)" },
            royalties: { rate: "35%", note: "Standard domestic rate" },
            services: { rate: "25%", note: "Standard domestic rate" },
            management: { rate: "25%", note: "Standard domestic rate" }
        },
        // Brazil
        "BR": {
            dividends: { rate: "0%", note: "No WHT on dividends under domestic law (as of 2025)" },
            interest: { rate: "15%", note: "Standard domestic rate" },
            royalties: { rate: "15%", note: "Standard domestic rate" },
            services: { rate: "15%", note: "Standard domestic rate" },
            management: { rate: "15%", note: "Standard domestic rate" }
        },
        // Russia
        "RU": {
            dividends: { rate: "15%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "20%", note: "Standard domestic rate" },
            management: { rate: "20%", note: "Standard domestic rate" }
        },
        // South Africa
        "ZA": {
            dividends: { rate: "20%", note: "Standard domestic rate" },
            interest: { rate: "0%", note: "No WHT on interest under domestic law" },
            royalties: { rate: "12%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // UAE
        "AE": {
            dividends: { rate: "0%", note: "UAE does not impose WHT on dividends" },
            interest: { rate: "0%", note: "UAE does not impose WHT on interest" },
            royalties: { rate: "0%", note: "UAE does not impose WHT on royalties" },
            services: { rate: "0%", note: "UAE does not impose WHT on services" },
            management: { rate: "0%", note: "UAE does not impose WHT on management fees" }
        },
        // Saudi Arabia
        "SA": {
            dividends: { rate: "5%", note: "Standard domestic rate" },
            interest: { rate: "5%", note: "Standard domestic rate" },
            royalties: { rate: "5-20%", note: "Rate depends on activity" },
            services: { rate: "5-20%", note: "Rate depends on service type" },
            management: { rate: "5-20%", note: "Rate depends on arrangement" }
        },
        // Taiwan
        "TW": {
            dividends: { rate: "21%", note: "Standard domestic rate" },
            interest: { rate: "20%", note: "Standard domestic rate" },
            royalties: { rate: "20%", note: "Standard domestic rate" },
            services: { rate: "N/A", note: "No WHT on services under domestic law" },
            management: { rate: "N/A", note: "No WHT on management fees under domestic law" }
        },
        // Macao
        "MO": {
            dividends: { rate: "0%", note: "Macao does not impose WHT on dividends" },
            interest: { rate: "0%", note: "Macao does not impose WHT on interest" },
            royalties: { rate: "0%", note: "Macao does not impose WHT on royalties" },
            services: { rate: "0%", note: "Macao does not impose WHT on services" },
            management: { rate: "0%", note: "Macao does not impose WHT on management fees" }
        }
    }
};`;

// Replace the closing brace
content = content.replace(
    /"MO_PT_royalties": "5%"[\r\n\s]+\}[\r\n\s]+\};/,
    `"MO_PT_royalties": "5%"${domesticWHTData}`
);

fs.writeFileSync(filePath, content);
console.log('domesticWHT data added successfully!');