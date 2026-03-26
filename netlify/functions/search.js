// Netlify Serverless Function for Real Tax Rate Search
// Actually scrapes PwC Tax Summaries for accurate data

const PWC_BASE_URL = 'https://taxsummaries.pwc.com';

// Country name mapping for PwC URLs
const PWC_COUNTRY_MAP = {
    'hong kong': 'hong-kong-sar',
    'hk': 'hong-kong-sar',
    'hong kong, china': 'hong-kong-sar',
    'singapore': 'singapore',
    'sg': 'singapore',
    'china': 'china-peoples-republic-of',
    'cn': 'china-peoples-republic-of',
    'peoples republic of china': 'china-peoples-republic-of',
    "china, people's republic of": 'china-peoples-republic-of',
    'united states': 'united-states',
    'usa': 'united-states',
    'us': 'united-states',
    'united kingdom': 'united-kingdom',
    'uk': 'united-kingdom',
    'britain': 'united-kingdom',
    'japan': 'japan',
    'jp': 'japan',
    'germany': 'germany',
    'de': 'germany',
    'france': 'france',
    'fr': 'france',
    'australia': 'australia',
    'au': 'australia',
    'canada': 'canada',
    'ca': 'canada',
    'india': 'india',
    'in': 'india',
    'south korea': 'korea-republic-of',
    'korea': 'korea-republic-of',
    'kr': 'korea-republic-of',
    'republic of korea': 'korea-republic-of',
    'netherlands': 'netherlands',
    'nl': 'netherlands',
    'dutch': 'netherlands',
    'switzerland': 'switzerland',
    'ch': 'switzerland',
    'ireland': 'ireland',
    'ie': 'ireland',
    'luxembourg': 'luxembourg',
    'lu': 'luxembourg',
    'malaysia': 'malaysia',
    'my': 'malaysia',
    'thailand': 'thailand',
    'th': 'thailand',
    'vietnam': 'vietnam',
    'vn': 'vietnam',
    'indonesia': 'indonesia',
    'id': 'indonesia',
    'philippines': 'philippines',
    'ph': 'philippines',
    'taiwan': 'taiwan',
    'tw': 'taiwan',
    'macao': 'macau-sar',
    'macau': 'macau-sar',
    'mo': 'macau-sar',
    'united arab emirates': 'united-arab-emirates',
    'uae': 'united-arab-emirates',
    'dubai': 'united-arab-emirates',
    'saudi arabia': 'saudi-arabia',
    'saudi': 'saudi-arabia',
    'new zealand': 'new-zealand',
    'nz': 'new-zealand',
    'italy': 'italy',
    'it': 'italy',
    'spain': 'spain',
    'es': 'spain',
    'mexico': 'mexico',
    'mx': 'mexico',
    'brazil': 'brazil',
    'br': 'brazil',
    'russia': 'russian-federation',
    'russian federation': 'russian-federation',
    'ru': 'russian-federation',
    'south africa': 'south-africa',
    'za': 'south-africa',
    'turkey': 'turkey',
    'tr': 'turkey',
    'poland': 'poland',
    'pl': 'poland',
    'sweden': 'sweden',
    'se': 'sweden',
    'norway': 'norway',
    'no': 'norway',
    'denmark': 'denmark',
    'dk': 'denmark',
    'finland': 'finland',
    'fi': 'finland',
    'belgium': 'belgium',
    'be': 'belgium',
    'austria': 'austria',
    'at': 'austria',
    'czech republic': 'czech-republic',
    'czech': 'czech-republic',
    'cz': 'czech-republic',
    'hungary': 'hungary',
    'hu': 'hungary',
    'greece': 'greece',
    'gr': 'greece',
    'portugal': 'portugal',
    'pt': 'portugal',
    'argentina': 'argentina',
    'ar': 'argentina',
    'chile': 'chile',
    'cl': 'chile',
    'colombia': 'colombia',
    'co': 'colombia',
    'peru': 'peru',
    'pe': 'peru',
    'egypt': 'egypt',
    'eg': 'egypt',
    'israel': 'israel',
    'il': 'israel',
    'pakistan': 'pakistan',
    'pk': 'pakistan',
    'bangladesh': 'bangladesh',
    'bd': 'bangladesh',
    'nigeria': 'nigeria',
    'ng': 'nigeria',
    'kenya': 'kenya',
    'ke': 'kenya',
    'morocco': 'morocco',
    'ma': 'morocco'
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const startTime = Date.now();
    const { query, type, payerCountry, payeeCountry, paymentType } = event.queryStringParameters || {};

    if (!query) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Query parameter is required' })
        };
    }

    try {
        let results = [];
        
        // For national tax queries (VAT, income tax, etc.)
        if (type === 'national' || type === 'vat' || type === 'income-tax' || type === 'business-tax') {
            results = await fetchNationalTaxFromPwC(query, type);
        }
        // For WHT queries with specific countries, fetch from PwC
        else if (type === 'wht' && payerCountry && payeeCountry) {
            results = await fetchWHTFromPwC(payerCountry, payeeCountry, paymentType);
        } else {
            // General search
            results = await searchGeneral(query, type);
        }
        
        const responseTime = Date.now() - startTime;
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                results,
                queriedAt: new Date().toISOString(),
                responseTime: `${responseTime}ms`,
                source: 'PwC Tax Summaries (Real-time)'
            })
        };
    } catch (error) {
        console.error('Search error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Search failed', 
                message: error.message,
                fallback: getFallbackResults(query)
            })
        };
    }
};

