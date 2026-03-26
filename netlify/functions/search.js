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
        
        // For WHT queries with specific countries, fetch from PwC
        if (type === 'wht' && payerCountry && payeeCountry) {
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