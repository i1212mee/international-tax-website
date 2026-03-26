// Main Application Logic

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCountryDropdowns();
    initializeBatchCountryCheckboxes();
    initializeTabs();
    initializeEventListeners();
});

// Initialize country dropdowns with autocomplete
function initializeCountryDropdowns() {
    // Setup autocomplete for each country input
    setupAutocomplete('country-input', 'country-dropdown', 'country-select');
    setupAutocomplete('payer-input', 'payer-dropdown', 'payer-country');
    setupAutocomplete('payee-input', 'payee-dropdown', 'payee-country');
    setupAutocomplete('batch-payer-input', 'batch-payer-dropdown', 'batch-payer-country');
    
    // Setup batch country filter
    setupBatchFilter();
}

// Setup autocomplete for a single input
function setupAutocomplete(inputId, dropdownId, hiddenId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const hidden = document.getElementById(hiddenId);
    
    if (!input || !dropdown || !hidden) return;
    
    let highlightedIndex = -1;
    let filteredCountries = [];
    
    // Show dropdown on focus
    input.addEventListener('focus', function() {
        const value = this.value.trim().toLowerCase();
        filteredCountries = value ? 
            COUNTRIES.filter(c => 
                c.name.toLowerCase().includes(value) || 
                c.code.toLowerCase().includes(value)
            ) : COUNTRIES;
        showDropdown(filteredCountries);
    });
    
    // Filter on input
    input.addEventListener('input', function() {
        const value = this.value.trim().toLowerCase();
        hidden.value = ''; // Reset hidden value when input changes
        
        if (!value) {
            filteredCountries = COUNTRIES;
        } else {
            filteredCountries = COUNTRIES.filter(c => 
                c.name.toLowerCase().includes(value) || 
                c.code.toLowerCase().includes(value)
            );
        }
        
        showDropdown(filteredCountries);
        highlightedIndex = -1;
    });
    
    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                selectCountry(items[highlightedIndex]);
            } else if (filteredCountries.length > 0) {
                selectCountryByIndex(0);
            }
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    // Show dropdown function
    function showDropdown(countries) {
        if (countries.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-empty">No countries found</div>';
            dropdown.style.display = 'block';
            return;
        }
        
        dropdown.innerHTML = countries.map((c, index) => `
            <div class="dropdown-item" data-code="${c.code}" data-name="${c.name}">
                <span class="country-name">${c.name}</span>
                <span class="country-code">${c.code}</span>
            </div>
        `).join('');
        
        // Add click handlers
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                selectCountry(this);
            });
        });
        
        dropdown.style.display = 'block';
    }
    
    // Update highlight
    function updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === highlightedIndex);
        });
        
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    // Select country
    function selectCountry(element) {
        const code = element.getAttribute('data-code');
        const name = element.getAttribute('data-name');
        input.value = name;
        hidden.value = code;
        dropdown.style.display = 'none';
        highlightedIndex = -1;
    }
    
    // Select country by index
    function selectCountryByIndex(index) {
        if (filteredCountries[index]) {
            input.value = filteredCountries[index].name;
            hidden.value = filteredCountries[index].code;
            dropdown.style.display = 'none';
        }
    }
}

// Setup batch country filter
function setupBatchFilter() {
    const filterInput = document.getElementById('batch-country-filter');
    const container = document.getElementById('batch-payee-countries');
    
    if (!filterInput || !container) return;
    
    filterInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const items = container.querySelectorAll('.checkbox-item');
        
        items.forEach(item => {
            const label = item.querySelector('label').textContent.toLowerCase();
            item.style.display = label.includes(value) ? '' : 'none';
        });
    });
}

