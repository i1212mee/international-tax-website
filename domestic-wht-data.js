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
