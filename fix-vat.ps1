$file = "d:\CodeFuse\claude-test-project\tax-website\tax-data.js"
$content = Get-Content $file -Raw

# Fix Indonesia VAT rate from 11% to 12%
$content = $content -replace 'rate: "11%", type: "standard", label: "Standard Rate", note: "Most goods and services"', 'rate: "12%", type: "standard", label: "Standard Rate (Nominal)", note: "Effective 11% for most goods via DPP Nilai Lain (2025)"'

$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Indonesia VAT rate updated successfully!"