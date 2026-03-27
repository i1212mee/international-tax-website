# Update displayWithholdingTaxResults function to show two sections

$filePath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$content = Get-Content $filePath -Raw

# Define the new function
$newFunction = @'
// Get domestic WHT rate for a country
function getDomesticWHTRate(countryCode, paymentType) {
    if (typeof TAX_DATA !== 'undefined' && TAX_DATA.domesticWHT && TAX_DATA.domesticWHT[countryCode]) {
        const domestic = TAX_DATA.domesticWHT[countryCode];
        const type = paymentType.toLowerCase();
        
        if (domestic[type] !== undefined) {
            return domestic[type];
        }
    }
    
    // Default domestic rates if not found
    const defaults = {
        'interest': 'Standard rate applies',
        'dividend': 'Standard rate applies', 
        'royalty': 'Standard rate applies',
        'technical': 'Standard rate applies',
        'management': 'Standard rate applies'
    };
    
    return defaults[paymentType.toLowerCase()] || 'Standard rate applies';
}

// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, treatyRate, webResults, searchDuration) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');      
    const sourceSection = document.getElementById('source-verification');       
    const sourceList = document.getElementById('source-list');
    const verificationResult = document.getElementById('cross-verification-result');

    const queryTime = new Date().toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Get domestic WHT rate
    const domesticRate = getDomesticWHTRate(payerCode, paymentType);
    
    // Parse rates for comparison
    let domesticRateNum = parseFloat(String(domesticRate).replace(/[^0-9.]/g, '')) || 0;
    let treatyRateNum = parseFloat(String(treatyRate).replace(/[^0-9.]/g, '')) || 0;
    
    // Determine applicable rate (lower of domestic or treaty)
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
    }

    // Build HTML with two sections
    let html = `<div class="tax-result-card">`;
    
    // Header
    html += `<div class="tax-type">Withholding Tax Analysis</div>`;
    html += `<div class="country-name">${payerName} → ${payeeName}</div>`;
    html += `<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</div>`;

    // Section 1: Domestic Rate (Non-Treaty)
    html += `<div class="wht-section domestic-section">`;
    html += `<div class="section-header"><span class="section-icon">🏛️</span> Section 1: Domestic WHT Rate (Non-Treaty)</div>`;
    html += `<div class="section-desc">WHT rate under ${payerName}'s domestic tax law, without considering any Double Tax Treaty</div>`;
    html += `<div class="rate-display domestic-rate">${domesticRate}</div>`;
    html += `<div class="rate-label">${payerName}'s statutory WHT rate for ${paymentType}</div>`;
    html += `</div>`;

    // Section 2: Treaty Rate
    html += `<div class="wht-section treaty-section">`;
    html += `<div class="section-header"><span class="section-icon">🤝</span> Section 2: Treaty WHT Rate</div>`;
    
    const treatyRateStr = String(treatyRate);
    if (treatyRateStr.includes('No Treaty') || treatyRateStr.includes('Limited Treaty')) {
        html += `<div class="section-desc">No applicable Double Tax Treaty between ${payerName} and ${payeeName} for ${paymentType}</div>`;
        html += `<div class="rate-display treaty-rate na">N/A</div>`;
        html += `<div class="rate-label">Domestic rate applies</div>`;
    } else {
        html += `<div class="section-desc">WHT rate under Double Tax Treaty between ${payerName} and ${payeeName}</div>`;
        html += `<div class="rate-display treaty-rate">${treatyRate}</div>`;
        html += `<div class="rate-label">DTT rate for ${paymentType}</div>`;
    }
    html += `</div>`;

    // Applicable Rate Summary
    html += `<div class="wht-section applicable-section">`;
    html += `<div class="section-header"><span class="section-icon">✅</span> Applicable Rate</div>`;
    html += `<div class="rate-display applicable-rate">${applicableRate}</div>`;
    html += `<div class="rate-label">${applicableNote}</div>`;
    html += `</div>`;

    // Important Notice
    html += `<div class="alert alert-warning" style="margin-top: 15px;">`;
    html += `<strong>⚠️ Important:</strong> If the domestic rate is <strong>lower</strong> than the treaty rate, the domestic rate applies. `;
    html += `The treaty rate is a <strong>maximum</strong> rate that the source country can withhold, not a minimum. `;
    html += `Always verify with local tax authorities for the most accurate and up-to-date information.`;
    html += `</div>`;

    // Treaty-specific notes
    if (treatyRateStr.includes('No Treaty') || treatyRateStr.includes('Limited Treaty')) {
        html += `<div class="alert alert-info" style="margin-top: 10px;">`;
        html += `<strong>ℹ️ Note:</strong> There is <strong>NO comprehensive Double Taxation Treaty</strong> between ${payerName} and ${payeeName} for this type of payment.`;
        if (payerCode === 'HK' && treatyRateStr.includes('Limited Treaty')) {
            html += ` The existing treaty only covers shipping and air transport activities.`;
        }
        html += ` The domestic rate of ${payerName} applies.`;
        html += `</div>`;
    } else if (treatyRateStr === '0%' || treatyRateStr.includes('0%')) {
        html += `<div class="alert alert-success" style="margin-top: 10px;">`;
        html += `<strong>ℹ️ Note:</strong> Treaty rate is 0% - No WHT should be withheld at source. Documentation may be required to claim this benefit.`;
        html += `</div>`;
    }

    html += `</div>`;

    // Query time indicator
    html += `<div class="live-indicator" style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px; font-size: 0.85em;">`;
    html += `<span class="live-badge">● LIVE</span> Queried at: ${queryTime}`;
    if (searchDuration) {
        html += ` | Response time: ${searchDuration}ms`;
    }
    html += `</div>`;

    contentDiv.innerHTML = html;

    // Display web results with sources
    if (webResults && webResults.length > 0) {
        sourceSection.style.display = 'block';
        let sourceHtml = '';
        webResults.forEach((result, index) => {
            const isOfficial = result.url.includes('gov') || result.url.includes('ird') || result.url.includes('tax');
            sourceHtml += `<div class="source-item ${isOfficial ? 'official' : 'professional'}">`;
            sourceHtml += `<span class="source-icon">${isOfficial ? '🏛️' : '💼'}</span> `;
            sourceHtml += `<a href="${result.url}" target="_blank" class="source-link">${result.title}</a>`;
            sourceHtml += `<span class="source-badge ${isOfficial ? 'official' : 'professional'}">${isOfficial ? 'Official' : 'Professional'}</span>`;
            sourceHtml += `</div>`;
        });
        sourceList.innerHTML = sourceHtml;
    }

    resultsContainer.style.display = 'block';
    
    // Save to history
    saveToHistory({
        type: 'wht',
        payerCountry: payerName,
        payeeCountry: payeeName,
        paymentType: paymentType,
        domesticRate: domesticRate,
        treatyRate: treatyRate,
        applicableRate: applicableRate,
        timestamp: new Date().toISOString()
    });
}
'@

# Find and replace the old function
$pattern = '(?s)// Display Withholding Tax Results\r?\nfunction displayWithholdingTaxResults\([^}]+\}\s*\}'

if ($content -match $pattern) {
    $content = $content -replace $pattern, $newFunction
    Set-Content $filePath $content -NoNewline
    Write-Host "Function replaced successfully!"
} else {
    Write-Host "Pattern not found, trying alternative approach..."
    
    # Try to find function start
    if ($content -match '// Display Withholding Tax Results') {
        $startIdx = $content.IndexOf('// Display Withholding Tax Results')
        Write-Host "Found function comment at index: $startIdx"
        
        # Find the end of the function (next function or end of file)
        $afterStart = $content.Substring($startIdx)
        
        # Find next major function or end
        if ($afterStart -match '(?s)^(.*?\n\})') {
            $oldFunction = $matches[1]
            Write-Host "Old function length: $($oldFunction.Length)"
            $content = $content.Substring(0, $startIdx) + $newFunction + $content.Substring($startIdx + $oldFunction.Length)
            Set-Content $filePath $content -NoNewline
            Write-Host "Function replaced!"
        }
    }
}

Write-Host "Update complete!"