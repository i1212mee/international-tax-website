# PowerShell script to merge updates into app.js

$appJsPath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$updateJsPath = "D:\CodeFuse\claude-test-project\tax-website\update-app.js"

Write-Host "Reading files..."

# Read files
$content = Get-Content $appJsPath -Raw -Encoding UTF8
$newFunctions = Get-Content $updateJsPath -Raw -Encoding UTF8

Write-Host "Original file length: $($content.Length)"

# 1. Check if getDomesticWHTRate already exists
if ($content -notmatch "function getDomesticWHTRate") {
    Write-Host "Adding getDomesticWHTRate function..."
    
    # Extract getDomesticWHTRate function
    if ($newFunctions -match "(?s)// Get domestic WHT rate.*?^}") {
        $getDomesticFunc = $matches[0]
        
        # Insert before queryWithholdingTax
        $content = $content -replace "(// Query Withholding Tax Rate)", "$getDomesticFunc`r`n`r`n`$1"
    }
}

# 2. Update queryWithholdingTax to get domestic rate
Write-Host "Updating queryWithholdingTax function..."

$oldQueryCode = @"
// Get treaty rate from local database
        const treatyKey = `\`\$\{payerCountry\}_\$\{payeeCountry\}_\$\{paymentType\}\``;
        const treatyRate = TAX_DATA.withholding[treatyKey] || getDefaultWHTRate(paymentType);
"@

$newQueryCode = @"
// Get domestic rate (non-treaty rate) from payer country
        const domesticRate = getDomesticWHTRate(payerCountry, paymentType);

        // Get treaty rate from local database
        const treatyKey = `\`\$\{payerCountry\}_\$\{payeeCountry\}_\$\{paymentType\}\``;
        const treatyRate = TAX_DATA.withholding[treatyKey] || null;
        const hasTreaty = !!TAX_DATA.withholding[treatyKey];
"@

$content = $content.Replace($oldQueryCode, $newQueryCode)

# 3. Update displayWithholdingTaxResults call
Write-Host "Updating displayWithholdingTaxResults call..."

$oldCall = @"
// Display results with cross-verification
        displayWithholdingTaxResults(
            payerName, payerCountry,
            payeeName, payeeCountry,
            paymentType, treatyRate,
            webResults, searchDuration
        );
"@

$newCall = @"
// Display results with cross-verification
        displayWithholdingTaxResults(
            payerName, payerCountry,
            payeeName, payeeCountry,
            paymentType, domesticRate, treatyRate, hasTreaty,
            webResults, searchDuration
        );
"@

$content = $content.Replace($oldCall, $newCall)

# 4. Replace displayWithholdingTaxResults function
Write-Host "Replacing displayWithholdingTaxResults function..."

# Find old function
if ($content -match "(?s)// Display Withholding Tax Results.*?^function displayWithholdingTaxResults.*?^}") {
    $oldFunc = $matches[0]
    
    # Find new function
    if ($newFunctions -match "(?s)// Display Withholding Tax Results with Two Sections.*?^}$") {
        $newFunc = $matches[0]
        
        $content = $content.Replace($oldFunc, $newFunc)
    }
}

# Write updated content
Write-Host "Writing updated file..."
$content | Set-Content $appJsPath -Encoding UTF8 -NoNewline

Write-Host "Done! Updated file length: $($content.Length)"