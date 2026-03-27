# Complete fix for app.js - Remove ALL duplicates and rebuild cleanly

$filePath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$content = Get-Content $filePath -Raw

Write-Host "Starting comprehensive fix..."

# Step 1: Remove ALL getDomesticWHTRate functions
$pattern1 = '(?s)[\r\n\s]*// Get domestic WHT rate for a country[\r\n\s]*function getDomesticWHTRate\([^}]+\}[\r\n\s]*\}'
$content = $content -replace $pattern1, ''
Write-Host "Removed all getDomesticWHTRate functions"

# Step 2: Remove ALL displayWithholdingTaxResults functions
$pattern2 = '(?s)[\r\n\s]*// Display Withholding Tax Results[^\r\n]*[\r\n\s]*function displayWithholdingTaxResults\([^}]+\}[\r\n\s]*\}[\r\n\s]*\}'
$content = $content -replace $pattern2, ''
Write-Host "Removed all displayWithholdingTaxResults functions"

# Also try alternative patterns
$pattern2b = '(?s)function displayWithholdingTaxResults\([^}]+\}[\r\n\s]*\}[\r\n\s]*\}'
$content = $content -replace $pattern2b, ''

# Step 3: Add the correct functions (only once each)
$getDomesticFunction = @'

// Get domestic WHT rate for a country
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

'@

# Insert getDomesticWHTRate before queryWithholdingTax function
$insertPoint = 'function queryWithholdingTax'
if ($content -match $insertPoint) {
    $content = $content -replace [regex]::Escape($insertPoint), "$getDomesticFunction$insertPoint"
    Write-Host "Added getDomesticWHTRate function"
}

$displayFunction = @'

// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, treatyRate, webResults, searchDuration) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');
    const sourceSection = document.getElementById('source-verification');
    const sourceList = document.getElementById('source-list');

    const queryTime = new Date().toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const domesticRate = getDomesticWHTRate(payerCode, paymentType);
    var domesticRateNum = parseFloat(String(domesticRate).replace(/[^0-9.]/g, '')) || 0;
    var treatyRateNum = parseFloat(String(treatyRate).replace(/[^0-9.]/g, '')) || 0;
    
    var applicableRate = treatyRate;
    var applicableNote = 'Treaty rate applies';
    
    if (domesticRateNum > 0 && (treatyRateNum === 0 || domesticRateNum < treatyRateNum)) {
        applicableRate = domesticRate;
        applicableNote = 'Domestic rate applies (lower than treaty rate)';
    } else if (treatyRateNum === 0 && domesticRateNum === 0) {
        applicableRate = '0%';
        applicableNote = 'No WHT applicable';
    }

    var html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Withholding Tax Analysis</div>';
    html += '<div class="country-name">' + payerName + ' to ' + payeeName + '</div>';
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';

    // Section 1: Domestic Rate
    html += '<div style="margin: 15px 0; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">';
    html += '<div style="font-weight: bold; color: #e65100; margin-bottom: 8px;">Section 1: Domestic WHT Rate (Non-Treaty)</div>';
    html += '<div style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under ' + payerName + ' domestic tax law</div>';
    html += '<div style="font-size: 1.8em; font-weight: bold; color: #e65100;">' + domesticRate + '</div></div>';

    // Section 2: Treaty Rate
    html += '<div style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">';
    html += '<div style="font-weight: bold; color: #1565c0; margin-bottom: 8px;">Section 2: Treaty WHT Rate</div>';
    var treatyRateStr = String(treatyRate);
    if (treatyRateStr.includes('No Treaty') || treatyRateStr.includes('Limited Treaty')) {
        html += '<div style="font-size: 1.8em; font-weight: bold; color: #1565c0;">N/A</div>';
        html += '<div style="font-size: 0.85em; color: #666;">No applicable treaty - domestic rate applies</div>';
    } else {
        html += '<div style="font-size: 1.8em; font-weight: bold; color: #1565c0;">' + treatyRate + '</div>';
    }
    html += '</div>';

    // Applicable Rate
    html += '<div style="margin: 15px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">';
    html += '<div style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;">Applicable Rate</div>';
    html += '<div style="font-size: 2em; font-weight: bold; color: #2e7d32;">' + applicableRate + '</div>';
    html += '<div style="font-size: 0.85em; color: #666;">' + applicableNote + '</div></div>';

    html += '<div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">';
    html += '<strong>Important:</strong> If domestic rate is lower than treaty rate, domestic rate applies. Treaty rate is a maximum, not minimum.</div>';
    html += '</div>';

    contentDiv.innerHTML = html;

    if (webResults && webResults.length > 0) {
        sourceSection.style.display = 'block';
        var sourceHtml = '';
        webResults.forEach(function(result) {
            sourceHtml += '<div style="padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 5px;">';
            sourceHtml += '<a href="' + result.url + '" target="_blank" style="color: #0066cc;">' + result.title + '</a></div>';
        });
        sourceList.innerHTML = sourceHtml;
    }

    resultsContainer.style.display = 'block';
    saveToHistory({ type: 'wht', payerCountry: payerName, payeeCountry: payeeName, paymentType: paymentType, domesticRate: domesticRate, treatyRate: treatyRate, applicableRate: applicableRate, timestamp: new Date().toISOString() });
}

'@

# Insert displayWithholdingTaxResults before queryWithholdingTax function
$insertPoint2 = 'function queryWithholdingTax'
if ($content -match $insertPoint2) {
    $content = $content -replace [regex]::Escape($insertPoint2), "$displayFunction$insertPoint2"
    Write-Host "Added displayWithholdingTaxResults function"
}

# Save the fixed content
Set-Content $filePath $content -NoNewline -Encoding UTF8

# Verify
$verifyContent = Get-Content $filePath -Raw
$getDomesticMatches = [regex]::Matches($verifyContent, 'function getDomesticWHTRate')
$displayMatches = [regex]::Matches($verifyContent, 'function displayWithholdingTaxResults')

Write-Host "Final count - getDomesticWHTRate: $($getDomesticMatches.Count)"
Write-Host "Final count - displayWithholdingTaxResults: $($displayMatches.Count)"
Write-Host "Fix complete!"