// Fetch National Tax data from PwC for a country
async function fetchNationalTaxFromPwC(query, type) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Extract country from query - prioritize longer matches first
    let countrySlug = null;
    let countryName = null;
    
    // Sort keys by length (longest first) to avoid partial matches
    // e.g., "indonesia" should match before "in" (India code)
    const sortedKeys = Object.keys(PWC_COUNTRY_MAP).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
        // Use word boundary matching for short codes
        if (key.length <= 3) {
            // For short codes like 'in', 'id', 'us', match as whole word
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(queryLower)) {
                countrySlug = PWC_COUNTRY_MAP[key];
                countryName = getCanonicalCountryName(key);
                break;
            }
        } else {
            // For longer names, use includes
            if (queryLower.includes(key)) {
                countrySlug = PWC_COUNTRY_MAP[key];
                countryName = getCanonicalCountryName(key);
                break;
            }
        }
    }
    
    if (!countrySlug) {
        // Try to find country name directly
        const words = queryLower.split(/\s+/);
        for (const word of words) {
            if (PWC_COUNTRY_MAP[word]) {
                countrySlug = PWC_COUNTRY_MAP[word];
                countryName = getCanonicalCountryName(word);
                break;
            }
        }
    }
    
    if (!countrySlug) {
        return getGeneralSources();
    }
    
    // Build PwC URLs for the country
    const overviewUrl = `${PWC_BASE_URL}/${countrySlug}`;
    const corporateTaxUrl = `${PWC_BASE_URL}/${countrySlug}/corporate/taxation-of-corporate-entities`;
    const individualTaxUrl = `${PWC_BASE_URL}/${countrySlug}/individual/taxation-of-individuals`;
    const indirectTaxUrl = `${PWC_BASE_URL}/${countrySlug}/corporate/indirect-taxes`;
    const quickRatesUrl = `${PWC_BASE_URL}/${countrySlug}/quick-rates-and-dates`;
    
    // Determine tax type from query
    const isVATQuery = queryLower.includes('vat') || queryLower.includes('gst') || queryLower.includes('turnover') || queryLower.includes('sales tax') || type === 'vat';
    const isIncomeTaxQuery = queryLower.includes('income tax') || queryLower.includes('corporate tax') || queryLower.includes('pit') || queryLower.includes('cit') || type === 'income-tax';
    const isBusinessTaxQuery = queryLower.includes('business tax') || type === 'business-tax';
    
    // Add main overview page (always include)
    results.push({
        title: `PwC - ${countryName} Tax Overview`,
        url: overviewUrl,
        snippet: `Official PwC tax summary for ${countryName} - comprehensive overview of corporate tax, individual tax, VAT/GST, withholding taxes and other tax rates.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries',
        isDirectPage: true
    });
    
    // Add quick rates page
    results.push({
        title: `PwC - ${countryName} Quick Rates & Dates`,
        url: quickRatesUrl,
        snippet: `Quick reference for ${countryName} tax rates: corporate income tax (CIT) rates, personal income tax (PIT) rates, VAT/GST rates, withholding tax rates.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries',
        isDirectPage: true
    });
    
    // Add relevant specific pages based on query type
    if (isVATQuery || isBusinessTaxQuery) {
        results.push({
            title: `PwC - ${countryName} Indirect Taxes (VAT/GST)`,
            url: indirectTaxUrl,
            snippet: `Detailed information on ${countryName} VAT/GST rates, registration thresholds, and compliance requirements.`,
            type: 'professional',
            reliability: 'high',
            source: 'PwC Tax Summaries',
            isDirectPage: true
        });
    }
    
    if (isIncomeTaxQuery) {
        results.push({
            title: `PwC - ${countryName} Corporate Taxation`,
            url: corporateTaxUrl,
            snippet: `Detailed information on ${countryName} corporate income tax rates, deductions, and incentives.`,
            type: 'professional',
            reliability: 'high',
            source: 'PwC Tax Summaries',
            isDirectPage: true
        });
        
        results.push({
            title: `PwC - ${countryName} Individual Taxation`,
            url: individualTaxUrl,
            snippet: `Detailed information on ${countryName} personal income tax rates, deductions, and allowances.`,
            type: 'professional',
            reliability: 'high',
            source: 'PwC Tax Summaries',
            isDirectPage: true
        });
    }
    
    // Try to fetch and parse actual data from PwC
    try {
        const pageData = await fetchPwCPage(overviewUrl);
        if (pageData) {
            const extractedRates = parseTaxRates(pageData, type);
            if (extractedRates) {
                results[0].extractedData = extractedRates;
            }
        }
    } catch (e) {
        console.log('Could not fetch PwC overview:', e.message);
    }
    
    // Add official tax authority
    const officialSource = getOfficialTaxAuthority(countryName);
    if (officialSource) {
        results.push(officialSource);
    }
    
    // Add OECD reference
    results.push({
        title: 'OECD Tax Database',
        url: 'https://www.oecd.org/tax/tax-policy/',
        snippet: 'Official OECD tax statistics and policy analysis.',
        type: 'official',
        reliability: 'high',
        source: 'OECD'
    });
    
    return results;
}