// Initialize batch country checkboxes
function initializeBatchCountryCheckboxes() {
    const container = document.getElementById('batch-payee-countries');
    if (!container) return;

    COUNTRIES.forEach(country => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `batch-country-${country.code}`;
        checkbox.value = country.code;

        const label = document.createElement('label');
        label.htmlFor = `batch-country-${country.code}`;
        label.textContent = country.name;

        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

// Initialize tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // National tax query
    document.getElementById('query-national-tax').addEventListener('click', queryNationalTax);

    // Withholding tax query
    document.getElementById('query-withholding-tax').addEventListener('click', queryWithholdingTax);

    // Batch withholding tax query
    document.getElementById('query-batch-withholding-tax').addEventListener('click', queryBatchWithholdingTax);
}

// Show loading overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Query National Tax Rates
async function queryNationalTax() {
    const countryCode = document.getElementById('country-select').value;
    const transactionType = document.getElementById('transaction-type').value;

    if (!countryCode) {
        alert('Please select a country/region.');
        return;
    }
    
    if (!transactionType) {
        alert('Please select a transaction type.');
        return;
    }

    showLoading();

    try {
        // Get country name
        const country = COUNTRIES.find(c => c.code === countryCode);
        const countryName = country ? country.name : countryCode;

        // Get base data from local database
        const baseData = TAX_DATA.national[countryCode];

        // Search web for current rates
        const searchQuery = `${countryName} ${transactionType.replace('-', ' ')} tax rate 2026`;
        const webResults = await searchWebRates(searchQuery);

        // Display results
        displayNationalTaxResults(countryName, countryCode, transactionType, baseData, webResults);
    } catch (error) {
        console.error('Error querying national tax:', error);
        alert('Error querying tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display National Tax Results
function displayNationalTaxResults(countryName, countryCode, transactionType, baseData, webResults) {
    const resultsContainer = document.getElementById('national-tax-results');
    const contentDiv = document.getElementById('national-tax-content');

    let html = `<div class="tax-result-card">`;
    html += `<div class="country-name">${countryName}</div>`;

    if (baseData) {
        switch(transactionType) {
            case 'vat':
            case 'gst':
                const taxInfo = baseData.vat || baseData.gst || baseData.sst;
                if (taxInfo) {
                    html += `<div class="tax-type">${transactionType.toUpperCase()}</div>`;
                    
                    // Check if it has tiers (new format)
                    if (taxInfo.tiers && taxInfo.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        taxInfo.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        // Old format fallback
                        html += `<div class="rate-value">${taxInfo.standard || 'N/A'}</div>`;
                    }
                    
                    if (taxInfo.note) {
                        html += `<div class="rate-label">${taxInfo.note}</div>`;
                    }
                } else {
                    html += `<div class="alert alert-warning">No ${transactionType.toUpperCase()} data available for this country.</div>`;
                }
                break;

            case 'income-tax':
                if (baseData.incomeTax) {
                    html += `<div class="tax-type">Income Tax</div>`;
                    
                    // Check if it has tiers (new format)
                    if (baseData.incomeTax.tiers && baseData.incomeTax.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        baseData.incomeTax.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        // Old format fallback
                        html += `<div class="rate-value" style="font-size: 1.5em;">`;
                        html += `Corporate: ${baseData.incomeTax.corporate?.standard || 'N/A'}<br>`;
                        html += `Individual: ${baseData.incomeTax.individual?.standard || 'N/A'}`;
                        html += `</div>`;
                        if (baseData.incomeTax.corporate?.note) {
                            html += `<div class="rate-label">${baseData.incomeTax.corporate.note}</div>`;
                        }
                    }
                } else {
                    html += `<div class="alert alert-warning">No Income Tax data available for this country.</div>`;
                }
                break;

            case 'business-tax':
                if (baseData.businessTax) {
                    html += `<div class="tax-type">Business Tax</div>`;
                    
                    // Check if it has tiers (new format)
                    if (baseData.businessTax.tiers && baseData.businessTax.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        baseData.businessTax.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        html += `<div class="rate-value">${baseData.businessTax.standard || 'N/A'}</div>`;
                    }
                    
                    if (baseData.businessTax.note) {
                        html += `<div class="rate-label">${baseData.businessTax.note}</div>`;
                    }
                } else {
                    html += `<div class="alert alert-warning">No Business Tax data available for this country.</div>`;
                }
                break;
        }
    } else {
        html += `<div class="alert alert-warning">Limited data available for this country. Please verify with official sources.</div>`;
    }

    html += `</div>`;

    // Add web search sources
    if (webResults && webResults.length > 0) {
        html += `<div class="source-section">`;
        html += `<h4>Data Sources</h4>`;
        webResults.forEach(result => {
            html += `<div class="source-item verified">`;
            html += `<a href="${result.url}" target="_blank" rel="noopener">${result.title}</a>`;
            html += `<p>${result.snippet}</p>`;
            html += `</div>`;
        });
        html += `</div>`;
    }

    contentDiv.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Query Withholding Tax Rate
async function queryWithholdingTax() {
    const payerCountry = document.getElementById('payer-country').value;
    const payeeCountry = document.getElementById('payee-country').value;
    const paymentType = document.getElementById('payment-type').value;

    if (!payerCountry || !payeeCountry || !paymentType) {
        alert('Please select payer country, payee country, and payment type.');
        return;
    }

    if (payerCountry === payeeCountry) {
        alert('Payer and payee countries should be different for withholding tax.');
        return;
    }

    showLoading();

    try {
        const payerName = COUNTRIES.find(c => c.code === payerCountry)?.name || payerCountry;
        const payeeName = COUNTRIES.find(c => c.code === payeeCountry)?.name || payeeCountry;

        // Get treaty rate from local database
        const treatyKey = `${payerCountry}_${payeeCountry}_${paymentType}`;
        const treatyRate = TAX_DATA.withholding[treatyKey] || getDefaultWHTRate(paymentType);

        // Search web for verification (multiple sources)
        const searchQueries = [
            `${payerName} ${payeeName} withholding tax ${paymentType} treaty rate`,
            `${payerName} to ${payeeName} WHT ${paymentType} double taxation treaty`,
            `${payerName} ${payeeName} tax treaty ${paymentType} withholding`
        ];

        const webResults = await Promise.all(
            searchQueries.map(q => searchWebRates(q))
        );

        // Flatten and deduplicate results
        const allResults = webResults.flat().slice(0, 5);

        // Display results with cross-verification
        displayWithholdingTaxResults(
            payerName, payerCountry,
            payeeName, payeeCountry,
            paymentType, treatyRate,
            allResults
        );
    } catch (error) {
        console.error('Error querying withholding tax:', error);
        alert('Error querying withholding tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Withholding Tax Results
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, treatyRate, webResults) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');
    const sourceSection = document.getElementById('source-verification');
    const sourceList = document.getElementById('source-list');
    const verificationResult = document.getElementById('cross-verification-result');

    // Main result card
    let html = `<div class="tax-result-card">`;
    html += `<div class="tax-type">Withholding Tax Rate</div>`;
    html += `<div class="country-name">${payerName} → ${payeeName}</div>`;
    html += `<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</div>`;
    html += `<div class="rate-value">${treatyRate}</div>`;

    // Add treaty information
    html += `<div class="alert alert-info" style="margin-top: 15px;">`;
    html += `<strong>Note:</strong> This rate is based on the Double Taxation Treaty (DTT) between ${payerName} and ${payeeName}. `;
    html += `The actual rate may vary based on specific circumstances. Please verify with tax authorities.`;
    html += `</div>`;

    html += `</div>`;

    contentDiv.innerHTML = html;

    // Display sources with cross-verification
    if (webResults && webResults.length > 0) {
        let sourceHtml = '';

        // Take up to 5 sources for cross-verification
        const sources = webResults.slice(0, 5);

        sources.forEach((source, index) => {
            sourceHtml += `<div class="source-item verified">`;
            sourceHtml += `<strong>Source ${index + 1}:</strong> `;
            sourceHtml += `<a href="${source.url}" target="_blank" rel="noopener">${source.title}</a>`;
            sourceHtml += `<p style="font-size: 0.9em; margin-top: 5px;">${source.snippet}</p>`;
            sourceHtml += `</div>`;
        });

        sourceList.innerHTML = sourceHtml;

        // Cross-verification result
        const verificationHtml = `
            <div class="verification-warning">
                <strong>Cross-Verification Status:</strong>
                <p style="margin-top: 10px;">
                    Please manually verify the tax rate from at least <strong>3 different sources</strong> above.
                    Tax treaties and rates may change, and official government sources should be consulted for the most accurate information.
                </p>
                <p style="margin-top: 10px; font-size: 0.9em;">
                    <strong>Recommended Official Sources:</strong>
                </p>
                <ul style="margin-top: 5px; padding-left: 20px;">
                    <li>OECD Tax Database: <a href="https://www.oecd.org/tax/tax-policy/" target="_blank">oecd.org/tax</a></li>
                    <li>${payerName} Tax Authority Official Website</li>
                    <li>${payeeName} Tax Authority Official Website</li>
                    <li>IBFD Tax Research Platform</li>
                </ul>
            </div>
        `;

        verificationResult.innerHTML = verificationHtml;
        sourceSection.style.display = 'block';
    } else {
        sourceSection.style.display = 'none';
    }

    resultsContainer.style.display = 'block';
}

// Query Batch Withholding Tax Rates
async function queryBatchWithholdingTax() {
    const payerCountry = document.getElementById('batch-payer-country').value;
    const paymentType = document.getElementById('batch-payment-type').value;

    // Get selected payee countries
    const payeeCheckboxes = document.querySelectorAll('#batch-payee-countries input[type="checkbox"]:checked');
    const payeeCountries = Array.from(payeeCheckboxes).map(cb => cb.value);

    if (!payerCountry || !paymentType || payeeCountries.length === 0) {
        alert('Please select payer country, payment type, and at least one payee country.');
        return;
    }

    if (payeeCountries.length > 20) {
        alert('Please select a maximum of 20 countries for batch comparison.');
        return;
    }

    showLoading();

    try {
        const payerName = COUNTRIES.find(c => c.code === payerCountry)?.name || payerCountry;

        // Prepare results table
        const results = [];

        for (const payeeCode of payeeCountries) {
            const payeeName = COUNTRIES.find(c => c.code === payeeCode)?.name || payeeCode;

            // Get treaty rate
            const treatyKey = `${payerCountry}_${payeeCode}_${paymentType}`;
            const treatyRate = TAX_DATA.withholding[treatyKey] || getDefaultWHTRate(paymentType);

            results.push({
                payeeName,
                payeeCode,
                rate: treatyRate,
                hasTreaty: !!TAX_DATA.withholding[treatyKey]
            });
        }

        // Display batch results
        displayBatchResults(payerName, payerCountry, paymentType, results);
    } catch (error) {
        console.error('Error in batch query:', error);
        alert('Error in batch query. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Batch Results
function displayBatchResults(payerName, payerCode, paymentType, results) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');
    const sourceSection = document.getElementById('source-verification');

    // Sort by rate (extract numeric value for sorting)
    results.sort((a, b) => {
        const aNum = parseFloat(a.rate.replace(/[^0-9.]/g, '')) || 999;
        const bNum = parseFloat(b.rate.replace(/[^0-9.]/g, '')) || 999;
        return aNum - bNum;
    });

    let html = `
        <div class="alert alert-info" style="margin-bottom: 20px;">
            <strong>Batch Comparison:</strong> Withholding tax rates from ${payerName} for ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} payments
        </div>
    `;

    html += `<table class="batch-results-table">`;
    html += `
        <thead>
            <tr>
                <th>Payee Country</th>
                <th>WHT Rate</th>
                <th>Treaty Status</th>
            </tr>
        </thead>
        <tbody>
    `;

    results.forEach(result => {
        const badgeClass = result.hasTreaty ? 'badge-match' : 'badge-partial';
        const badgeText = result.hasTreaty ? 'Treaty Rate' : 'Default Rate';

        html += `
            <tr>
                <td>${result.payeeName}</td>
                <td class="rate-cell">${result.rate}</td>
                <td><span class="comparison-badge ${badgeClass}">${badgeText}</span></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    html += `
        <div class="alert alert-warning" style="margin-top: 20px;">
            <strong>Note:</strong> Rates shown are based on available treaty data. Countries marked as "Default Rate"
            indicate no specific treaty rate in our database. Please verify with official sources.
        </div>
    `;

    contentDiv.innerHTML = html;
    sourceSection.style.display = 'none';
    resultsContainer.style.display = 'block';
}

// Real function to call backend API for web search
// Uses serverless function to get tax rate sources
async function searchWebRates(query, type = 'general') {
    try {
        // Try Netlify function path first
        let response = await fetch(`/.netlify/functions/search?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
        
        // If Netlify function fails, try Vercel path
        if (!response.ok) {
            response = await fetch(`/api/search?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
        }
        
        if (response.ok) {
            const data = await response.json();
            return data.results || [];
        } else {
            console.warn('API search failed, falling back to local data');
        }
    } catch (error) {
        console.warn('API search error:', error);
    }
    
    // Fallback to curated sources if API is not available
    return getCuratedSources(query);
}

// Get curated tax sources based on query
function getCuratedSources(query) {
    const queryLower = query.toLowerCase();
    const sources = [];
    
    // Extract countries from query
    const countries = extractCountries(queryLower);
    
    // Always include OECD
    sources.push({
        title: 'OECD Tax Database',
        url: 'https://www.oecd.org/tax/tax-policy/',
        snippet: 'Official OECD tax statistics, tax treaty information and policy analysis for member and partner countries.',
        type: 'official',
        reliability: 'high'
    });
    
    // IBFD
    sources.push({
        title: 'IBFD Tax Research Platform',
        url: 'https://www.ibfd.org/',
        snippet: 'International Bureau of Fiscal Documentation - comprehensive tax research platform with country tax guides.',
        type: 'professional',
        reliability: 'high'
    });
    
    // KPMG Tax Rates
    sources.push({
        title: 'KPMG Corporate Tax Rates Table',
        url: 'https://home.kpmg/xx/en/home/services/tax/tax-tools-and-resources/tax-rates-online.html',
        snippet: 'KPMG\'s interactive tax rate tables showing corporate income tax, indirect tax rates by country.',
        type: 'professional',
        reliability: 'high'
    });
    
    // PwC Worldwide Tax Summaries
    sources.push({
        title: 'PwC Worldwide Tax Summaries',
        url: 'https://taxsummaries.pwc.com/',
        snippet: 'PwC\'s comprehensive guides to corporate and individual taxes in jurisdictions worldwide.',
        type: 'professional',
        reliability: 'high'
    });
    
    // Deloitte Tax
    sources.push({
        title: 'Deloitte International Tax Sources',
        url: 'https://www.deloitte.com/global/en/services/tax.html',
        snippet: 'Deloitte\'s international tax guides and country-specific tax information.',
        type: 'professional',
        reliability: 'high'
    });
    
    return sources;
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
        { name: 'Luxembourg', patterns: ['luxembourg', 'lu'] }
    ];
    
    countryPatterns.forEach(country => {
        if (country.patterns.some(pattern => query.includes(pattern))) {
            if (!countries.includes(country.name)) {
                countries.push(country.name);
            }
        }
    });
    
    return countries;
}

// Utility function to format payment type for display
function formatPaymentType(type) {
    const types = {
        dividends: 'Dividends',
        interest: 'Interest',
        royalties: 'Royalties',
        services: 'Technical Services',
        management: 'Management Fees'
    };
    return types[type] || type;
}