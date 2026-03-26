// Main Application Logic

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCountryDropdowns();
    initializeBatchCountryCheckboxes();
    initializeTabs();
    initializeEventListeners();
});

// Initialize country dropdowns
function initializeCountryDropdowns() {
    const dropdowns = [
        'country-select',
        'payer-country',
        'payee-country',
        'batch-payer-country'
    ];

    dropdowns.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            COUNTRIES.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                select.appendChild(option);
            });
        }
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
    const scenario = document.getElementById('transaction-scenario').value;

    if (!countryCode || !transactionType) {
        alert('Please select both country and transaction type.');
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
        const searchQuery = `${countryName} ${transactionType.replace('-', ' ')} tax rate 2024`;
        const webResults = await searchWebRates(searchQuery);

        // Display results
        displayNationalTaxResults(countryName, countryCode, transactionType, scenario, baseData, webResults);
    } catch (error) {
        console.error('Error querying national tax:', error);
        alert('Error querying tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display National Tax Results
function displayNationalTaxResults(countryName, countryCode, transactionType, scenario, baseData, webResults) {
    const resultsContainer = document.getElementById('national-tax-results');
    const contentDiv = document.getElementById('national-tax-content');

    let html = `<div class="tax-result-card">`;
    html += `<div class="country-name">${countryName}</div>`;

    if (baseData) {
        switch(transactionType) {
            case 'vat':
            case 'gst':
                const taxInfo = baseData.vat || baseData.gst;
                if (taxInfo) {
                    const rate = scenario === 'standard' ? taxInfo.standard :
                                scenario === 'reduced' ? (taxInfo.reduced || taxInfo.standard) :
                                scenario === 'zero' ? '0%' :
                                scenario === 'exempt' ? 'Exempt' :
                                taxInfo.standard;
                    html += `<div class="tax-type">${transactionType.toUpperCase()}</div>`;
                    html += `<div class="rate-value">${rate}</div>`;
                    if (taxInfo.note) {
                        html += `<div class="rate-label">${taxInfo.note}</div>`;
                    }
                }
                break;

            case 'income-tax':
                if (baseData.incomeTax) {
                    const incTax = baseData.incomeTax;
                    html += `<div class="tax-type">Income Tax</div>`;
                    html += `<div class="rate-value" style="font-size: 1.5em;">`;
                    html += `Corporate: ${incTax.corporate?.standard || 'N/A'}<br>`;
                    html += `Individual: ${incTax.individual?.standard || 'N/A'}`;
                    html += `</div>`;
                    if (incTax.corporate?.note) {
                        html += `<div class="rate-label">${incTax.corporate.note}</div>`;
                    }
                }
                break;

            case 'business-tax':
                if (baseData.businessTax) {
                    html += `<div class="tax-type">Business Tax</div>`;
                    html += `<div class="rate-value">${baseData.businessTax.standard || 'N/A'}</div>`;
                    if (baseData.businessTax.note) {
                        html += `<div class="rate-label">${baseData.businessTax.note}</div>`;
                    }
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

// Mock function to simulate web search
// In production, this would connect to a real search API or backend service
async function searchWebRates(query) {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, this would call a backend API
    // which would perform actual web searches using services like:
    // - Google Custom Search API
    // - Bing Search API
    // - Official tax authority websites
    // - OECD tax database
    // - IBFD tax research platform

    // Return mock results for demonstration
    const mockResults = [
        {
            title: `OECD Tax Database - ${query}`,
            url: 'https://www.oecd.org/tax/tax-policy/',
            snippet: 'Official OECD tax statistics and policy information for member countries.'
        },
        {
            title: `Tax Treaty Information - ${query}`,
            url: 'https://www.ibfd.org/',
            snippet: 'International Bureau of Fiscal Documentation - comprehensive tax research.'
        },
        {
            title: `Official Government Tax Authority - ${query}`,
            url: '#',
            snippet: 'Please visit the official tax authority website of the relevant country for the most accurate rates.'
        }
    ];

    return mockResults;

    /* Real implementation would be:
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.results;
    */
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