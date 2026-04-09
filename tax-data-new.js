// Basic tax rate data for countries
// This serves as a baseline - real-time data will be fetched from web sources

const TAX_DATA = {
    // National Tax Rates
    national: {
        "US": {
            name: "United States",
            vat: { standard: null, note: "No federal VAT. State sales taxes apply." },
            gst: { standard: null, note: "No federal GST. State sales taxes apply." },
            salesTax: {
                tiers: [
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Certain items" },
                    { rate: "0-10.25%", type: "standard", label: "Standard Rate", note: "Varies by state and locality" }
                ],
                note: "State sales taxes vary significantly"
            },
            incomeTax: {
                tiers: [
                    { rate: "21%", type: "corporate", label: "Corporate Tax", note: "Federal corporate tax rate" },
                    { rate: "10-37%", type: "individual", label: "Individual Tax", note: "Progressive rates (10%, 12%, 22%, 24%, 32%, 35%, 37%)" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "State and local business taxes" }
                ]
            }
        },
        "GB": {
            name: "United Kingdom",
            vat: {
                tiers: [
                    { rate: "20%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "5%", type: "reduced", label: "Reduced Rate", note: "Energy, children's car seats, mobility aids" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Books, food, children's clothes" }
                ],
                note: "VAT - Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "25%", type: "corporate", label: "Corporate Tax", note: "For profits over £250,000" },
                    { rate: "19%", type: "corporate-small", label: "Small Profits Rate", note: "For profits under £50,000" },
                    { rate: "20%", type: "individual-basic", label: "Basic Rate", note: "£12,571-£50,270" },
                    { rate: "40%", type: "individual-higher", label: "Higher Rate", note: "£50,271-£125,140" },
                    { rate: "45%", type: "individual-additional", label: "Additional Rate", note: "Over £125,140" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Rates", note: "Based on property value" }
                ]
            }
        },
        "DE": {
            name: "Germany",
            vat: {
                tiers: [
                    { rate: "19%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "7%", type: "reduced", label: "Reduced Rate", note: "Food, books, newspapers, medical aids" }
                ],
                note: "Mehrwertsteuer"
            },
            incomeTax: {
                tiers: [
                    { rate: "15%", type: "corporate", label: "Corporate Tax", note: "Plus solidarity surcharge (5.5%)" },
                    { rate: "14-45%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "14-17%", type: "standard", label: "Gewerbesteuer", note: "Trade tax - varies by municipality" }
                ]
            }
        },
        "FR": {
            name: "France",
            vat: {
                tiers: [
                    { rate: "20%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "10%", type: "intermediate", label: "Intermediate Rate", note: "Restaurants, transport, hotels" },
                    { rate: "5.5%", type: "reduced", label: "Reduced Rate", note: "Food, books, water" },
                    { rate: "2.1%", type: "super-reduced", label: "Super Reduced Rate", note: "Medicines, newspapers" }
                ],
                note: "TVA - Taxe sur la Valeur Ajoutée"
            },
            incomeTax: {
                tiers: [
                    { rate: "25%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "15%", type: "corporate-small", label: "Small Business Rate", note: "For profits up to �?2,500" },
                    { rate: "0-45%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "CFE/CVAE", note: "Local economic contribution" }
                ]
            }
        },
        "CN": {
            name: "China",
            vat: {
                tiers: [
                    { rate: "13%", type: "standard", label: "Standard Rate", note: "Sale of goods, processing, repair, maintenance services" },
                    { rate: "9%", type: "reduced-1", label: "Reduced Rate 1", note: "Transportation, postal services, construction, real estate" },
                    { rate: "6%", type: "reduced-2", label: "Reduced Rate 2", note: "Modern services, financial services, life services" },
                    { rate: "3%", type: "small", label: "Small-scale Taxpayer", note: "Simplified rate for small taxpayers" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "增值税 - Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "25%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "15%", type: "corporate-high-tech", label: "High-tech Enterprises", note: "Certified high-tech companies" },
                    { rate: "20%", type: "corporate-small", label: "Small & Micro Enterprises", note: "Eligible small businesses" },
                    { rate: "3-45%", type: "individual", label: "Individual Tax", note: "Progressive rates (7 brackets)" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "Replaced by VAT since 2016" }
                ]
            }
        },
        "HK": {
            name: "Hong Kong, China",
            vat: { standard: null, note: "No VAT/GST in Hong Kong" },
            gst: { standard: null, note: "No VAT/GST in Hong Kong" },
            incomeTax: {
                tiers: [
                    { rate: "16.5%", type: "corporate", label: "Corporate Tax (Profits Tax)", note: "First HKD 2M at 8.25%, remainder at 16.5%" },
                    { rate: "15%", type: "individual", label: "Salaries Tax (Standard)", note: "Max 15% on net income" },
                    { rate: "2-17%", type: "individual-progressive", label: "Salaries Tax (Progressive)", note: "Progressive rates on net income" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "16.5%", type: "standard", label: "Profits Tax", note: "Same as corporate tax" }
                ]
            }
        },
        "MO": {
            name: "Macao, China",
            vat: { standard: null, note: "No VAT/GST in Macao" },
            gst: { standard: null, note: "No VAT/GST in Macao" },
            incomeTax: {
                tiers: [
                    { rate: "12%", type: "corporate", label: "Corporate Tax (Complementary Tax)", note: "Standard rate, max 12%" },
                    { rate: "0-12%", type: "individual", label: "Professional Tax", note: "Progressive rates on employment income" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "0-5%", type: "standard", label: "Industrial Tax", note: "Varies by business type" }
                ]
            }
        },
        "TW": {
            name: "Taiwan, China",
            vat: {
                tiers: [
                    { rate: "5%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "Business Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "5-40%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "5%", type: "standard", label: "Business Tax", note: "VAT equivalent" }
                ]
            }
        },
        "JP": {
            name: "Japan",
            vat: {
                tiers: [
                    { rate: "10%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "8%", type: "reduced", label: "Reduced Rate", note: "Food, beverages, newspapers" }
                ],
                note: "消費�?- Consumption Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "23.2%", type: "corporate", label: "Corporate Tax", note: "Effective rate including local taxes" },
                    { rate: "5-45%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Enterprise Tax", note: "Prefectural tax" }
                ]
            }
        },
        "AU": {
            name: "Australia",
            vat: { standard: null, note: "No VAT in Australia" },
            gst: {
                tiers: [
                    { rate: "10%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "GST-free", note: "Food, medical services, education" }
                ],
                note: "Goods and Services Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "30%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "25%", type: "corporate-small", label: "Small Business Rate", note: "Turnover < $50m" },
                    { rate: "0-45%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "CA": {
            name: "Canada",
            vat: { standard: null, note: "No VAT in Canada" },
            gst: {
                tiers: [
                    { rate: "5%", type: "federal", label: "Federal GST", note: "Nationwide" },
                    { rate: "13%", type: "hst-on", label: "HST Ontario", note: "Federal + Ontario" },
                    { rate: "15%", type: "hst-atlantic", label: "HST Atlantic", note: "Federal + Atlantic provinces" },
                    { rate: "0%", type: "zero", label: "Zero-rated", note: "Basic groceries, prescriptions" }
                ],
                note: "Federal GST plus provincial taxes (PST/HST)"
            },
            incomeTax: {
                tiers: [
                    { rate: "15%", type: "corporate-federal", label: "Federal Corporate", note: "Federal rate" },
                    { rate: "11-16%", type: "corporate-provincial", label: "Provincial Corporate", note: "Varies by province" },
                    { rate: "15-33%", type: "individual-federal", label: "Federal Individual", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "Provincial business taxes" }
                ]
            }
        },
        "IN": {
            name: "India",
            vat: { standard: null, note: "No VAT in India" },
            gst: {
                tiers: [
                    { rate: "5%", type: "rate-1", label: "Rate 1", note: "Essential items" },
                    { rate: "12%", type: "rate-2", label: "Rate 2", note: "Standard goods" },
                    { rate: "18%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "28%", type: "rate-4", label: "Highest Rate", note: "Luxury items, sin goods" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Essential commodities" }
                ],
                note: "Goods and Services Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "25.17%", type: "corporate", label: "Corporate Tax", note: "Including surcharge and cess" },
                    { rate: "15%", type: "corporate-new", label: "New Manufacturing", note: "New manufacturing companies" },
                    { rate: "5-30%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "Replaced by GST" }
                ]
            }
        },
        "SG": {
            name: "Singapore",
            vat: { standard: null, note: "No VAT in Singapore" },
            gst: {
                tiers: [
                    { rate: "9%", type: "standard", label: "Standard Rate", note: "Most goods and services (2024)" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, international services" },
                    { rate: "Exempt", type: "exempt", label: "Exempt", note: "Financial services, residential property" }
                ],
                note: "Goods and Services Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "17%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "0-22%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "KR": {
            name: "South Korea",
            vat: {
                tiers: [
                    { rate: "10%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "부가가치세 - Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "24.2%", type: "corporate", label: "Corporate Tax", note: "Including local tax" },
                    { rate: "6-45%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "Local business taxes" }
                ]
            }
        },
        "BR": {
            name: "Brazil",
            vat: {
                tiers: [
                    { rate: "17-20%", type: "standard", label: "ICMS", note: "State VAT - varies by state" },
                    { rate: "7-12%", type: "interstate", label: "Interstate Rate", note: "For interstate transactions" },
                    { rate: "4%", type: "reduced", label: "Reduced Rate", note: "Basic necessities" }
                ],
                note: "ICMS - State VAT, IPI - Federal VAT, PIS/COFINS - Contributions"
            },
            incomeTax: {
                tiers: [
                    { rate: "34%", type: "corporate", label: "Corporate Tax", note: "Including social contributions" },
                    { rate: "0-27.5%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "ISS - Service tax (municipal)" }
                ]
            }
        },
        "MX": {
            name: "Mexico",
            vat: {
                tiers: [
                    { rate: "16%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "8%", type: "border", label: "Border Zone Rate", note: "Northern border zone" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Basic food, medicines, books" }
                ],
                note: "IVA - Impuesto al Valor Agregado"
            },
            incomeTax: {
                tiers: [
                    { rate: "30%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "1.92-35%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "RU": {
            name: "Russia",
            vat: {
                tiers: [
                    { rate: "20%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "10%", type: "reduced", label: "Reduced Rate", note: "Food, children's goods, medical" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "НДС - NDS"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "6% or 15%", type: "corporate-simplified", label: "Simplified System", note: "For small businesses" },
                    { rate: "13%", type: "individual", label: "Individual Tax", note: "Flat rate for residents" },
                    { rate: "30%", type: "individual-nonres", label: "Non-resident Tax", note: "For non-residents" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "Regional taxes" }
                ]
            }
        },
        "AE": {
            name: "United Arab Emirates",
            vat: {
                tiers: [
                    { rate: "5%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, international transport" },
                    { rate: "Exempt", type: "exempt", label: "Exempt", note: "Financial services, residential" }
                ],
                note: "VAT introduced in 2018"
            },
            incomeTax: {
                tiers: [
                    { rate: "9%", type: "corporate", label: "Corporate Tax", note: "Effective June 2023" },
                    { rate: "0%", type: "corporate-freezone", label: "Free Zone", note: "Qualifying free zone businesses" },
                    { rate: "0%", type: "individual", label: "Individual Tax", note: "No personal income tax" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "SA": {
            name: "Saudi Arabia",
            vat: {
                tiers: [
                    { rate: "15%", type: "standard", label: "Standard Rate", note: "Most goods and services (July 2020)" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, medicines, medical equipment" }
                ],
                note: "VAT increased from 5% to 15% in July 2020"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "For foreign companies" },
                    { rate: "2.5%", type: "zakat", label: "Zakat", note: "For Saudi/GCC shareholders" },
                    { rate: "0%", type: "individual", label: "Individual Tax", note: "No personal income tax" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "Zakat for Saudi/GCC companies" }
                ]
            }
        },
        "CH": {
            name: "Switzerland",
            vat: {
                tiers: [
                    { rate: "8.1%", type: "standard", label: "Standard Rate", note: "Most goods and services (2024)" },
                    { rate: "3.8%", type: "reduced", label: "Reduced Rate", note: "Accommodation, cultural events" },
                    { rate: "2.6%", type: "special", label: "Special Rate", note: "Food, books, newspapers, medicines" }
                ],
                note: "MWST - Mehrwertsteuer"
            },
            incomeTax: {
                tiers: [
                    { rate: "11-24%", type: "corporate", label: "Corporate Tax", note: "Varies by canton" },
                    { rate: "0-45%", type: "individual", label: "Individual Tax", note: "Varies by canton" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "Varies", type: "standard", label: "Business Tax", note: "Cantonal and municipal taxes" }
                ]
            }
        },
        "NL": {
            name: "Netherlands",
            vat: {
                tiers: [
                    { rate: "21%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "9%", type: "reduced", label: "Reduced Rate", note: "Food, books, medicines, labor" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, intra-EU supplies" }
                ],
                note: "BTW - Belasting Toegevoegde Waarde"
            },
            incomeTax: {
                tiers: [
                    { rate: "25.8%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "19%", type: "corporate-small", label: "Lower Rate", note: "For profits up to �?00,000" },
                    { rate: "9-49.5%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "SE": {
            name: "Sweden",
            vat: {
                tiers: [
                    { rate: "25%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "12%", type: "reduced", label: "Reduced Rate", note: "Food, hotels, cultural events" },
                    { rate: "6%", type: "low", label: "Low Rate", note: "Books, newspapers, passenger transport" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "Moms - Mervärdesskatt"
            },
            incomeTax: {
                tiers: [
                    { rate: "20.6%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "0-52%", type: "individual", label: "Individual Tax", note: "Including local taxes" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "NO": {
            name: "Norway",
            vat: {
                tiers: [
                    { rate: "25%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "15%", type: "reduced", label: "Reduced Rate", note: "Food and beverages" },
                    { rate: "12%", type: "low", label: "Low Rate", note: "Cinema, transport, hotels" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, newspapers" }
                ],
                note: "MVA - Merverdiavgift"
            },
            incomeTax: {
                tiers: [
                    { rate: "22%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "0-47.4%", type: "individual", label: "Individual Tax", note: "Including wealth tax" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "IT": {
            name: "Italy",
            vat: {
                tiers: [
                    { rate: "22%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "10%", type: "reduced", label: "Reduced Rate", note: "Food, restaurants, hotels" },
                    { rate: "5%", type: "low", label: "Low Rate", note: "Social housing, certain food" },
                    { rate: "4%", type: "super-reduced", label: "Super Reduced", note: "Basic necessities" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "IVA - Imposta sul Valore Aggregato"
            },
            incomeTax: {
                tiers: [
                    { rate: "24%", type: "corporate", label: "Corporate Tax (IRES)", note: "Standard rate" },
                    { rate: "3.9%", type: "regional", label: "Regional Tax (IRAP)", note: "Regional tax on production" },
                    { rate: "23-43%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "3.9%", type: "standard", label: "IRAP", note: "Regional tax on productive activities" }
                ]
            }
        },
        "ES": {
            name: "Spain",
            vat: {
                tiers: [
                    { rate: "21%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "10%", type: "reduced", label: "Reduced Rate", note: "Food, restaurants, hotels" },
                    { rate: "4%", type: "super-reduced", label: "Super Reduced", note: "Basic necessities, books" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, intra-EU" }
                ],
                note: "IVA - Impuesto sobre el Valor Añadido"
            },
            incomeTax: {
                tiers: [
                    { rate: "25%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "23%", type: "corporate-small", label: "Reduced Rate", note: "Small companies" },
                    { rate: "19-47%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "PL": {
            name: "Poland",
            vat: {
                tiers: [
                    { rate: "23%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "8%", type: "reduced", label: "Reduced Rate", note: "Food, newspapers, medical" },
                    { rate: "5%", type: "low", label: "Low Rate", note: "Books, food, medical equipment" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, intra-EU" }
                ],
                note: "PTU - Podatek od towarów i usług"
            },
            incomeTax: {
                tiers: [
                    { rate: "19%", type: "corporate", label: "Corporate Tax (CIT)", note: "Standard rate" },
                    { rate: "9%", type: "corporate-small", label: "Small Business Rate", note: "Revenue < �?M" },
                    { rate: "12-32%", type: "individual", label: "Individual Tax (PIT)", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "TW": {
            name: "Taiwan",
            vat: {
                tiers: [
                    { rate: "5%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "Business Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "5-40%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "5%", type: "standard", label: "Business Tax", note: "VAT equivalent" }
                ]
            }
        },
        "TH": {
            name: "Thailand",
            vat: {
                tiers: [
                    { rate: "7%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "5-35%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "Replaced by VAT" }
                ]
            }
        },
        "VN": {
            name: "Vietnam",
            vat: {
                tiers: [
                    { rate: "10%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "5%", type: "reduced", label: "Reduced Rate", note: "Food, medicine, education" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, construction" }
                ],
                note: "GTGT - Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "20%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "5-35%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "Replaced by VAT" }
                ]
            }
        },
        "MY": {
            name: "Malaysia",
            vat: { standard: null, note: "No VAT in Malaysia" },
            gst: { standard: null, note: "GST replaced by SST in 2018" },
            sst: {
                tiers: [
                    { rate: "5%", type: "sales-reduced", label: "Sales Tax (Reduced)", note: "Selected non-essential goods, premium items" },
                    { rate: "10%", type: "sales-standard", label: "Sales Tax (Standard)", note: "Most taxable goods, luxury items" },
                    { rate: "6%", type: "service-reduced", label: "Service Tax (Reduced)", note: "F&B, telecom, parking, logistics, construction, private healthcare" },
                    { rate: "8%", type: "service-standard", label: "Service Tax (Standard)", note: "Most services, leasing, financial services" },
                    { rate: "8%", type: "digital", label: "Digital Service Tax", note: "Digital services (increased from 6% in 2024)" }
                ],
                note: "Sales and Service Tax (SST) - Updated July 2025"
            },
            incomeTax: {
                tiers: [
                    { rate: "24%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "15%", type: "corporate-small", label: "Small Business Rate", note: "For SMEs" },
                    { rate: "0-30%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "5-10%", type: "sales", label: "Sales Tax", note: "5% or 10% depending on goods" },
                    { rate: "6-8%", type: "service", label: "Service Tax", note: "6% or 8% depending on services" }
                ]
            }
        },
        "ID": {
            name: "Indonesia",
            vat: {
                tiers: [
                    { rate: "12%", type: "standard", label: "Standard Rate (Nominal)", note: "Effective 11% for most goods/services via DPP Nilai Lain" },
                    { rate: "11%", type: "effective", label: "Effective Rate", note: "Most goods and services (DPP Nilai Lain calculation)" },
                    { rate: "12%", type: "luxury", label: "Luxury Goods", note: "Actual 12% applies" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "PPN - Value Added Tax (Jan 2025: Nominal 12%, Effective 11% for most)"
            },
            incomeTax: {
                tiers: [
                    { rate: "22%", type: "corporate", label: "Corporate Tax", note: "Standard rate" },
                    { rate: "5-30%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        },
        "PH": {
            name: "Philippines",
            vat: {
                tiers: [
                    { rate: "12%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports, certain sales" },
                    { rate: "Exempt", type: "exempt", label: "VAT-Exempt", note: "Certain transactions" }
                ],
                note: "Value Added Tax"
            },
            incomeTax: {
                tiers: [
                    { rate: "25%", type: "corporate", label: "Corporate Tax", note: "Standard rate (CREATE law)" },
                    { rate: "20%", type: "corporate-small", label: "Small Business Rate", note: "For SMEs" },
                    { rate: "0-35%", type: "individual", label: "Individual Tax", note: "Progressive rates" }
                ]
            },
            businessTax: {
                tiers: [
                    { rate: "N/A", type: "standard", label: "Business Tax", note: "No separate business tax" }
                ]
            }
        }
    },

    // Withholding Tax Rates (sample data for major treaty rates)
    withholding: {
        // Format: "PAYER_PAYEE_TYPE": rate
        // Types: dividends, interest, royalties, services, management

        // US as payer
        "US_GB_dividends": "0%",
        "US_GB_interest": "0%",
        "US_GB_royalties": "0%",
        "US_DE_dividends": "5%",
        "US_DE_interest": "0%",
        "US_DE_royalties": "0%",
        "US_FR_dividends": "5%",
        "US_FR_interest": "0%",
        "US_FR_royalties": "0%",
        "US_JP_dividends": "0-10%",
        "US_JP_interest": "0%",
        "US_JP_royalties": "0%",
        "US_CN_dividends": "10%",
        "US_CN_interest": "10%",
        "US_CN_royalties": "10%",
        "US_IN_dividends": "15%",
        "US_IN_interest": "15%",
        "US_IN_royalties": "15%",
        "US_SG_dividends": "0%",
        "US_SG_interest": "15%",
        "US_SG_royalties": "10%",
        "US_AU_dividends": "15%",
        "US_AU_interest": "10%",
        "US_AU_royalties": "10%",
        "US_CA_dividends": "5%",
        "US_CA_interest": "0%",
        "US_CA_royalties": "0-10%",
        "US_KR_dividends": "10%",
        "US_KR_interest": "12%",
        "US_KR_royalties": "15%",
        "US_TW_dividends": "10%",
        "US_TW_interest": "10%",
        "US_TW_royalties": "10%",
        "US_TH_dividends": "10%",
        "US_TH_interest": "10%",
        "US_TH_royalties": "5-8%",
        "US_MY_dividends": "0%",
        "US_MY_interest": "10%",
        "US_MY_royalties": "10%",
        "US_PH_dividends": "10%",
        "US_PH_interest": "10%",
        "US_PH_royalties": "10%",
        "US_VN_dividends": "5%",
        "US_VN_interest": "0%",
        "US_VN_royalties": "10%",
        "US_ID_dividends": "10%",
        "US_ID_interest": "10%",
        "US_ID_royalties": "10%",

        // GB as payer
        "GB_US_dividends": "0%",
        "GB_US_interest": "0%",
        "GB_US_royalties": "0%",
        "GB_DE_dividends": "5%",
        "GB_DE_interest": "0%",
        "GB_DE_royalties": "0%",
        "GB_FR_dividends": "0%",
        "GB_FR_interest": "0%",
        "GB_FR_royalties": "0%",
        "GB_JP_dividends": "0%",
        "GB_JP_interest": "0%",
        "GB_JP_royalties": "0%",
        "GB_CN_dividends": "10%",
        "GB_CN_interest": "10%",
        "GB_CN_royalties": "10%",
        "GB_IN_dividends": "15%",
        "GB_IN_interest": "10%",
        "GB_IN_royalties": "10%",
        "GB_SG_dividends": "0%",
        "GB_SG_interest": "15%",
        "GB_SG_royalties": "10%",
        "GB_AU_dividends": "0%",
        "GB_AU_interest": "0%",
        "GB_AU_royalties": "0%",
        "GB_CA_dividends": "0%",
        "GB_CA_interest": "0%",
        "GB_CA_royalties": "0%",
        "GB_KR_dividends": "10%",
        "GB_KR_interest": "10%",
        "GB_KR_royalties": "10%",
        "GB_HK_dividends": "0%",
        "GB_HK_interest": "0%",
        "GB_HK_royalties": "2.5-10%",

        // DE as payer
        "DE_US_dividends": "5%",
        "DE_US_interest": "0%",
        "DE_US_royalties": "0%",
        "DE_FR_dividends": "15%",
        "DE_FR_interest": "0%",
        "DE_FR_royalties": "0%",
        "DE_JP_dividends": "10%",
        "DE_JP_interest": "10%",
        "DE_JP_royalties": "10%",
        "DE_CN_dividends": "10%",
        "DE_CN_interest": "10%",
        "DE_CN_royalties": "10%",
        "DE_IN_dividends": "10%",
        "DE_IN_interest": "10%",
        "DE_IN_royalties": "10%",
        "DE_SG_dividends": "10%",
        "DE_SG_interest": "0%",
        "DE_SG_royalties": "10%",
        "DE_GB_dividends": "5%",
        "DE_GB_interest": "0%",
        "DE_GB_royalties": "0%",
        "DE_CH_dividends": "0%",
        "DE_CH_interest": "0%",
        "DE_CH_royalties": "0%",

        // CN as payer
        "CN_US_dividends": "10%",
        "CN_US_interest": "10%",
        "CN_US_royalties": "10%",
        "CN_GB_dividends": "10%",
        "CN_GB_interest": "10%",
        "CN_GB_royalties": "10%",
        "CN_DE_dividends": "10%",
        "CN_DE_interest": "10%",
        "CN_DE_royalties": "10%",
        "CN_JP_dividends": "10%",
        "CN_JP_interest": "10%",
        "CN_JP_royalties": "10%",
        "CN_SG_dividends": "5%",
        "CN_SG_interest": "7%",
        "CN_SG_royalties": "10%",
        "CN_KR_dividends": "10%",
        "CN_KR_interest": "10%",
        "CN_KR_royalties": "10%",
        "CN_FR_dividends": "10%",
        "CN_FR_interest": "10%",
        "CN_FR_royalties": "10%",
        "CN_AU_dividends": "15%",
        "CN_AU_interest": "10%",
        "CN_AU_royalties": "10%",
        "CN_MY_dividends": "0%",
        "CN_MY_interest": "10%",
        "CN_MY_royalties": "10%",
        "CN_TH_dividends": "10%",
        "CN_TH_interest": "10%",
        "CN_TH_royalties": "15%",
        "CN_VN_dividends": "10%",
        "CN_VN_interest": "10%",
        "CN_VN_royalties": "10%",
        "CN_ID_dividends": "10%",
        "CN_ID_interest": "10%",
        "CN_ID_royalties": "10%",

        // JP as payer
        "JP_US_dividends": "0-10%",
        "JP_US_interest": "0%",
        "JP_US_royalties": "0%",
        "JP_GB_dividends": "0%",
        "JP_GB_interest": "0%",
        "JP_GB_royalties": "0%",
        "JP_CN_dividends": "10%",
        "JP_CN_interest": "10%",
        "JP_CN_royalties": "10%",
        "JP_DE_dividends": "10%",
        "JP_DE_interest": "10%",
        "JP_DE_royalties": "10%",
        "JP_FR_dividends": "0%",
        "JP_FR_interest": "0%",
        "JP_FR_royalties": "0%",
        "JP_SG_dividends": "0%",
        "JP_SG_interest": "10%",
        "JP_SG_royalties": "10%",
        "JP_KR_dividends": "5%",
        "JP_KR_interest": "10%",
        "JP_KR_royalties": "10%",
        "JP_TH_dividends": "10%",
        "JP_TH_interest": "10%",
        "JP_TH_royalties": "10%",
        "JP_MY_dividends": "0%",
        "JP_MY_interest": "10%",
        "JP_MY_royalties": "8%",

        // SG as payer
        "SG_US_dividends": "0%",
        "SG_US_interest": "15%",
        "SG_US_royalties": "10%",
        "SG_GB_dividends": "0%",
        "SG_GB_interest": "15%",
        "SG_GB_royalties": "10%",
        "SG_CN_dividends": "5%",
        "SG_CN_interest": "7%",
        "SG_CN_royalties": "10%",
        "SG_IN_dividends": "10%",
        "SG_IN_interest": "15%",
        "SG_IN_royalties": "10%",
        "SG_JP_dividends": "0%",
        "SG_JP_interest": "10%",
        "SG_JP_royalties": "10%",
        "SG_KR_dividends": "5%",
        "SG_KR_interest": "10%",
        "SG_KR_royalties": "10%",
        "SG_MY_dividends": "0%",
        "SG_MY_interest": "15%",
        "SG_MY_royalties": "8%",
        "SG_TH_dividends": "10%",
        "SG_TH_interest": "10%",
        "SG_TH_royalties": "5%",
        "SG_AU_dividends": "0%",
        "SG_AU_interest": "10%",
        "SG_AU_royalties": "10%",
        "SG_DE_dividends": "10%",
        "SG_DE_interest": "0%",
        "SG_DE_royalties": "10%",
        "SG_FR_dividends": "5%",
        "SG_FR_interest": "0%",
        "SG_FR_royalties": "0%",

        // IN as payer
        "IN_US_dividends": "15%",
        "IN_US_interest": "15%",
        "IN_US_royalties": "15%",
        "IN_GB_dividends": "15%",
        "IN_GB_interest": "10%",
        "IN_GB_royalties": "10%",
        "IN_SG_dividends": "10%",
        "IN_SG_interest": "15%",
        "IN_SG_royalties": "10%",
        "IN_JP_dividends": "5%",
        "IN_JP_interest": "10%",
        "IN_JP_royalties": "10%",
        "IN_DE_dividends": "10%",
        "IN_DE_interest": "10%",
        "IN_DE_royalties": "10%",
        "IN_CN_dividends": "10%",
        "IN_CN_interest": "10%",
        "IN_CN_royalties": "10%",
        "IN_AU_dividends": "15%",
        "IN_AU_interest": "15%",
        "IN_AU_royalties": "10%",
        "IN_MY_dividends": "0%",
        "IN_MY_interest": "10%",
        "IN_MY_royalties": "10%",

        // AU as payer
        "AU_US_dividends": "15%",
        "AU_US_interest": "10%",
        "AU_US_royalties": "10%",
        "AU_GB_dividends": "0%",
        "AU_GB_interest": "0%",
        "AU_GB_royalties": "0%",
        "AU_JP_dividends": "5%",
        "AU_JP_interest": "10%",
        "AU_JP_royalties": "10%",
        "AU_CN_dividends": "15%",
        "AU_CN_interest": "10%",
        "AU_CN_royalties": "10%",
        "AU_SG_dividends": "0%",
        "AU_SG_interest": "10%",
        "AU_SG_royalties": "10%",
        "AU_IN_dividends": "15%",
        "AU_IN_interest": "15%",
        "AU_IN_royalties": "10%",
        "AU_KR_dividends": "15%",
        "AU_KR_interest": "15%",
        "AU_KR_royalties": "10%",
        "AU_MY_dividends": "0%",
        "AU_MY_interest": "10%",
        "AU_MY_royalties": "10%",

        // CA as payer
        "CA_US_dividends": "5%",
        "CA_US_interest": "0%",
        "CA_US_royalties": "0-10%",
        "CA_GB_dividends": "0%",
        "CA_GB_interest": "0%",
        "CA_GB_royalties": "0%",
        "CA_FR_dividends": "5%",
        "CA_FR_interest": "0%",
        "CA_FR_royalties": "0-10%",
        "CA_DE_dividends": "15%",
        "CA_DE_interest": "0%",
        "CA_DE_royalties": "0-10%",
        "CA_JP_dividends": "5%",
        "CA_JP_interest": "10%",
        "CA_JP_royalties": "10%",
        "CA_CN_dividends": "10%",
        "CA_CN_interest": "10%",
        "CA_CN_royalties": "10%",
        "CA_AU_dividends": "15%",
        "CA_AU_interest": "10%",
        "CA_AU_royalties": "10%",

        // KR as payer
        "KR_US_dividends": "10%",
        "KR_US_interest": "12%",
        "KR_US_royalties": "15%",
        "KR_JP_dividends": "5%",
        "KR_JP_interest": "10%",
        "KR_JP_royalties": "10%",
        "KR_CN_dividends": "10%",
        "KR_CN_interest": "10%",
        "KR_CN_royalties": "10%",
        "KR_SG_dividends": "5%",
        "KR_SG_interest": "10%",
        "KR_SG_royalties": "10%",
        "KR_GB_dividends": "10%",
        "KR_GB_interest": "10%",
        "KR_GB_royalties": "10%",
        "KR_DE_dividends": "10%",
        "KR_DE_interest": "10%",
        "KR_DE_royalties": "10%",
        "KR_FR_dividends": "10%",
        "KR_FR_interest": "10%",
        "KR_FR_royalties": "10%",
        "KR_IN_dividends": "15%",
        "KR_IN_interest": "10%",
        "KR_IN_royalties": "10%",
        "KR_AU_dividends": "15%",
        "KR_AU_interest": "15%",
        "KR_AU_royalties": "10%",
        "KR_MY_dividends": "0%",
        "KR_MY_interest": "10%",
        "KR_MY_royalties": "8%",
        "KR_TH_dividends": "10%",
        "KR_TH_interest": "10%",
        "KR_TH_royalties": "5-15%",
        "KR_VN_dividends": "5%",
        "KR_VN_interest": "10%",
        "KR_VN_royalties": "10%",
        "KR_ID_dividends": "10%",
        "KR_ID_interest": "10%",
        "KR_ID_royalties": "10%",
        "KR_PH_dividends": "10%",
        "KR_PH_interest": "10%",
        "KR_PH_royalties": "10%",

        // AE as payer
        "AE_IN_dividends": "0%",
        "AE_IN_interest": "0%",
        "AE_IN_royalties": "10%",
        "AE_SG_dividends": "0%",
        "AE_SG_interest": "0%",
        "AE_SG_royalties": "5%",
        "AE_GB_dividends": "0%",
        "AE_GB_interest": "0%",
        "AE_GB_royalties": "0%",
        "AE_FR_dividends": "0%",
        "AE_FR_interest": "0%",
        "AE_FR_royalties": "0%",
        "AE_DE_dividends": "0%",
        "AE_DE_interest": "0%",
        "AE_DE_royalties": "0%",
        "AE_CN_dividends": "0%",
        "AE_CN_interest": "0%",
        "AE_CN_royalties": "10%",
        "AE_US_dividends": "0%",
        "AE_US_interest": "0%",
        "AE_US_royalties": "0%",

        // SA as payer
        "SA_IN_dividends": "5%",
        "SA_IN_interest": "10%",
        "SA_IN_royalties": "10%",
        "SA_GB_dividends": "0%",
        "SA_GB_interest": "0%",
        "SA_GB_royalties": "0%",
        "SA_US_dividends": "0%",
        "SA_US_interest": "0%",
        "SA_US_royalties": "0%",
        "SA_FR_dividends": "0%",
        "SA_FR_interest": "0%",
        "SA_FR_royalties": "0%",

        // TH as payer
        "TH_US_dividends": "10%",
        "TH_US_interest": "10%",
        "TH_US_royalties": "5-8%",
        "TH_JP_dividends": "10%",
        "TH_JP_interest": "10%",
        "TH_JP_royalties": "10%",
        "TH_CN_dividends": "10%",
        "TH_CN_interest": "10%",
        "TH_CN_royalties": "15%",
        "TH_SG_dividends": "10%",
        "TH_SG_interest": "10%",
        "TH_SG_royalties": "5%",
        "TH_MY_dividends": "0%",
        "TH_MY_interest": "10%",
        "TH_MY_royalties": "8%",
        "TH_KR_dividends": "10%",
        "TH_KR_interest": "10%",
        "TH_KR_royalties": "5-15%",
        "TH_VN_dividends": "10%",
        "TH_VN_interest": "10%",
        "TH_VN_royalties": "10%",
        "TH_ID_dividends": "10%",
        "TH_ID_interest": "10%",
        "TH_ID_royalties": "10%",
        "TH_IN_dividends": "10%",
        "TH_IN_interest": "10%",
        "TH_IN_royalties": "10%",

        // MY as payer
        "MY_US_dividends": "0%",
        "MY_US_interest": "10%",
        "MY_US_royalties": "10%",
        "MY_GB_dividends": "0%",
        "MY_GB_interest": "10%",
        "MY_GB_royalties": "2.5-10%",
        "MY_JP_dividends": "0%",
        "MY_JP_interest": "10%",
        "MY_JP_royalties": "8%",
        "MY_SG_dividends": "0%",
        "MY_SG_interest": "10%",
        "MY_SG_royalties": "8%",
        "MY_CN_dividends": "0%",
        "MY_CN_interest": "10%",
        "MY_CN_royalties": "10%",
        "MY_TH_dividends": "0%",
        "MY_TH_interest": "10%",
        "MY_TH_royalties": "8%",
        "MY_KR_dividends": "0%",
        "MY_KR_interest": "10%",
        "MY_KR_royalties": "8%",
        "MY_AU_dividends": "0%",
        "MY_AU_interest": "10%",
        "MY_AU_royalties": "10%",
        "MY_IN_dividends": "0%",
        "MY_IN_interest": "10%",
        "MY_IN_royalties": "10%",
        "MY_ID_dividends": "10%",
        "MY_ID_interest": "10%",
        "MY_ID_royalties": "10%",

        // VN as payer
        "VN_US_dividends": "5%",
        "VN_US_interest": "0%",
        "VN_US_royalties": "10%",
        "VN_JP_dividends": "5%",
        "VN_JP_interest": "10%",
        "VN_JP_royalties": "10%",
        "VN_KR_dividends": "5%",
        "VN_KR_interest": "10%",
        "VN_KR_royalties": "10%",
        "VN_SG_dividends": "5%",
        "VN_SG_interest": "10%",
        "VN_SG_royalties": "7%",
        "VN_CN_dividends": "10%",
        "VN_CN_interest": "10%",
        "VN_CN_royalties": "10%",
        "VN_TH_dividends": "10%",
        "VN_TH_interest": "10%",
        "VN_TH_royalties": "10%",
        "VN_MY_dividends": "0%",
        "VN_MY_interest": "10%",
        "VN_MY_royalties": "10%",

        // ID as payer
        "ID_US_dividends": "10%",
        "ID_US_interest": "10%",
        "ID_US_royalties": "10%",
        "ID_JP_dividends": "10%",
        "ID_JP_interest": "10%",
        "ID_JP_royalties": "10%",
        "ID_SG_dividends": "15%",
        "ID_SG_interest": "15%",
        "ID_SG_royalties": "15%",
        "ID_CN_dividends": "10%",
        "ID_CN_interest": "10%",
        "ID_CN_royalties": "10%",
        "ID_MY_dividends": "10%",
        "ID_MY_interest": "10%",
        "ID_MY_royalties": "10%",
        "ID_TH_dividends": "10%",
        "ID_TH_interest": "10%",
        "ID_TH_royalties": "10%",
        "ID_KR_dividends": "10%",
        "ID_KR_interest": "10%",
        "ID_KR_royalties": "10%",

        // PH as payer
        "PH_US_dividends": "10%",
        "PH_US_interest": "10%",
        "PH_US_royalties": "10%",
        "PH_JP_dividends": "10%",
        "PH_JP_interest": "10%",
        "PH_JP_royalties": "10%",
        "PH_CN_dividends": "10%",
        "PH_CN_interest": "10%",
        "PH_CN_royalties": "10%",
        "PH_KR_dividends": "10%",
        "PH_KR_interest": "10%",
        "PH_KR_royalties": "10%",
        "PH_SG_dividends": "15%",
        "PH_SG_interest": "15%",
        "PH_SG_royalties": "15%",
        "PH_TH_dividends": "10%",
        "PH_TH_interest": "10%",
        "PH_TH_royalties": "10%",
        "PH_MY_dividends": "0%",
        "PH_MY_interest": "10%",
        "PH_MY_royalties": "10%",

        // Hong Kong as payer
        // IMPORTANT: Hong Kong does NOT impose WHT on dividends and interest under domestic law
        // Treaty rates shown are maximum rates if HK were to impose WHT in future
        // For interest: 0% (HK has no WHT on interest)
        // For dividends: 0% (HK has no WHT on dividends)
        // HK-SG and HK-US treaties cover ONLY shipping and air transport (not applicable for interest/dividends/royalties)
        "HK_CN_dividends": "0%",
        "HK_CN_interest": "0%",
        "HK_CN_royalties": "2.475-4.95%",
        "HK_JP_dividends": "0%",
        "HK_JP_interest": "0%",
        "HK_JP_royalties": "2.475-4.95%",
        "HK_KR_dividends": "0%",
        "HK_KR_interest": "0%",
        "HK_KR_royalties": "2.475-4.95%",
        "HK_SG_dividends": "N/A (No Treaty)",
        "HK_SG_interest": "0% (No WHT on interest)",
        "HK_SG_royalties": "2.475-4.95% (No Treaty)",
        "HK_MY_dividends": "0%",
        "HK_MY_interest": "0%",
        "HK_MY_royalties": "2.475-4.95%",
        "HK_TH_dividends": "0%",
        "HK_TH_interest": "0%",
        "HK_TH_royalties": "2.475-4.95%",
        "HK_IN_dividends": "0%",
        "HK_IN_interest": "0%",
        "HK_IN_royalties": "2.475-4.95%",
        "HK_GB_dividends": "0%",
        "HK_GB_interest": "0%",
        "HK_GB_royalties": "2.475-3%",
        "HK_US_dividends": "N/A (Limited Treaty)",
        "HK_US_interest": "0% (No WHT on interest)",
        "HK_US_royalties": "2.475-4.95% (Limited Treaty)",
        "HK_AU_dividends": "0%",
        "HK_AU_interest": "0%",
        "HK_AU_royalties": "2.475-4.95%",
        "HK_NZ_dividends": "0%",
        "HK_NZ_interest": "0%",
        "HK_NZ_royalties": "2.475-4.95%",
        "HK_TW_dividends": "0%",
        "HK_TW_interest": "0%",
        "HK_TW_royalties": "2.475-4.95%",

        // Macao as payer
        "MO_CN_dividends": "10%",
        "MO_CN_interest": "10%",
        "MO_CN_royalties": "10%",
        "MO_PT_dividends": "5%",
        "MO_PT_interest": "10%",
        "MO_PT_royalties": "10%"
// Domestic Withholding Tax Rates (Non-Treaty)
const DOMESTIC_WHT_DATA = {
    "CN": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "HK": {
        dividend: "0%",
        interest: "0%",
        royalty: "4.95%"
    },
    "SG": {
        dividend: "0%",
        interest: "15%",
        royalty: "10%"
    },
    "MY": {
        dividend: "0%",
        interest: "15%",
        royalty: "10%"
    },
    "ID": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "TH": {
        dividend: "10%",
        interest: "15%",
        royalty: "15%"
    },
    "VN": {
        dividend: "0%",
        interest: "5%",
        royalty: "10%"
    },
    "PH": {
        dividend: "15%",
        interest: "20%",
        royalty: "20%"
    },
    "JP": {
        dividend: "20.42%",
        interest: "15.315%",
        royalty: "20%"
    },
    "KR": {
        dividend: "22%",
        interest: "22%",
        royalty: "22%"
    },
    "IN": {
        dividend: "10%",
        interest: "20%",
        royalty: "10%"
    },
    "AU": {
        dividend: "30%",
        interest: "10%",
        royalty: "30%"
    },
    "NZ": {
        dividend: "30%",
        interest: "15%",
        royalty: "15%"
    },
    "GB": {
        dividend: "0%",
        interest: "20%",
        royalty: "20%"
    },
    "DE": {
        dividend: "25%",
        interest: "0%",
        royalty: "15%"
    },
    "FR": {
        dividend: "30%",
        interest: "0%",
        royalty: "0%"
    },
    "IT": {
        dividend: "26%",
        interest: "26%",
        royalty: "30%"
    },
    "ES": {
        dividend: "19%",
        interest: "19%",
        royalty: "24%"
    },
    "NL": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "CH": {
        dividend: "35%",
        interest: "0%",
        royalty: "0%"
    },
    "SE": {
        dividend: "30%",
        interest: "0%",
        royalty: "0%"
    },
    "NO": {
        dividend: "25%",
        interest: "0%",
        royalty: "0%"
    },
    "DK": {
        dividend: "27%",
        interest: "0%",
        royalty: "0%"
    },
    "FI": {
        dividend: "30%",
        interest: "0%",
        royalty: "0%"
    },
    "BE": {
        dividend: "30%",
        interest: "0%",
        royalty: "0%"
    },
    "AT": {
        dividend: "27.5%",
        interest: "0%",
        royalty: "0%"
    },
    "PL": {
        dividend: "19%",
        interest: "0%",
        royalty: "0%"
    },
    "CZ": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "HU": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "RO": {
        dividend: "5%",
        interest: "0%",
        royalty: "0%"
    },
    "BG": {
        dividend: "5%",
        interest: "0%",
        royalty: "0%"
    },
    "HR": {
        dividend: "10%",
        interest: "0%",
        royalty: "0%"
    },
    "SI": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "SK": {
        dividend: "7%",
        interest: "0%",
        royalty: "0%"
    },
    "LT": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "LV": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "EE": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "IE": {
        dividend: "25%",
        interest: "0%",
        royalty: "0%"
    },
    "PT": {
        dividend: "28%",
        interest: "0%",
        royalty: "0%"
    },
    "GR": {
        dividend: "5%",
        interest: "0%",
        royalty: "0%"
    },
    "CY": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "MT": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "LU": {
        dividend: "15%",
        interest: "0%",
        royalty: "0%"
    },
    "IS": {
        dividend: "18%",
        interest: "0%",
        royalty: "0%"
    },
    "LI": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "MC": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "AD": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "SM": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "VA": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "US": {
        dividend: "30%",
        interest: "30%",
        royalty: "30%"
    },
    "CA": {
        dividend: "25%",
        interest: "25%",
        royalty: "25%"
    },
    "MX": {
        dividend: "10%",
        interest: "4.9%",
        royalty: "35%"
    },
    "BR": {
        dividend: "0%",
        interest: "15%",
        royalty: "15%"
    },
    "AR": {
        dividend: "7%",
        interest: "35%",
        royalty: "28%"
    },
    "CL": {
        dividend: "35%",
        interest: "35%",
        royalty: "35%"
    },
    "CO": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "PE": {
        dividend: "5%",
        interest: "30%",
        royalty: "30%"
    },
    "VE": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "ZA": {
        dividend: "20%",
        interest: "15%",
        royalty: "15%"
    },
    "EG": {
        dividend: "0%",
        interest: "20%",
        royalty: "20%"
    },
    "NG": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "KE": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "TZ": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "UG": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "GH": {
        dividend: "8%",
        interest: "8%",
        royalty: "8%"
    },
    "MA": {
        dividend: "15%",
        interest: "10%",
        royalty: "10%"
    },
    "TN": {
        dividend: "0%",
        interest: "20%",
        royalty: "0%"
    },
    "DZ": {
        dividend: "15%",
        interest: "10%",
        royalty: "30%"
    },
    "LY": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "SD": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "ET": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "SO": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "CD": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "AO": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "MZ": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "ZM": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "ZW": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "BW": {
        dividend: "7.5%",
        interest: "10%",
        royalty: "15%"
    },
    "NA": {
        dividend: "20%",
        interest: "10%",
        royalty: "10%"
    },
    "SZ": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "LS": {
        dividend: "25%",
        interest: "25%",
        royalty: "25%"
    },
    "RU": {
        dividend: "15%",
        interest: "20%",
        royalty: "20%"
    },
    "UA": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "BY": {
        dividend: "13%",
        interest: "13%",
        royalty: "13%"
    },
    "KZ": {
        dividend: "15%",
        interest: "20%",
        royalty: "20%"
    },
    "UZ": {
        dividend: "10%",
        interest: "10%",
        royalty: "20%"
    },
    "AZ": {
        dividend: "10%",
        interest: "10%",
        royalty: "14%"
    },
    "AM": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "GE": {
        dividend: "5%",
        interest: "5%",
        royalty: "5%"
    },
    "MD": {
        dividend: "6%",
        interest: "12%",
        royalty: "12%"
    },
    "KG": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "TJ": {
        dividend: "12%",
        interest: "12%",
        royalty: "15%"
    },
    "TM": {
        dividend: "15%",
        interest: "15%",
        royalty: "20%"
    },
    "MN": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "KP": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "TR": {
        dividend: "15%",
        interest: "0%",
        royalty: "20%"
    },
    "SA": {
        dividend: "5%",
        interest: "5%",
        royalty: "15%"
    },
    "AE": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "QA": {
        dividend: "0%",
        interest: "0%",
        royalty: "5%"
    },
    "KW": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "BH": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "OM": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "YE": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "IQ": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "SY": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "LB": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "JO": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "PS": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "IL": {
        dividend: "25%",
        interest: "25%",
        royalty: "25%"
    },
    "IR": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "PK": {
        dividend: "15%",
        interest: "10%",
        royalty: "15%"
    },
    "AF": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "BD": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "LK": {
        dividend: "14%",
        interest: "14%",
        royalty: "14%"
    },
    "NP": {
        dividend: "5%",
        interest: "5%",
        royalty: "15%"
    },
    "BT": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "MV": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "MM": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "KH": {
        dividend: "14%",
        interest: "14%",
        royalty: "14%"
    },
    "LA": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "BN": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "TL": {
        dividend: "10%",
        interest: "10%",
        royalty: "10%"
    },
    "PG": {
        dividend: "17%",
        interest: "15%",
        royalty: "15%"
    },
    "FJ": {
        dividend: "20%",
        interest: "20%",
        royalty: "20%"
    },
    "SB": {
        dividend: "30%",
        interest: "15%",
        royalty: "15%"
    },
    "VU": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "NC": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "PF": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "WS": {
        dividend: "15%",
        interest: "15%",
        royalty: "15%"
    },
    "TO": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "KI": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "TV": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "NR": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "PW": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "MH": {
        dividend: "0%",
        interest: "0%",
        royalty: "0%"
    },
    "FM": {
        dividend: "30%",
        interest: "30%",
        royalty: "30%"
    }
};
    }
};

// Function to get default WHT rate when no treaty exists
function getDefaultWHTRate(paymentType) {
    const defaultRates = {
        dividends: "25-35%",
        interest: "15-30%",
        royalties: "15-30%",
        services: "15-25%",
        management: "15-25%"
    };
    return defaultRates[paymentType] || "N/A";
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TAX_DATA, getDefaultWHTRate };
}


