# Final update script for WHT sections

$ErrorActionPreference = "Stop"

$appJsPath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$stylesPath = "D:\CodeFuse\claude-test-project\tax-website\styles.css"

Write-Host "=== Updating WHT Display ===" -ForegroundColor Green

# Read current app.js
Write-Host "Reading app.js..."
$content = Get-Content $appJsPath -Raw -Encoding UTF8

# Check if already updated
if ($content -match "Section 1: Domestic Rate") {
    Write-Host "Already updated! Skipping..." -ForegroundColor Yellow
} else {
    Write-Host "Updating displayWithholdingTaxResults function..." -ForegroundColor Cyan
    
    # Find and replace the displayWithholdingTaxResults function
    $pattern = '(?s)// Display Withholding Tax Results\r?\nfunction displayWithholdingTaxResults\(payerName.*?^\}'
    
    $newFunction = @'
// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration) {
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

    // Main result card header
    let html = `<div class="tax-result-card">`;
    html += `<div class="tax-type">Withholding Tax Analysis</div>`;
    html += `<div class="country-name">${payerName} → ${payeeName}</div>`;
    html += `<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</div>`;

    // Section 1: Domestic Rate (Non-Treaty)
    html += `<div class="wht-section domestic-section">`;
    html += `<div class="section-header"><span class="section-icon">📋</span> Section 1: Domestic Rate (Non-Treaty)</div>`;
    html += `<div class="section-description">The rate that would apply if there is NO Double Taxation Treaty between the two countries.</div>`;

    const domesticRateStr = typeof domesticRate === 'object' ? domesticRate.rate : domesticRate;
    const domesticNote = typeof domesticRate === 'object' ? domesticRate.note : null;

    html += `<div class="rate-box domestic-rate">`;
    html += `<div class="rate-label">${payerName} Domestic WHT Rate</div>`;
    html += `<div class="rate-value">${domesticRateStr}</div>`;
    if (domesticNote) {
        html += `<div class="rate-note">${domesticNote}</div>`;
    }
    html += `</div>`;
    html += `</div>`;

    // Section 2: Treaty Rate
    html += `<div class="wht-section treaty-section">`;
    html += `<div class="section-header"><span class="section-icon">🤝</span> Section 2: Treaty Rate</div>`;
    html += `<div class="section-description">The rate under the Double Taxation Treaty between ${payerName} and ${payeeName}.</div>`;

    html += `<div class="rate-box treaty-rate">`;
    if (hasTreaty && treatyRate) {
        html += `<div class="rate-label">Treaty WHT Rate (${payerName} - ${payeeName} DTT)</div>`;
        html += `<div class="rate-value">${treatyRate}</div>`;
    } else {
        html += `<div class="rate-label">No Applicable Treaty</div>`;
        html += `<div class="rate-value" style="color: #dc3545;">N/A</div>`;
        html += `<div class="rate-note">No comprehensive Double Taxation Treaty exists between ${payerName} and ${payeeName} for this payment type.</div>`;
    }
    html += `</div>`;
    html += `</div>`;

    // Final Rate Determination
    html += `<div class="wht-section final-section">`;
    html += `<div class="section-header"><span class="section-icon">✅</span> Applicable Rate</div>`;

    // Determine the applicable rate
    let applicableRate = domesticRateStr;
    let rateReason = '';

    if (hasTreaty && treatyRate) {
        const domesticNum = parseFloat(domesticRateStr.replace('%', '')) || 0;
        const treatyNum = parseFloat(String(treatyRate).replace('%', '')) || 0;

        if (domesticNum <= treatyNum) {
            applicableRate = domesticRateStr;
            rateReason = `The domestic rate (${domesticRateStr}) is lower than or equal to the treaty rate (${treatyRate}). <strong>The domestic rate applies.</strong>`;
        } else {
            applicableRate = treatyRate;
            rateReason = `The treaty rate (${treatyRate}) is lower than the domestic rate (${domesticRateStr}). <strong>The treaty rate applies.</strong>`;
        }
    } else {
        rateReason = `No treaty exists between ${payerName} and ${payeeName} for this payment type. <strong>The domestic rate applies.</strong>`;
    }

    html += `<div class="rate-box applicable-rate">`;
    html += `<div class="rate-label">Final Applicable WHT Rate</div>`;
    html += `<div class="rate-value" style="color: #28a745; font-size: 2em;">${applicableRate}</div>`;
    html += `<div class="rate-note">${rateReason}</div>`;
    html += `</div>`;
    html += `</div>`;

    // Important Notice
    html += `<div class="alert alert-warning" style="margin-top: 20px;">`;
    html += `<strong>Important:</strong> If the domestic WHT rate is lower than the treaty rate, the domestic rate applies. Always verify with tax authorities and obtain proper documentation (e.g., Certificate of Residence) if claiming treaty benefits.`;
    html += `</div>`;

    html += `</div>`;

    contentDiv.innerHTML = html;

    // Display sources
    if (webResults && webResults.length > 0) {
        let indicatorHtml = `
            <div class="realtime-indicator">
                <span class="live-badge">● LIVE</span>
                <span class="query-time">Queried at: ${queryTime}</span>
                <span class="search-duration">Response time: ${searchDuration}ms</span>
            </div>
        `;

        let sourceHtml = indicatorHtml + `<p class="source-description">The following authoritative sources were queried:</p>`;
        const sources = webResults.slice(0, 5);

        sources.forEach((source, index) => {
            const reliabilityBadge = source.reliability === 'high' ?
                '<span class="reliability-badge high">Official/Professional</span>' :
                '<span class="reliability-badge medium">Reference</span>';
            const typeIcon = source.type === 'official' ? '🏛️' :
                            source.type === 'professional' ? '💼' : '📖';

            sourceHtml += `<div class="source-item verified">`;
            sourceHtml += `<div class="source-header">`;
            sourceHtml += `<span class="source-number">Source ${index + 1}</span>`;
            sourceHtml += `${reliabilityBadge}`;
            sourceHtml += `</div>`;
            sourceHtml += `<a href="${source.url}" target="_blank" rel="noopener">${typeIcon} ${source.title}</a>`;
            sourceHtml += `<p class="source-snippet">${source.snippet}</p>`;
            sourceHtml += `</div>`;
        });

        sourceList.innerHTML = sourceHtml;
        sourceSection.style.display = 'block';
    } else {
        sourceSection.style.display = 'none';
    }

    resultsContainer.style.display = 'block';
}
'@

    if ($content -match $pattern) {
        $content = $content -replace $pattern, $newFunction
        Set-Content -Path $appJsPath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "displayWithholdingTaxResults updated!" -ForegroundColor Green
    } else {
        Write-Host "Could not find function to replace. Manual update may be needed." -ForegroundColor Red
    }
}

