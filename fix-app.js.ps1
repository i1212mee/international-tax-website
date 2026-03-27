# Fix app.js by removing duplicate function definitions

$filePath = "D:\CodeFuse\claude-test-project\tax-website\app.js"

# Read the file content
$content = Get-Content $filePath -Raw -Encoding UTF8

# Find the end of the first clean section (line 956: closing brace of displayNationalTaxResults)
# We need to keep lines 1-956 and then add the correct remaining functions

$lines = Get-Content $filePath -Encoding UTF8

# Keep first 956 lines
$cleanContent = $lines[0..955] -join "`r`n"

# Add the correct functions
$correctFunctions = @"

// Get domestic WHT rate (non-treaty rate) for a country
function getDomesticWHTRate(countryCode, paymentType) {
    const domesticRates = {
        'SG': { interest: '15%', dividend: '0%', royalty: '15%', technical: '15%', management: '15%' },
        'HK': { interest: '0%', dividend: '0%', royalty: '2.475-4.95%', technical: 'N/A', management: 'N/A' },
        'MY': { interest: '15%', dividend: '0%', royalty: '10%', technical: '10%', management: '10%' },
        'CN': { interest: '20%', dividend: '20%', royalty: '20%', technical: '20%', management: '20%' },
        'JP': { interest: '20.42%', dividend: '20%', royalty: '20.42%', technical: '20.42%', management: '20.42%' },
        'US': { interest: '30%', dividend: '30%', royalty: '30%', technical: '30%', management: '30%' },
        'UK': { interest: '20%', dividend: '0%', royalty: '20%', technical: '20%', management: '20%' },
        'DE': { interest: '25%', dividend: '25%', royalty: '15%', technical: '15%', management: '15%' },
        'FR': { interest: '12.8%', dividend: '30%', royalty: '33.33%', technical: '33.33%', management: '33.33%' },
        'AU': { interest: '30%', dividend: '30%', royalty: '30%', technical: '30%', management: '30%' },
        'CA': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'IN': { interest: '20%', dividend: '20%', royalty: '10%', technical: '10%', management: '10%' },
        'KR': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'TW': { interest: '20%', dividend: '21%', royalty: '20%', technical: '20%', management: '20%' },
        'TH': { interest: '15%', dividend: '10%', royalty: '15%', technical: '15%', management: '15%' },
        'ID': { interest: '20%', dividend: '20%', royalty: '20%', technical: '20%', management: '20%' },
        'VN': { interest: '5%', dividend: '5%', royalty: '10%', technical: '10%', management: '10%' },
        'PH': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'NZ': { interest: '15%', dividend: '0%', royalty: '15%', technical: '15%', management: '15%' },
        'NL': { interest: '15%', dividend: '15%', royalty: '15%', technical: '15%', management: '15%' },
        'CH': { interest: '35%', dividend: '35%', royalty: '35%', technical: '35%', management: '35%' },
        'LU': { interest: '0%', dividend: '0%', royalty: '0%', technical: '0%', management: '0%' },
        'IE': { interest: '20%', dividend: '25%', royalty: '20%', technical: '20%', management: '20%' },
        'MO': { interest: '0%', dividend: '0%', royalty: '0%', technical: '0%', management: '0%' }
    };
    if (domesticRates[countryCode] && domesticRates[countryCode][paymentType]) {
        return domesticRates[countryCode][paymentType];
    }
    return 'Standard rate applies';
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
        
        // Get domestic rate
        const domesticRate = getDomesticWHTRate(payerCountry, paymentType);
        
        // Get treaty rate
        const treatyKey = payerCountry + '_' + payeeCountry + '_' + paymentType;
        const treatyRate = TAX_DATA.withholding[treatyKey] || 'No Treaty';
        const hasTreaty = treatyRate !== 'No Treaty' && !treatyRate.includes('No Treaty');
        
        // Search web for verification
        const searchStartTime = Date.now();
        const searchQuery = payerName + ' ' + payeeName + ' withholding tax ' + paymentType + ' treaty rate 2026';
        const webResults = await searchWebRates(searchQuery, 'wht', payerName, payeeName, paymentType);
        const searchDuration = Date.now() - searchStartTime;
        
        // Add to history
        addToHistory({
            type: 'wht',
            title: 'WHT: ' + payerName + ' to ' + payeeName + ' (' + paymentType + ')',
            payerCode: payerCountry,
            payerName: payerName,
            payeeCode: payeeCountry,
            payeeName: payeeName,
            paymentType: paymentType
        });
        
        // Display results with two sections
        displayWithholdingTaxResults(payerName, payerCountry, payeeName, payeeCountry, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration);
        
    } catch (error) {
        console.error('Error querying withholding tax:', error);
        alert('Error querying withholding tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');
    const sourceSection = document.getElementById('source-verification');
    const sourceList = document.getElementById('source-list');
    
    const queryTime = new Date().toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    
    // Calculate applicable rate
    let domesticRateNum = parseFloat(String(domesticRate).replace(/[^0-9.]/g, '')) || 0;
    let treatyRateNum = parseFloat(String(treatyRate).replace(/[^0-9.]/g, '')) || 0;
    
    let applicableRate = treatyRate;
    let applicableNote = '';
    
    if (domesticRateNum > 0 && (treatyRateNum === 0 || domesticRateNum < treatyRateNum)) {
        applicableRate = domesticRate;
        applicableNote = 'Domestic rate applies (lower than treaty rate)';
    } else if (treatyRateNum > 0 && treatyRateNum <= domesticRateNum) {
        applicableRate = treatyRate;
        applicableNote = 'Treaty rate applies';
    } else if (treatyRateNum === 0 && domesticRateNum === 0) {
        applicableRate = '0%';
        applicableNote = 'No WHT applicable';
    } else if (!hasTreaty) {
        applicableRate = domesticRate;
        applicableNote = 'No treaty - domestic rate applies';
    }
    
    let html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Withholding Tax Analysis</div>';
    html += '<div class="country-name">' + payerName + ' to ' + payeeName + '</div>';
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';
    
    // Section 1: Domestic WHT Rate
    html += '<div class="wht-section domestic-section" style="margin: 15px 0; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">';
    html += '<div class="section-header" style="font-weight: bold; color: #e65100; margin-bottom: 8px;"><span>Section 1: Domestic WHT Rate (Non-Treaty)</span></div>';
    html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under ' + payerName + ' domestic tax law, without considering any Double Tax Treaty</div>';
    html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #e65100;">' + domesticRate + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + payerName + ' statutory WHT rate for ' + paymentType + '</div>';
    html += '</div>';
    
    // Section 2: Treaty WHT Rate
    html += '<div class="wht-section treaty-section" style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">';
    html += '<div class="section-header" style="font-weight: bold; color: #1565c0; margin-bottom: 8px;"><span>Section 2: Treaty WHT Rate</span></div>';
    
    if (!hasTreaty || treatyRate.includes('No Treaty') || treatyRate.includes('Limited Treaty')) {
        html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">No applicable Double Tax Treaty between ' + payerName + ' and ' + payeeName + ' for ' + paymentType + '</div>';
        html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #1565c0;">N/A</div>';
        html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">Domestic rate applies</div>';
    } else {
        html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under Double Tax Treaty between ' + payerName + ' and ' + payeeName + '</div>';
        html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #1565c0;">' + treatyRate + '</div>';
        html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">DTT rate for ' + paymentType + '</div>';
    }
    html += '</div>';
    
    // Applicable Rate
    html += '<div class="wht-section applicable-section" style="margin: 15px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">';
    html += '<div class="section-header" style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;"><span>Applicable Rate</span></div>';
    html += '<div class="rate-display" style="font-size: 2em; font-weight: bold; color: #2e7d32;">' + applicableRate + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + applicableNote + '</div>';
    html += '</div>';
    
    // Important note
    html += '<div class="alert alert-warning" style="margin-top: 15px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px;">';
    html += '<strong>Important:</strong> If the domestic rate is <strong>lower</strong> than the treaty rate, the domestic rate applies. The treaty rate is a <strong>maximum</strong> rate that the source country can withhold, not a minimum. Always verify with local tax authorities.';
    html += '</div>';
    
    html += '</div>';
    
    // Live indicator
    html += '<div class="live-indicator" style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px; font-size: 0.85em;">';
    html += '<span class="live-badge">LIVE</span> Queried at: ' + queryTime;
    if (searchDuration) html += ' | Response time: ' + searchDuration + 'ms';
    html += '</div>';
    
    contentDiv.innerHTML = html;
    
    // Show sources
    if (webResults && webResults.length > 0) {
        sourceSection.style.display = 'block';
        let sourceHtml = '';
        webResults.forEach(function(result) {
            let isOfficial = result.url.includes('gov') || result.url.includes('ird') || result.url.includes('tax');
            sourceHtml += '<div class="source-item" style="padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 5px;">';
            sourceHtml += '<a href="' + result.url + '" target="_blank" style="color: #0066cc;">' + result.title + '</a>';
            sourceHtml += '<span style="margin-left: 10px; padding: 2px 6px; background: ' + (isOfficial ? '#d4edda' : '#cce5ff') + '; border-radius: 3px; font-size: 0.75em;">' + (isOfficial ? 'Official' : 'Professional') + '</span>';
            sourceHtml += '</div>';
        });
        sourceList.innerHTML = sourceHtml;
    }
    
    resultsContainer.style.display = 'block';
}

