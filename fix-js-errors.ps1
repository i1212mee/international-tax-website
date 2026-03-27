# Fix app.js - Remove duplicate getDomesticWHTRate functions and fix displayWithholdingTaxResults

$filePath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$content = Get-Content $filePath -Raw

# First, let's find and remove all duplicate getDomesticWHTRate functions
# We'll keep only one at the right place

# Pattern to match getDomesticWHTRate function
$pattern = '(?s)// Get domestic WHT rate for a country\r?\nfunction getDomesticWHTRate\([^}]+\}[\r\n\s]*\}'

# Count matches
$matches = [regex]::Matches($content, $pattern)
Write-Host "Found $($matches.Count) getDomesticWHTRate function definitions"

# Remove all but the first occurrence
if ($matches.Count -gt 1) {
    # Remove all occurrences first
    $content = $content -replace $pattern, ''
    Write-Host "Removed all getDomesticWHTRate functions"
}

# Now add one clean getDomesticWHTRate function before displayWithholdingTaxResults
$getDomesticFunction = @'
// Get domestic WHT rate for a country
function getDomesticWHTRate(countryCode, paymentType) {
    // Domestic WHT rates by country (statutory rates without treaty benefits)
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

# Find where to insert the function (before displayWithholdingTaxResults)
$insertPattern = '(?s)(// Display Withholding Tax Results)'
if ($content -match $insertPattern) {
    $content = $content -replace $insertPattern, "$getDomesticFunction`$1"
    Write-Host "Added getDomesticWHTRate function before displayWithholdingTaxResults"
}

# Now fix displayWithholdingTaxResults function to show two sections
# First remove any existing displayWithholdingTaxResults function
$displayPattern = '(?s)// Display Withholding Tax Results[\r\n\s]*function displayWithholdingTaxResults\([^}]+\}[\r\n\s]*\}[\r\n\s]*\}'
$content = $content -replace $displayPattern, ''

# Add the corrected displayWithholdingTaxResults function
$displayFunction = @'
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
    
    // Determine applicable rate
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
    let html = '<div class="tax-result-card">';
    
    // Header
    html += '<div class="tax-type">Withholding Tax Analysis</div>';
    html += '<div class="country-name">' + payerName + ' to ' + payeeName + '</div>';
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';

    // Section 1: Domestic Rate
    html += '<div class="wht-section domestic-section" style="margin: 15px 0; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">';
    html += '<div class="section-header" style="font-weight: bold; color: #e65100; margin-bottom: 8px;"><span>Section 1: Domestic WHT Rate (Non-Treaty)</span></div>';
    html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under ' + payerName + ' domestic tax law, without considering any Double Tax Treaty</div>';
    html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #e65100;">' + domesticRate + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + payerName + ' statutory WHT rate for ' + paymentType + '</div>';
    html += '</div>';

    // Section 2: Treaty Rate
    html += '<div class="wht-section treaty-section" style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">';
    html += '<div class="section-header" style="font-weight: bold; color: #1565c0; margin-bottom: 8px;"><span>Section 2: Treaty WHT Rate</span></div>';
    
    var treatyRateStr = String(treatyRate);
    if (treatyRateStr.includes('No Treaty') || treatyRateStr.includes('Limited Treaty')) {
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

    // Important Notice
    html += '<div class="alert alert-warning" style="margin-top: 15px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px;">';
    html += '<strong>Important:</strong> If the domestic rate is <strong>lower</strong> than the treaty rate, the domestic rate applies. ';
    html += 'The treaty rate is a <strong>maximum</strong> rate that the source country can withhold, not a minimum.';
    html += '</div>';

    html += '</div>';

    // Query time
    html += '<div class="live-indicator" style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px; font-size: 0.85em;">';
    html += '<span class="live-badge">LIVE</span> Queried at: ' + queryTime;
    if (searchDuration) {
        html += ' | Response time: ' + searchDuration + 'ms';
    }
    html += '</div>';

    contentDiv.innerHTML = html;

    // Display sources
    if (webResults && webResults.length > 0) {
        sourceSection.style.display = 'block';
        var sourceHtml = '';
        webResults.forEach(function(result) {
            var isOfficial = result.url.includes('gov') || result.url.includes('ird') || result.url.includes('tax');
            sourceHtml += '<div class="source-item" style="padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 5px;">';
            sourceHtml += '<a href="' + result.url + '" target="_blank" style="color: #0066cc;">' + result.title + '</a>';
            sourceHtml += '<span style="margin-left: 10px; padding: 2px 6px; background: ' + (isOfficial ? '#d4edda' : '#cce5ff') + '; border-radius: 3px; font-size: 0.75em;">' + (isOfficial ? 'Official' : 'Professional') + '</span>';
            sourceHtml += '</div>';
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

# Add the display function at the end, before the last functions
$lastFunctionsPattern = '(?s)(// Extract country names from query)'
if ($content -match $lastFunctionsPattern) {
    $content = $content -replace $lastFunctionsPattern, "$displayFunction`$1"
    Write-Host "Added displayWithholdingTaxResults function"
}

# Save the fixed content
Set-Content $filePath $content -NoNewline -Encoding UTF8

Write-Host "app.js has been fixed!"

# Now verify the file doesn't have duplicate functions
$verifyContent = Get-Content $filePath -Raw
$getDomesticMatches = [regex]::Matches($verifyContent, 'function getDomesticWHTRate')
$displayMatches = [regex]::Matches($verifyContent, 'function displayWithholdingTaxResults')

Write-Host "Final count - getDomesticWHTRate: $($getDomesticMatches.Count)"
Write-Host "Final count - displayWithholdingTaxResults: $($displayMatches.Count)"