# Add CSS styles
Write-Host "Adding CSS styles..." -ForegroundColor Cyan

$cssStyles = @"

/* WHT Section Styles */
.wht-section {
    margin: 20px 0;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #dee2e6;
}

.domestic-section {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border-color: #ffb74d;
}

.treaty-section {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-color: #64b5f6;
}

.final-section {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-color: #66bb6a;
    border-width: 2px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1em;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.section-icon {
    font-size: 1.3em;
}

.section-description {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 15px;
}

.rate-box {
    padding: 15px 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.rate-label {
    font-size: 0.85em;
    color: #666;
    margin-bottom: 5px;
}

.rate-value {
    font-size: 1.8em;
    font-weight: bold;
    color: #333;
}

.rate-note {
    font-size: 0.85em;
    color: #6c757d;
    margin-top: 8px;
    font-style: italic;
}

.applicable-rate {
    border: 2px solid #28a745;
    background: #f0fff0;
}
"@

# Check if styles already exist
$stylesContent = Get-Content $stylesPath -Raw -Encoding UTF8
if ($stylesContent -match "wht-section") {
    Write-Host "CSS styles already exist. Skipping..." -ForegroundColor Yellow
} else {
    Add-Content -Path $stylesPath -Value $cssStyles -Encoding UTF8
    Write-Host "CSS styles added!" -ForegroundColor Green
}

Write-Host "`n=== Update Complete ===" -ForegroundColor Green