# Update index.html with disclaimer
$indexPath = "d:\CodeFuse\claude-test-project\tax-website\index.html"
$content = Get-Content $indexPath -Raw -Encoding UTF8

$oldFooter = @'
<footer>
            <p>&copy; 2026 International Tax Rate Query System. All tax rates are for reference only.</p>
            <p>Please verify with official tax authorities for the most accurate and up-to-date information.</p>
        </footer>
'@

$newFooter = @'
<!-- Disclaimer Banner -->
        <div class="disclaimer-banner">
            <div class="disclaimer-icon">⚠️</div>
            <div class="disclaimer-content">
                <strong>Important Disclaimer:</strong> This website provides tax rate information for reference purposes only. 
                While we strive to maintain accurate data, tax laws and rates change frequently. 
                <strong>Always verify with official tax authorities</strong> before making any tax-related decisions. 
                The data on this site may not reflect the most recent changes. Use at your own risk.
            </div>
        </div>

        <footer>
            <p>&copy; 2026 International Tax Rate Query System. All tax rates are for reference only.</p>
            <p>Please verify with official tax authorities for the most accurate and up-to-date information.</p>
            <p class="data-status">
                <span class="status-indicator">📊</span>
                Data Source: Local database (updated weekly) + PwC Tax Summaries links for verification
            </p>
        </footer>
'@

$newContent = $content.Replace($oldFooter, $newFooter)
Set-Content $indexPath $newContent -Encoding UTF8 -NoNewline
Write-Host "Disclaimer added successfully!"