// Parse tax rates from PwC page HTML - Enhanced version
function parseTaxRates(html, type) {
    const rates = {};
    
    // Remove HTML tags but keep text content
    const cleanText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
    
    // Extract CIT (Corporate Income Tax) rate - multiple patterns
    const citPatterns = [
        /Headline CIT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Corporate income tax rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Standard corporate tax rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /CIT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Corporate tax rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Corporate income tax[^0-9]*(\d+(?:\.\d+)?)\s*%/i
    ];
    for (const pattern of citPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            rates.cit = match[1] + '%';
            break;
        }
    }
    
    // Extract PIT (Personal Income Tax) rate - multiple patterns
    const pitPatterns = [
        /Headline PIT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Personal income tax rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Top marginal rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Maximum PIT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Highest marginal rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Top personal tax rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i
    ];
    for (const pattern of pitPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            rates.pit = match[1] + '%';
            break;
        }
    }
    
    // Extract VAT/GST rate - multiple patterns
    const vatPatterns = [
        /Standard VAT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Standard GST rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /VAT standard rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /GST standard rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Standard rate.*?VAT[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Standard rate.*?GST[^0-9]*(\d+(?:\.\d+)?)\s*%/i
    ];
    for (const pattern of vatPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            rates.vat = match[1] + '%';
            break;
        }
    }
    
    // Extract SST (Sales and Service Tax) - Malaysia specific
    const sstPatterns = [
        /Sales tax[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Service tax[^0-9]*(\d+(?:\.\d+)?)\s*%/i
    ];
    const sstRates = [];
    for (const pattern of sstPatterns) {
        const matches = cleanText.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && !sstRates.includes(match[1] + '%')) {
                sstRates.push(match[1] + '%');
            }
        }
    }
    if (sstRates.length > 0) {
        rates.sst = sstRates.slice(0, 4).join(' / ');
    }
    
    // Extract multiple VAT tiers (reduced rates, etc.)
    const reducedVatPatterns = [
        /Reduced VAT rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i,
        /Reduced rate[^0-9]*(\d+(?:\.\d+)?)\s*%/i
    ];
    const reducedRates = [];
    for (const pattern of reducedVatPatterns) {
        const matches = cleanText.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && !reducedRates.includes(match[1] + '%')) {
                reducedRates.push(match[1] + '%');
            }
        }
    }
    if (reducedRates.length > 0 && rates.vat) {
        rates.vatTiers = [rates.vat, ...reducedRates];
    }
    
    // Try to extract from quick-rates tables
    // Look for patterns like "22% 2024" or "22% (2024)"
    const yearPattern = /(\d+(?:\.\d+)?)\s*%\s*(?:\([^)]*\))?\s*(?:202[0-9])?/g;
    const allPercentages = [...cleanText.matchAll(yearPattern)]
        .map(m => m[1] + '%')
        .filter((v, i, a) => a.indexOf(v) === i) // unique
        .slice(0, 6);
    
    if (allPercentages.length > 0 && Object.keys(rates).length === 0) {
        rates.detectedRates = allPercentages;
    }
    
    return Object.keys(rates).length > 0 ? rates : null;
}
        }
    }
    
    // Extract SST (Sales and Service Tax) for Malaysia and similar
    const sstPatterns = [
        /Sales tax[^<]*(\d+(?:\.\d+)?)\s*%?/i,
        /Service tax[^<]*(\d+(?:\.\d+)?)\s*%?/i,
        /SST rate[^<]*(\d+(?:\.\d+)?)\s*%?/i
    ];
    const sstRates = [];
    for (const pattern of sstPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            sstRates.push(match[1] + '%');
        }
    }
    if (sstRates.length > 0) {
        rates.sst = sstRates.join(' / ');
    }
    
    // Try to extract all rate tiers from tables
    const tierMatches = cleanText.matchAll(/(\d+(?:\.\d+)?)\s*%\s*([A-Za-z\s]+)/g);
    const allTiers = [];
    for (const match of tierMatches) {
        if (match[1] && match[2]) {
            allTiers.push({ rate: match[1] + '%', type: match[2].trim() });
        }
    }
    if (allTiers.length > 0 && !rates.vat) {
        rates.tiers = allTiers.slice(0, 5); // Limit to 5 tiers
    }
    
    return Object.keys(rates).length > 0 ? rates : null;
}

