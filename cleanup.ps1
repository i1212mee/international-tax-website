# PowerShell script to clean up duplicate function definitions in app.js

$filePath = "D:\CodeFuse\claude-test-project\tax-website\app.js"
$content = Get-Content $filePath -Raw -Encoding UTF8

Write-Host "Starting cleanup..."

# Count occurrences before cleanup
$getDomesticMatches = [regex]::Matches($content, "function getDomesticWHTRate")
$displayWHTMatches = [regex]::Matches($content, "function displayWithholdingTaxResults")

Write-Host "Before cleanup:"
Write-Host "  getDomesticWHTRate: $($getDomesticMatches.Count) occurrences"
Write-Host "  displayWithholdingTaxResults: $($displayWHTMatches.Count) occurrences"

# Remove all getDomesticWHTRate function definitions except one
# We'll keep the version that uses TAX_DATA.domesticWHT

# First, let's find and remove the broken code blocks
# Pattern 1: Multiple getDomesticWHTRate functions with different implementations

# Remove the broken async line
$content = $content -replace "// Query Withholding Tax Rate[\r\n\s]+async[\r\n\s]+// Get domestic WHT rate", "// Query Withholding Tax Rate`r`n`r`n// Get domestic WHT rate"

# Remove standalone function fragments
$content = $content -replace "[\r\n\s]+function queryWithholdingTax\(\)[\s\S]*?displayWithholdingTaxResults\([^)]+\);[\r\n\s]*\}[\r\n\s]*\}[\r\n\s]*catch[\s\S]*?\}[\r\n\s]*finally[\s\S]*?\}[\r\n\s]*\}[\r\n\s]+// Default domestic rates", "`r`n// Default domestic rates"

# Remove duplicate getDomesticWHTRate functions (keep only the one with TAX_DATA.domesticWHT)
# The correct one is the first occurrence (around line 959)

# Find all getDomesticWHTRate function blocks and keep only the first one
$getDomesticPattern = "// Get domestic WHT rate[^\{]*\{[^}]*\}[^}]*\}[^}]*\}"
$matches = [regex]::Matches($content, $getDomesticPattern)

if ($matches.Count -gt 1) {
    Write-Host "Removing duplicate getDomesticWHTRate functions..."
    # Keep only the first match
    $first = $true
    foreach ($match in $matches) {
        if (-not $first) {
            $content = $content.Remove($match.Index, $match.Length)
            $content = $content.Insert($match.Index, "")
        }
        $first = $false
    }
}

# Remove duplicate displayWithholdingTaxResults functions
$displayPattern = "// Display Withholding Tax Results[^\{]*function displayWithholdingTaxResults\([^\)]*\)[^\{]*\{"
$displayMatches = [regex]::Matches($content, $displayPattern)

if ($displayMatches.Count -gt 1) {
    Write-Host "Removing duplicate displayWithholdingTaxResults functions..."
    # This is more complex - we need to find the full function body
}

# Save the cleaned content
$content | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline

Write-Host "Cleanup complete!"

# Verify
$getDomesticMatches = [regex]::Matches($content, "function getDomesticWHTRate")
$displayWHTMatches = [regex]::Matches($content, "function displayWithholdingTaxResults")

Write-Host "After cleanup:"
Write-Host "  getDomesticWHTRate: $($getDomesticMatches.Count) occurrences"
Write-Host "  displayWithholdingTaxResults: $($displayWHTMatches.Count) occurrences"