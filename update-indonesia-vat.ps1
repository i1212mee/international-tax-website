# Update Indonesia VAT rate to 2025 latest
$file = "d:\CodeFuse\claude-test-project\tax-website\tax-data.js"
$content = Get-Content $file -Raw -Encoding UTF8

$oldText = @'
"ID": {
            name: "Indonesia",
            vat: {
                tiers: [
                    { rate: "11%", type: "standard", label: "Standard Rate", note: "Most goods and services" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "PPN - Value Added Tax"
            },
'@

$newText = @'
"ID": {
            name: "Indonesia",
            vat: {
                tiers: [
                    { rate: "12%", type: "standard", label: "Standard Rate (Nominal)", note: "Effective 11% for most goods/services via DPP Nilai Lain" },
                    { rate: "11%", type: "effective", label: "Effective Rate", note: "Most goods and services (DPP Nilai Lain calculation)" },
                    { rate: "12%", type: "luxury", label: "Luxury Goods", note: "Actual 12% applies" },
                    { rate: "0%", type: "zero", label: "Zero Rate", note: "Exports" }
                ],
                note: "PPN - Value Added Tax (Jan 2025: Nominal 12%, Effective 11% for most)"
            },
'@

$content = $content.Replace($oldText, $newText)
$content | Set-Content $file -Encoding UTF8
Write-Host "Indonesia VAT rate updated to 2025 latest!"