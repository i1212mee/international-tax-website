// Vercel Serverless Function for Tax Rate Search
// Uses multiple free sources to search for tax rates

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { query, type } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const results = await searchTaxRates(query, type);
        return res.status(200).json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Search failed', message: error.message });
    }
}

// Main search function - aggregates results from multiple sources
async function searchTaxRates(query, type) {
    const encodedQuery = encodeURIComponent(query);
    
    // Define data sources based on query type
    const sources = getSources(query, type, encodedQuery);
    
    // Return structured results with official sources
    return sources;
}

function getSources(query, type, encodedQuery) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Determine if it's a withholding tax query
    const isWHT = queryLower.includes('withholding') || 
                  queryLower.includes('dividends') || 
                  queryLower.includes('interest') || 
                  queryLower.includes('royalties') ||
                  queryLower.includes('treaty');
    
    // Determine if it's VAT/GST query
    const isVAT = queryLower.includes('vat') || 
                  queryLower.includes('gst') || 
                  queryLower.includes('value added');
    
    // Determine if it's income tax query
    const isIncomeTax = queryLower.includes('income tax') || 
                        queryLower.includes('corporate tax') ||
                        queryLower.includes('individual tax');
    
    // Extract country names from query
    const countries = extractCountries(query);
    
    // 1. OECD Tax Database
    results.push({
        title: `OECD Tax Database - ${query}`,
        url: 'https://www.oecd.org/tax/tax-policy/',
        snippet: 'Official OECD tax statistics, tax treaty information and policy analysis for member and partner countries.',
        type: 'official',
        reliability: 'high'
    });
    
    // 2. OECD Tax Treaty Database
    if (isWHT && countries.length >= 2) {
        results.push({
            title: `OECD Tax Treaty MLI Database`,
            url: 'https://www.oecd.org/tax/treaties/',
            snippet: 'Comprehensive database of tax treaties and MLI positions for bilateral tax agreements.',
            type: 'official',
            reliability: 'high'
        });
    }
    
    // 3. IBFD Tax Research Platform
    results.push({
        title: `IBFD Tax Research Platform - ${query}`,
        url: 'https://www.ibfd.org/',
        snippet: 'International Bureau of Fiscal Documentation - comprehensive tax research platform with country tax guides.',
        type: 'professional',
        reliability: 'high'
    });
    
    // 4. KPMG Tax Rates Table
    results.push({
        title: `KPMG Corporate Tax Rates Table`,
        url: 'https://home.kpmg/xx/en/home/services/tax/tax-tools-and-resources/tax-rates-online.html',
        snippet: 'KPMG\'s interactive tax rate tables showing corporate income tax, indirect tax rates by country.',
        type: 'professional',
        reliability: 'high'
    });
    
    // 5. Deloitte Tax Highlights
    results.push({
        title: `Deloitte International Tax Sources`,
        url: 'https://www.deloitte.com/global/en/services/tax.html',
        snippet: 'Deloitte\'s international tax guides and country-specific tax information.',
        type: 'professional',
        reliability: 'high'
    });
    
    // 6. PwC Worldwide Tax Summaries
    if (countries.length > 0) {
        results.push({
            title: `PwC Worldwide Tax Summaries`,
            url: 'https://taxsummaries.pwc.com/',
            snippet: 'PwC\'s comprehensive guides to corporate and individual taxes in jurisdictions worldwide.',
            type: 'professional',
            reliability: 'high'
        });
    }
    
    // 7. EY Global Tax Guide
    results.push({
        title: `EY Global Tax Guide`,
        url: 'https://www.ey.com/en_gl/tax',
        snippet: 'Ernst & Young global tax resources including country tax guides and treaty information.',
        type: 'professional',
        reliability: 'high'
    });
    
    // 8. Wikipedia Taxation by Country
    results.push({
        title: `Wikipedia - Taxation by Country`,
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tax_rates',
        snippet: 'Overview of tax rates by country including income tax, corporate tax, and VAT/GST rates.',
        type: 'reference',
        reliability: 'medium'
    });
    
    // 9. Trading Economics - Tax Rates
    results.push({
        title: `Trading Economics - Tax Rates`,
        url: 'https://tradingeconomics.com/country-list/corporate-tax-rate',
        snippet: 'Real-time and historical data on corporate tax rates and other economic indicators by country.',
        type: 'data',
        reliability: 'medium'
    });
    
    // 10. Country-specific sources
    if (countries.length > 0) {
        countries.forEach(country => {
            const officialSource = getCountryOfficialSource(country);
            if (officialSource) {
                results.push(officialSource);
            }
        });
    }
    
    // 11. EU VAT rates (for EU countries)
    if (isVAT) {
        results.push({
            title: `European Commission - VAT Rates`,
            url: 'https://ec.europa.eu/taxation_customs/business/vat/telecommunications-broadcasting-electronic-services/vat-rules-electronic-services_en',
            snippet: 'Official EU VAT rates and rules for member states.',
            type: 'official',
            reliability: 'high'
        });
    }
    
    // 12. Tax Foundation
    results.push({
        title: `Tax Foundation - International Tax Competitiveness`,
        url: 'https://taxfoundation.org/data/',
        snippet: 'Tax Foundation\'s data on international tax rates, corporate tax policies, and economic impact.',
        type: 'research',
        reliability: 'medium'
    });
    
    // Limit to top 10 most relevant results
    return results.slice(0, 10);
}

