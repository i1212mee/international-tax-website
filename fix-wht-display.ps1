# Fix the displayWithholdingTaxResults function to handle domesticRate as object

$file = 'd:\CodeFuse\claude-test-project\tax-website\app.js'
$content = Get-Content $file -Raw

# Find and replace the displayWithholdingTaxResults function
$oldPattern = '// Display Withholding Tax Results with Two Sections\r?\nfunction displayWithholdingTaxResults\(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration\) \{[\s\S]*?resultsContainer\.style\.display = ''block'';\r?\n\}'

$newFunction = @'
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
    
    // Handle domesticRate as object {rate, note} or string (backward compatible)
    const domesticRateValue = typeof domesticRate === 'object' ? domesticRate.rate : domesticRate;
    const domesticRateNote = typeof domesticRate === 'object' ? domesticRate.note : 'Standard WHT rate';
    
    // Calculate applicable rate
    let domesticRateNum = parseFloat(String(domesticRateValue).replace(/[^0-9.]/g, '')) || 0;
    let treatyRateNum = parseFloat(String(treatyRate).replace(/[^0-9.]/g, '')) || 0;
    
    let applicableRate = treatyRate;
    let applicableNote = '';
    
    if (domesticRateNum > 0 && (treatyRateNum === 0 || domesticRateNum < treatyRateNum)) {
        applicableRate = domesticRateValue;
        applicableNote = 'Domestic rate applies (lower than treaty rate)';
    } else if (treatyRateNum > 0 && treatyRateNum <= domesticRateNum) {
        applicableRate = treatyRate;
        applicableNote = 'Treaty rate applies';
    } else if (treatyRateNum === 0 && domesticRateNum === 0) {
        applicableRate = '0%';
        applicableNote = 'No WHT applicable';
    } else if (!hasTreaty) {
        applicableRate = domesticRateValue;
        applicableNote = 'No treaty - domestic rate applies';
    }
    
    let html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Withholding Tax Analysis</div>';
    html += '<div class="country-name">' + payerName + ' to ' + payeeName + '</div>';
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';
    
    // Section 1: Domestic WHT Rate (Non-Treaty)
    html += '<div class="wht-section domestic-section" style="margin: 15px 0; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">';
    html += '<div class="section-header" style="font-weight: bold; color: #e65100; margin-bottom: 8px;"><span>🏛️ Section 1: Domestic WHT Rate (Non-Treaty)</span></div>';
    html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under ' + payerName + ' domestic tax law, without considering any Double Tax Treaty</div>';
    html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #e65100;">' + domesticRateValue + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + domesticRateNote + '</div>';
    html += '</div>';
    
    // Section 2: Treaty WHT Rate
    html += '<div class="wht-section treaty-section" style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">';
    html += '<div class="section-header" style="font-weight: bold; color: #1565c0; margin-bottom: 8px;"><span>🤝 Section 2: Treaty WHT Rate</span></div>';
    
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
    html += '<div class="section-header" style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;"><span>✅ Applicable Rate</span></div>';
    html += '<div class="rate-display" style="font-size: 2em; font-weight: bold; color: #2e7d32;">' + applicableRate + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + applicableNote + '</div>';
    html += '</div>';
    
    // Important note
    html += '<div class="alert alert-warning" style="margin-top: 15px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px;">';
    html += '<strong>⚠️ Important:</strong> If the domestic rate is <strong>lower</strong> than the treaty rate, the domestic rate applies. The treaty rate is a <strong>maximum</strong> rate that the source country can withhold, not a minimum. Always verify with local tax authorities.';
    html += '</div>';
    
    html += '</div>';
    
    // Live indicator
    html += '<div class="live-indicator" style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px; font-size: 0.85em;">';
    html += '<span class="live-badge">● LIVE</span> Queried at: ' + queryTime;
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
'@

$content = $content -replace $oldPattern, $newFunction
Set-Content $file $content -NoNewline
Write-Host "Function updated successfully!"