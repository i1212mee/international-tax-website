# 修复 MY_SG_interest 税率
$file = "D:\CodeFuse\claude-test-project\tax-website\tax-data.js"
$content = Get-Content $file -Raw -Encoding UTF8
$content = $content -replace '"MY_SG_interest": "15%"', '"MY_SG_interest": "10%"'
$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "Fixed MY_SG_interest rate from 15% to 10%"