// Get general sources when country is not identified
function getGeneralSources() {
    return [
        {
            title: 'PwC Worldwide Tax Summaries',
            url: 'https://taxsummaries.pwc.com/',
            snippet: 'Comprehensive guides to corporate and individual taxes in jurisdictions worldwide.',
            type: 'professional',
            reliability: 'high',
            source: 'PwC Tax Summaries'
        },
        {
            title: 'OECD Tax Database',
            url: 'https://www.oecd.org/tax/tax-policy/',
            snippet: 'Official OECD tax statistics and policy analysis.',
            type: 'official',
            reliability: 'high',
            source: 'OECD'
        },
        {
            title: 'KPMG Tax Rates Online',
            url: 'https://home.kpmg/xx/en/home/services/tax/tax-tools-and-resources/tax-rates-online.html',
            snippet: 'Interactive tax rate tables by country.',
            type: 'professional',
            reliability: 'high',
            source: 'KPMG'
        }
    ];
}

// Fetch WHT data from PwC for specific country pair
async function fetchWHTFromPwC(payerCountry, payeeCountry, paymentType) {
    const results = [];
    
    // Normalize country names
    const payerSlug = PWC_COUNTRY_MAP[payerCountry.toLowerCase()] || payerCountry.toLowerCase().replace(/\s+/g, '-');
    const payeeSlug = PWC_COUNTRY_MAP[payeeCountry.toLowerCase()] || payeeCountry.toLowerCase().replace(/\s+/g, '-');
    
    // Build PwC URLs
    const payerWhtUrl = `${PWC_BASE_URL}/${payerSlug}/corporate/withholding-taxes`;
    const payeeWhtUrl = `${PWC_BASE_URL}/${payeeSlug}/corporate/withholding-taxes`;
    const payerOverviewUrl = `${PWC_BASE_URL}/${payerSlug}`;
    const payeeOverviewUrl = `${PWC_BASE_URL}/${payeeSlug}`;
    
    // Add payer country WHT page
    results.push({
        title: `PwC - ${formatCountryName(payerCountry)} Withholding Taxes`,
        url: payerWhtUrl,
        snippet: `Official PwC tax summary for ${formatCountryName(payerCountry)} - WHT rates on dividends, interest, royalties paid to non-residents. Includes treaty rates with ${formatCountryName(payeeCountry)}.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries',
        isDirectPage: true
    });
    
    // Add payee country WHT page (for treaty verification)
    results.push({
        title: `PwC - ${formatCountryName(payeeCountry)} Withholding Taxes`,
        url: payeeWhtUrl,
        snippet: `Official PwC tax summary for ${formatCountryName(payeeCountry)} - WHT rates and treaty information.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries',
        isDirectPage: true
    });
    
    // Try to fetch actual content from PwC
    try {
        const payerData = await fetchPwCPage(payerWhtUrl);
        if (payerData) {
            // Parse WHT table to extract relevant rate
            const whtInfo = parseWHTTable(payerData, payeeCountry, paymentType);
            if (whtInfo) {
                results[0].extractedData = whtInfo;
                results[0].snippet = whtInfo.summary;
            }
        }
    } catch (e) {
        console.log('Could not fetch PwC page:', e.message);
    }
    
    // Add country overview pages
    results.push({
        title: `PwC - ${formatCountryName(payerCountry)} Tax Overview`,
        url: payerOverviewUrl,
        snippet: `Comprehensive tax overview for ${formatCountryName(payerCountry)} including CIT, PIT, VAT/GST rates.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries'
    });
    
    results.push({
        title: `PwC - ${formatCountryName(payeeCountry)} Tax Overview`,
        url: payeeOverviewUrl,
        snippet: `Comprehensive tax overview for ${formatCountryName(payeeCountry)} including CIT, PIT, VAT/GST rates.`,
        type: 'professional',
        reliability: 'high',
        source: 'PwC Tax Summaries'
    });
    
    // Add treaty verification sources
    results.push({
        title: 'OECD Tax Treaty Database',
        url: 'https://www.oecd.org/tax/treaties/',
        snippet: 'Verify bilateral tax treaty between countries, MLI positions and treaty articles.',
        type: 'official',
        reliability: 'high',
        source: 'OECD'
    });
    
    // Add official tax authorities
    const payerOfficial = getOfficialTaxAuthority(payerCountry);
    const payeeOfficial = getOfficialTaxAuthority(payeeCountry);
    if (payerOfficial) results.push(payerOfficial);
    if (payeeOfficial) results.push(payeeOfficial);
    
    return results;
}

// Fetch PwC page content
async function fetchPwCPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
        return null;
    }
}

// Parse WHT table from PwC HTML
function parseWHTTable(html, payeeCountry, paymentType) {
    // This is a simplified parser - in production would need more robust parsing
    const payeeLower = payeeCountry.toLowerCase();
    const payeePatterns = {
        'hong kong': ['hong kong', 'hong kong sar', 'hk'],
        'singapore': ['singapore', 'sg'],
        'china': ['china', "people's republic of china", 'prc'],
        'united states': ['united states', 'usa', 'us'],
        'united kingdom': ['united kingdom', 'uk', 'britain'],
        'japan': ['japan', 'jp'],
        'germany': ['germany', 'de'],
        'france': ['france', 'fr']
    };
    
    // Find matching patterns
    const patterns = payeePatterns[payeeLower] || [payeeLower];
    
    // Look for table rows containing the country name
    const tableRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
    const rows = html.match(tableRegex) || [];
    
    for (const row of rows) {
        const rowLower = row.toLowerCase();
        if (patterns.some(p => rowLower.includes(p))) {
            // Found a matching row, extract rates
            const rates = extractRatesFromRow(row, paymentType);
            if (rates) {
                return {
                    country: payeeCountry,
                    rates: rates,
                    summary: `${payeeCountry}: Dividends ${rates.dividends || 'N/A'}, Interest ${rates.interest || 'N/A'}, Royalties ${rates.royalties || 'N/A'}`
                };
            }
        }
    }
    
    // Check for treaty scope limitations
    if (html.toLowerCase().includes('shipping and air transport') || 
        html.toLowerCase().includes('only shipping') ||
        html.toLowerCase().includes('only air transport')) {
        return {
            country: payeeCountry,
            rates: { dividends: 'Treaty limited', interest: 'Treaty limited', royalties: 'Treaty limited' },
            treatyScope: 'limited',
            summary: `Treaty with ${payeeCountry} covers only shipping and air transport activities. Domestic rates may apply for other payments.`
        };
    }
    
    return null;
}

// Extract rates from table row
function extractRatesFromRow(row, paymentType) {
    // Extract numbers that look like tax rates (0-100 with optional %)
    const rateRegex = /(\d+(?:\.\d+)?)\s*(?:%|percent)/gi;
    const numbers = row.match(rateRegex) || [];
    
    // Look for specific payment type indicators
    const hasDividend = /dividend/i.test(row);
    const hasInterest = /interest/i.test(row);
    const hasRoyalty = /royalt/i.test(row);
    
    // Simple extraction - would need more sophisticated parsing for production
    if (numbers.length >= 3) {
        return {
            dividends: numbers[0] || '0%',
            interest: numbers[1] || '0%',
            royalties: numbers[2] || '0%'
        };
    }
    
    return null;
}

// General search function
async function searchGeneral(query, type) {
    const results = [];
    const countries = extractCountries(query.toLowerCase());
    
    // Add PwC quick charts for WHT
    if (type === 'wht' || query.toLowerCase().includes('withholding')) {
        results.push({
            title: 'PwC - Worldwide WHT Rates Quick Chart',
            url: `${PWC_BASE_URL}/quick-charts/withholding-tax-wht-rates`,
            snippet: 'Comprehensive table of withholding tax rates for all countries - dividends, interest, royalties for residents and non-residents.',
            type: 'professional',
            reliability: 'high',
            source: 'PwC Tax Summaries',
            isDirectPage: true
        });
    }
    
    // Add country-specific PwC pages
    if (countries.length > 0) {
        for (const country of countries) {
            const slug = PWC_COUNTRY_MAP[country.toLowerCase()] || country.toLowerCase().replace(/\s+/g, '-');
            results.push({
                title: `PwC - ${formatCountryName(country)} Tax Summary`,
                url: `${PWC_BASE_URL}/${slug}`,
                snippet: `Comprehensive tax information for ${formatCountryName(country)} including corporate tax, individual tax, VAT/GST, and withholding taxes.`,
                type: 'professional',
                reliability: 'high',
                source: 'PwC Tax Summaries',
                isDirectPage: true
            });
            
            results.push({
                title: `PwC - ${formatCountryName(country)} Withholding Taxes`,
                url: `${PWC_BASE_URL}/${slug}/corporate/withholding-taxes`,
                snippet: `Detailed WHT rates for ${formatCountryName(country)} - domestic rates and treaty rates with other countries.`,
                type: 'professional',
                reliability: 'high',
                source: 'PwC Tax Summaries',
                isDirectPage: true
            });
            
            // Add official source
            const official = getOfficialTaxAuthority(country);
            if (official) results.push(official);
        }
    }
    
    // Add general reference sources
    results.push({
        title: 'OECD Tax Database',
        url: 'https://www.oecd.org/tax/tax-policy/',
        snippet: 'Official OECD tax statistics and policy analysis.',
        type: 'official',
        reliability: 'high',
        source: 'OECD'
    });
    
    results.push({
        title: 'OECD Tax Treaties and MLI',
        url: 'https://www.oecd.org/tax/treaties/',
        snippet: 'Tax treaty database and MLI positions.',
        type: 'official',
        reliability: 'high',
        source: 'OECD'
    });
    
    return results.slice(0, 10);
}

// Extract country names from query
function extractCountries(query) {
    const countries = [];
    for (const [key] of Object.entries(PWC_COUNTRY_MAP)) {
        if (query.includes(key) && !countries.some(c => c.toLowerCase() === key)) {
            // Get the canonical country name
            const canonicalName = getCanonicalCountryName(key);
            if (canonicalName && !countries.includes(canonicalName)) {
                countries.push(canonicalName);
            }
        }
    }
    return countries;
}

// Get canonical country name
function getCanonicalCountryName(key) {
    const canonical = {
        'hong kong': 'Hong Kong',
        'hk': 'Hong Kong',
        'singapore': 'Singapore',
        'sg': 'Singapore',
        'china': 'China',
        'cn': 'China',
        'united states': 'United States',
        'usa': 'United States',
        'us': 'United States',
        'united kingdom': 'United Kingdom',
        'uk': 'United Kingdom',
        'japan': 'Japan',
        'jp': 'Japan',
        'germany': 'Germany',
        'de': 'Germany',
        'france': 'France',
        'fr': 'France',
        'australia': 'Australia',
        'au': 'Australia',
        'canada': 'Canada',
        'ca': 'Canada',
        'india': 'India',
        'in': 'India',
        'south korea': 'South Korea',
        'korea': 'South Korea',
        'kr': 'South Korea',
        'netherlands': 'Netherlands',
        'nl': 'Netherlands',
        'switzerland': 'Switzerland',
        'ch': 'Switzerland',
        'ireland': 'Ireland',
        'ie': 'Ireland',
        'luxembourg': 'Luxembourg',
        'lu': 'Luxembourg',
        'malaysia': 'Malaysia',
        'my': 'Malaysia',
        'thailand': 'Thailand',
        'th': 'Thailand',
        'vietnam': 'Vietnam',
        'vn': 'Vietnam',
        'indonesia': 'Indonesia',
        'id': 'Indonesia',
        'philippines': 'Philippines',
        'ph': 'Philippines',
        'taiwan': 'Taiwan',
        'tw': 'Taiwan',
        'macao': 'Macao',
        'macau': 'Macao',
        'mo': 'Macao'
    };
    return canonical[key.toLowerCase()] || null;
}

// Format country name for display
function formatCountryName(country) {
    const name = getCanonicalCountryName(country);
    return name || country.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Get official tax authority for a country
function getOfficialTaxAuthority(country) {
    const authorities = {
        'Hong Kong': {
            title: 'HK IRD - Inland Revenue Department',
            url: 'https://www.ird.gov.hk/',
            snippet: 'Official Hong Kong tax authority - tax rates, DTA information and e-services.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Singapore': {
            title: 'IRAS - Inland Revenue Authority of Singapore',
            url: 'https://www.iras.gov.sg/',
            snippet: 'Official Singapore tax authority - tax rates, treaty information and e-services.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'China': {
            title: 'State Taxation Administration of China',
            url: 'http://www.chinatax.gov.cn/',
            snippet: 'Official Chinese tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'United States': {
            title: 'IRS - Internal Revenue Service',
            url: 'https://www.irs.gov/',
            snippet: 'Official US federal tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'United Kingdom': {
            title: 'HMRC - HM Revenue & Customs',
            url: 'https://www.gov.uk/hmrc',
            snippet: 'Official UK tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Japan': {
            title: 'NTA - National Tax Agency Japan',
            url: 'https://www.nta.go.jp/',
            snippet: 'Official Japanese tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Germany': {
            title: 'Bundesministerium der Finanzen',
            url: 'https://www.bundesfinanzministerium.de/',
            snippet: 'Official German Federal Ministry of Finance.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Australia': {
            title: 'ATO - Australian Taxation Office',
            url: 'https://www.ato.gov.au/',
            snippet: 'Official Australian tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Indonesia': {
            title: 'Direktorat Jenderal Pajak (DJP)',
            url: 'https://pajak.go.id/',
            snippet: 'Official Indonesian tax authority - Directorate General of Taxes.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Malaysia': {
            title: 'LHDNM - Inland Revenue Board of Malaysia',
            url: 'https://www.hasil.gov.my/',
            snippet: 'Official Malaysian tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Thailand': {
            title: 'RD - The Revenue Department Thailand',
            url: 'https://www.rd.go.th/',
            snippet: 'Official Thai tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Vietnam': {
            title: 'GDT - General Department of Taxation Vietnam',
            url: 'https://thuedientu.gdt.gov.vn/',
            snippet: 'Official Vietnamese tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'Philippines': {
            title: 'BIR - Bureau of Internal Revenue',
            url: 'https://www.bir.gov.ph/',
            snippet: 'Official Philippine tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        },
        'India': {
            title: 'Income Tax Department India',
            url: 'https://www.incometax.gov.in/',
            snippet: 'Official Indian tax authority.',
            type: 'official',
            reliability: 'high',
            source: 'Government'
        }
    };
    
    const name = formatCountryName(country);
    return authorities[name] || null;
}

// Fallback results if fetch fails
function getFallbackResults(query) {
    return [
        {
            title: 'PwC Worldwide Tax Summaries',
            url: 'https://taxsummaries.pwc.com/',
            snippet: 'Please search directly on PwC for the most accurate tax information.',
            type: 'professional',
            reliability: 'high'
        },
        {
            title: 'OECD Tax Treaty Database',
            url: 'https://www.oecd.org/tax/treaties/',
            snippet: 'Official OECD treaty database.',
            type: 'official',
            reliability: 'high'
        }
    ];
}