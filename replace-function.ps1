# Update displayWithholdingTaxResults function specifically

$appJsPath = "D:\CodeFuse\claude-test-project\tax-website\app.js"

Write-Host "Reading app.js..."
$content = Get-Content $appJsPath -Raw -Encoding UTF8

# The old function signature
$oldSignature = "function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, treatyRate, webResults, searchDuration)"
$newSignature = "function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration)"

# Check if already updated
if ($content -match "domesticRate, treatyRate, hasTreaty") {
    Write-Host "Function signature already updated!" -ForegroundColor Yellow
} else {
    # Just replace the function signature first
    $content = $content.Replace($oldSignature, $newSignature)
    Write-Host "Function signature updated!" -ForegroundColor Green
}

# Now we need to update the function body
# Find where the rate is displayed and add domestic rate section

# Check for Section 1: Domestic Rate
if ($content -match "Section 1: Domestic Rate") {
    Write-Host "Section display already exists!" -ForegroundColor Yellow
} else {
    Write-Host "Updating function body..." -ForegroundColor Cyan
    
    # Find the main result card section and replace it
    $oldBody = @'
    // Main result card
    let html = `<div class="tax-result-card">`;
    html += `<div class="tax-type">Withholding Tax Rate</div>`;
    html += `<div class="country-name">${payerName} → ${payeeName}</div>`;
    html += `<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</div>`;
    html += `<div class="rate-value">${treatyRate}</div>`;
'@

    $newBody = @'
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
'@

    if ($content.Contains($oldBody)) {
        $content = $content.Replace($oldBody, $newBody)
        Write-Host "Function body updated!" -ForegroundColor Green
    } else {
        Write-Host "Could not find exact function body. Trying alternative..." -ForegroundColor Yellow
    }
}

# Save the updated content
Set-Content -Path $appJsPath -Value $content -Encoding UTF8 -NoNewline
Write-Host "`nDone!" -ForegroundColor Green