// Batch Query Withholding Tax
async function queryBatchWithholdingTax() {
    const singleCountry = document.getElementById('batch-payer-country').value;
    const paymentType = document.getElementById('batch-payment-type').value;
    
    if (!singleCountry) {
        alert('Please select a country.');
        return;
    }
    
    if (!paymentType) {
        alert('Please select a payment type.');
        return;
    }
    
    const checkboxes = document.querySelectorAll('#batch-payee-countries input[type="checkbox"]:checked');
    const multipleCountries = Array.from(checkboxes).map(cb => cb.value);
    
    if (multipleCountries.length === 0) {
        alert('Please select at least one country to compare.');
        return;
    }
    
    showLoading();
    
    try {
        const singleName = COUNTRIES.find(c => c.code === singleCountry)?.name || singleCountry;
        const results = [];
        const bidirectional = document.getElementById('bidirectional-compare').checked;
        
        for (const multiCode of multipleCountries) {
            const multiName = COUNTRIES.find(c => c.code === multiCode)?.name || multiCode;
            let primaryRate, reverseRate;
            
            if (queryDirection === 'one-payer') {
                const key = singleCountry + '_' + multiCode + '_' + paymentType;
                primaryRate = TAX_DATA.withholding[key] || 'No Treaty';
                
                if (bidirectional) {
                    const reverseKey = multiCode + '_' + singleCountry + '_' + paymentType;
                    reverseRate = TAX_DATA.withholding[reverseKey] || 'No Treaty';
                }
            } else {
                const key = multiCode + '_' + singleCountry + '_' + paymentType;
                primaryRate = TAX_DATA.withholding[key] || 'No Treaty';
                
                if (bidirectional) {
                    const reverseKey = singleCountry + '_' + multiCode + '_' + paymentType;
                    reverseRate = TAX_DATA.withholding[reverseKey] || 'No Treaty';
                }
            }
            
            results.push({
                code: multiCode,
                name: multiName,
                rate: primaryRate,
                reverseRate: reverseRate
            });
        }
        
        addToHistory({
            type: 'batch',
            title: 'Batch WHT: ' + singleName + ' (' + paymentType + ')',
            payerCode: singleCountry,
            payerName: singleName,
            payeeCodes: multipleCountries,
            paymentType: paymentType
        });
        
        displayBatchResults(singleName, singleCountry, paymentType, results, bidirectional, queryDirection);
        
    } catch (error) {
        console.error('Error in batch query:', error);
        alert('Error in batch query. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Batch Results
function displayBatchResults(singleName, singleCode, paymentType, results, bidirectional, direction) {
    const resultsContainer = document.getElementById('batch-results');
    const contentDiv = document.getElementById('batch-content');
    
    let html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Batch Withholding Tax Comparison</div>';
    
    if (direction === 'one-payer') {
        html += '<div class="country-name">Payer: ' + singleName + '</div>';
    } else {
        html += '<div class="country-name">Payee: ' + singleName + '</div>';
    }
    
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';
    
    html += '<table class="results-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
    html += '<thead><tr><th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6; text-align: left;">Country</th>';
    
    if (direction === 'one-payer') {
        html += '<th style="padding: 10px; background: #d4edda; border: 1px solid #dee2e6;">' + singleName + ' to Country</th>';
        if (bidirectional) {
            html += '<th style="padding: 10px; background: #cce5ff; border: 1px solid #dee2e6;">Country to ' + singleName + '</th>';
            html += '<th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6;">Difference</th>';
        }
    } else {
        html += '<th style="padding: 10px; background: #d4edda; border: 1px solid #dee2e6;">Country to ' + singleName + '</th>';
        if (bidirectional) {
            html += '<th style="padding: 10px; background: #cce5ff; border: 1px solid #dee2e6;">' + singleName + ' to Country</th>';
            html += '<th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6;">Difference</th>';
        }
    }
    
    html += '</tr></thead><tbody>';
    
    results.forEach(function(result) {
        html += '<tr><td style="padding: 10px; border: 1px solid #dee2e6;">' + result.name + '</td>';
        html += '<td style="padding: 10px; border: 1px solid #dee2e6; background: #d4edda; text-align: center;">' + result.rate + '</td>';
        
        if (bidirectional) {
            html += '<td style="padding: 10px; border: 1px solid #dee2e6; background: #cce5ff; text-align: center;">' + (result.reverseRate || 'N/A') + '</td>';
            
            const rate1 = parseFloat(String(result.rate).replace(/[^0-9.]/g, '')) || 0;
            const rate2 = parseFloat(String(result.reverseRate).replace(/[^0-9.]/g, '')) || 0;
            const diff = Math.abs(rate1 - rate2);
            
            html += '<td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">' + (diff > 0 ? diff + '%' : '0%') + '</td>';
        }
        
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    contentDiv.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Web Search Function
async function searchWebRates(query, type, payerCountry, payeeCountry, paymentType) {
    try {
        let url = '/.netlify/functions/search?query=' + encodeURIComponent(query) + '&type=' + encodeURIComponent(type || 'general');
        if (payerCountry) url += '&payer=' + encodeURIComponent(payerCountry);
        if (payeeCountry) url += '&payee=' + encodeURIComponent(payeeCountry);
        if (paymentType) url += '&paymentType=' + encodeURIComponent(paymentType);
        
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.results || [];
        }
    } catch (error) {
        console.warn('API search error:', error);
    }
    
    return getCuratedSources(query);
}

// Get Curated Sources
function getCuratedSources(query) {
    return [
        { title: 'OECD Tax Database', url: 'https://www.oecd.org/tax/tax-policy/', snippet: 'Official OECD tax statistics and policy analysis.', type: 'official', reliability: 'high' },
        { title: 'IBFD Tax Research Platform', url: 'https://www.ibfd.org/', snippet: 'International Bureau of Fiscal Documentation - comprehensive tax research platform.', type: 'professional', reliability: 'high' },
        { title: 'KPMG Corporate Tax Rates', url: 'https://home.kpmg/xx/en/home/services/tax/tax-tools-and-resources/tax-rates-online.html', snippet: 'KPMG interactive tax rate tables.', type: 'professional', reliability: 'high' },
        { title: 'PwC Worldwide Tax Summaries', url: 'https://taxsummaries.pwc.com/', snippet: 'PwC comprehensive guides to taxes worldwide.', type: 'professional', reliability: 'high' },
        { title: 'Deloitte International Tax', url: 'https://www.deloitte.com/global/en/services/tax.html', snippet: 'Deloitte international tax guides.', type: 'professional', reliability: 'high' }
    ];
}
"@

# Combine and write
$finalContent = $cleanContent + $correctFunctions

# Write the fixed file
$finalContent | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline

Write-Host "Fixed app.js successfully!"