// Extract country names from query
function extractCountries(query) {
    const countries = [];
    const countryPatterns = [
        { name: 'United States', patterns: ['united states', 'usa', 'us', 'america'] },
        { name: 'United Kingdom', patterns: ['united kingdom', 'uk', 'britain'] },
        { name: 'China', patterns: ['china', 'chinese', 'cn'] },
        { name: 'Japan', patterns: ['japan', 'japanese', 'jp'] },
        { name: 'Germany', patterns: ['germany', 'german', 'de'] },
        { name: 'France', patterns: ['france', 'french', 'fr'] },
        { name: 'Singapore', patterns: ['singapore', 'sg'] },
        { name: 'Hong Kong', patterns: ['hong kong', 'hk'] },
        { name: 'India', patterns: ['india', 'indian', 'in'] },
        { name: 'Australia', patterns: ['australia', 'australian', 'au'] },
        { name: 'Canada', patterns: ['canada', 'canadian', 'ca'] },
        { name: 'South Korea', patterns: ['south korea', 'korea', 'kr'] },
        { name: 'Netherlands', patterns: ['netherlands', 'dutch', 'nl'] },
        { name: 'Switzerland', patterns: ['switzerland', 'swiss', 'ch'] },
        { name: 'Ireland', patterns: ['ireland', 'irish', 'ie'] },
        { name: 'Luxembourg', patterns: ['luxembourg', 'lu'] },
        { name: 'Macao', patterns: ['macao', 'macau', 'mo'] },
        { name: 'Taiwan', patterns: ['taiwan', 'tw'] },
        { name: 'Malaysia', patterns: ['malaysia', 'malaysian', 'my'] },
        { name: 'Thailand', patterns: ['thailand', 'thai', 'th'] },
        { name: 'Vietnam', patterns: ['vietnam', 'vietnamese', 'vn'] },
        { name: 'Indonesia', patterns: ['indonesia', 'indonesian', 'id'] },
        { name: 'Philippines', patterns: ['philippines', 'filipino', 'ph'] },
        { name: 'Brazil', patterns: ['brazil', 'brazilian', 'br'] },
        { name: 'Mexico', patterns: ['mexico', 'mexican', 'mx'] },
        { name: 'Russia', patterns: ['russia', 'russian', 'ru'] },
        { name: 'Italy', patterns: ['italy', 'italian', 'it'] },
        { name: 'Spain', patterns: ['spain', 'spanish', 'es'] },
        { name: 'Poland', patterns: ['poland', 'polish', 'pl'] },
        { name: 'Sweden', patterns: ['sweden', 'swedish', 'se'] },
        { name: 'Norway', patterns: ['norway', 'norwegian', 'no'] },
        { name: 'Denmark', patterns: ['denmark', 'danish', 'dk'] },
        { name: 'Finland', patterns: ['finland', 'finnish', 'fi'] },
        { name: 'Belgium', patterns: ['belgium', 'belgian', 'be'] },
        { name: 'Austria', patterns: ['austria', 'austrian', 'at'] },
        { name: 'UAE', patterns: ['uae', 'united arab emirates', 'dubai', 'ae'] },
        { name: 'Saudi Arabia', patterns: ['saudi arabia', 'saudi', 'sa'] },
        { name: 'South Africa', patterns: ['south africa', 'za'] },
        { name: 'New Zealand', patterns: ['new zealand', 'nz'] },
        { name: 'Turkey', patterns: ['turkey', 'turkish', 'tr'] }
    ];
    
    const queryLower = query.toLowerCase();
    
    countryPatterns.forEach(country => {
        if (country.patterns.some(pattern => queryLower.includes(pattern))) {
            if (!countries.includes(country.name)) {
                countries.push(country.name);
            }
        }
    });
    
    return countries;
}

