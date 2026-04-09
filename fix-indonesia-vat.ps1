$file = 'd:\CodeFuse\claude-test-project\tax-website\tax-data.js'
$content = Get-Content $file -Raw -Encoding UTF8

$pattern = 'rate: "11%", type: "standard", label: "Standard Rate", note: "Most goods and services"'
$replacement = @'
rate: "12%", type: "standard", label: "Standard Rate (Nominal)", note: "Effective 11% for most goods/services via DPP Nilai Lain"
                    }, {
                        rate: "11%", type: "effective", label: "Effective Rate", note: "Most goods and services (DPP Nilai Lain calculation)
'@

$content = $content -replace [regex]::Escape($pattern), $replacement
$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Indonesia VAT rate updated!"