// Get official government tax authority source for a country
function getCountryOfficialSource(country) {
    const sources = {
        'United States': {
            title: 'IRS - US Internal Revenue Service',
            url: 'https://www.irs.gov/',
            snippet: 'Official US tax authority - federal tax information, forms and filing guidance.',
            type: 'official',
            reliability: 'high'
        },
        'United Kingdom': {
            title: 'HMRC - UK Tax Authority',
            url: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
            snippet: 'Official UK tax authority - tax rates, allowances and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'China': {
            title: 'State Taxation Administration of China',
            url: 'http://www.chinatax.gov.cn/',
            snippet: 'Official Chinese tax authority - tax policies, rates and regulations.',
            type: 'official',
            reliability: 'high'
        },
        'Japan': {
            title: 'National Tax Agency Japan',
            url: 'https://www.nta.go.jp/',
            snippet: 'Official Japanese tax authority - national tax information and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Germany': {
            title: 'German Federal Ministry of Finance',
            url: 'https://www.bundesfinanzministerium.de/',
            snippet: 'Official German tax authority - federal tax policies and rates.',
            type: 'official',
            reliability: 'high'
        },
        'France': {
            title: 'French Tax Authority (DGFiP)',
            url: 'https://www.impots.gouv.fr/',
            snippet: 'Official French tax authority - tax information and online services.',
            type: 'official',
            reliability: 'high'
        },
        'Singapore': {
            title: 'IRAS - Inland Revenue Authority of Singapore',
            url: 'https://www.iras.gov.sg/',
            snippet: 'Official Singapore tax authority - tax rates, guides and e-services.',
            type: 'official',
            reliability: 'high'
        },
        'Hong Kong': {
            title: 'Inland Revenue Department Hong Kong',
            url: 'https://www.ird.gov.hk/',
            snippet: 'Official Hong Kong tax authority - tax rates and filing information.',
            type: 'official',
            reliability: 'high'
        },
        'India': {
            title: 'Income Tax Department India',
            url: 'https://www.incometax.gov.in/',
            snippet: 'Official Indian tax authority - income tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Australia': {
            title: 'ATO - Australian Taxation Office',
            url: 'https://www.ato.gov.au/',
            snippet: 'Official Australian tax authority - tax rates, calculators and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Canada': {
            title: 'CRA - Canada Revenue Agency',
            url: 'https://www.canada.ca/en/revenue-agency.html',
            snippet: 'Official Canadian tax authority - tax information and online services.',
            type: 'official',
            reliability: 'high'
        },
        'South Korea': {
            title: 'National Tax Service Korea',
            url: 'https://www.nts.go.kr/',
            snippet: 'Official South Korean tax authority - tax policies and services.',
            type: 'official',
            reliability: 'high'
        },
        'Netherlands': {
            title: 'Belastingdienst - Dutch Tax Authority',
            url: 'https://www.belastingdienst.nl/',
            snippet: 'Official Dutch tax authority - tax rates and information.',
            type: 'official',
            reliability: 'high'
        },
        'Switzerland': {
            title: 'Swiss Federal Tax Administration',
            url: 'https://www.estv.admin.ch/',
            snippet: 'Official Swiss tax authority - federal tax information.',
            type: 'official',
            reliability: 'high'
        },
        'Ireland': {
            title: 'Irish Revenue Commissioners',
            url: 'https://www.revenue.ie/',
            snippet: 'Official Irish tax authority - tax rates and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Luxembourg': {
            title: 'Administration des Contributions Luxembourg',
            url: 'https://impotsdirects.public.lu/',
            snippet: 'Official Luxembourg tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Macao': {
            title: 'Macao Financial Services Bureau',
            url: 'https://www.dsf.gov.mo/',
            snippet: 'Official Macao tax authority - tax regulations and services.',
            type: 'official',
            reliability: 'high'
        },
        'Taiwan': {
            title: 'Ministry of Finance Taiwan',
            url: 'https://www.mof.gov.tw/',
            snippet: 'Official Taiwan tax authority - tax policies and rates.',
            type: 'official',
            reliability: 'high'
        },
        'Malaysia': {
            title: 'LHDN - Inland Revenue Board Malaysia',
            url: 'https://www.hasil.gov.my/',
            snippet: 'Official Malaysian tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Thailand': {
            title: 'Thai Revenue Department',
            url: 'https://www.rd.go.th/',
            snippet: 'Official Thai tax authority - tax rates and regulations.',
            type: 'official',
            reliability: 'high'
        },
        'Vietnam': {
            title: 'Vietnam General Department of Taxation',
            url: 'https://www.gdt.gov.vn/',
            snippet: 'Official Vietnamese tax authority - tax policies and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Indonesia': {
            title: 'Indonesian Tax Authority (DJP)',
            url: 'https://www.pajak.go.id/',
            snippet: 'Official Indonesian tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Philippines': {
            title: 'BIR - Bureau of Internal Revenue Philippines',
            url: 'https://www.bir.gov.ph/',
            snippet: 'Official Philippine tax authority - tax rates and filing guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Brazil': {
            title: 'Brazilian Federal Revenue Service',
            url: 'https://www.gov.br/receitafederal/',
            snippet: 'Official Brazilian tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Mexico': {
            title: 'SAT - Mexican Tax Authority',
            url: 'https://www.sat.gob.mx/',
            snippet: 'Official Mexican tax authority - tax services and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Russia': {
            title: 'Russian Federal Tax Service',
            url: 'https://www.nalog.gov.ru/',
            snippet: 'Official Russian tax authority - tax rates and regulations.',
            type: 'official',
            reliability: 'high'
        },
        'Italy': {
            title: 'Agenzia delle Entrate - Italian Revenue Agency',
            url: 'https://www.agenziaentrate.gov.it/',
            snippet: 'Official Italian tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Spain': {
            title: 'AEAT - Spanish Tax Agency',
            url: 'https://www.agenciatributaria.es/',
            snippet: 'Official Spanish tax authority - tax rates and filing guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Poland': {
            title: 'Polish Ministry of Finance',
            url: 'https://www.gov.pl/web/finanse',
            snippet: 'Official Polish tax authority - tax policies and information.',
            type: 'official',
            reliability: 'high'
        },
        'Sweden': {
            title: 'Swedish Tax Agency (Skatteverket)',
            url: 'https://www.skatteverket.se/',
            snippet: 'Official Swedish tax authority - tax rates and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Norway': {
            title: 'Norwegian Tax Administration',
            url: 'https://www.skatteetaten.no/',
            snippet: 'Official Norwegian tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Denmark': {
            title: 'Danish Tax Agency (Skattestyrelsen)',
            url: 'https://skst.dk/',
            snippet: 'Official Danish tax authority - tax rates and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Finland': {
            title: 'Finnish Tax Administration (Vero)',
            url: 'https://www.vero.fi/',
            snippet: 'Official Finnish tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Belgium': {
            title: 'FPS Finance Belgium',
            url: 'https://finance.belgium.be/',
            snippet: 'Official Belgian tax authority - tax rates and guidance.',
            type: 'official',
            reliability: 'high'
        },
        'Austria': {
            title: 'Austrian Ministry of Finance',
            url: 'https://www.bmf.gv.at/',
            snippet: 'Official Austrian tax authority - tax policies and rates.',
            type: 'official',
            reliability: 'high'
        },
        'UAE': {
            title: 'UAE Federal Tax Authority',
            url: 'https://www.tax.gov.ae/',
            snippet: 'Official UAE tax authority - VAT and tax information.',
            type: 'official',
            reliability: 'high'
        },
        'Saudi Arabia': {
            title: 'Zakat, Tax and Customs Authority Saudi Arabia',
            url: 'https://zatca.gov.sa/',
            snippet: 'Official Saudi tax authority - VAT and Zakat information.',
            type: 'official',
            reliability: 'high'
        },
        'South Africa': {
            title: 'SARS - South African Revenue Service',
            url: 'https://www.sars.gov.za/',
            snippet: 'Official South African tax authority - tax rates and services.',
            type: 'official',
            reliability: 'high'
        },
        'New Zealand': {
            title: 'IRD - Inland Revenue New Zealand',
            url: 'https://www.ird.govt.nz/',
            snippet: 'Official New Zealand tax authority - tax information and services.',
            type: 'official',
            reliability: 'high'
        },
        'Turkey': {
            title: 'Turkish Revenue Administration',
            url: 'https://www.gib.gov.tr/',
            snippet: 'Official Turkish tax authority - tax rates and regulations.',
            type: 'official',
            reliability: 'high'
        }
    };
    
    return sources[country] || null;
}