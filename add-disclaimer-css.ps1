# Add disclaimer styles to CSS
$cssPath = "d:\CodeFuse\claude-test-project\tax-website\styles.css"
$css = Get-Content $cssPath -Raw -Encoding UTF8

$disclaimerStyles = @'

/* Disclaimer Banner Styles */
.disclaimer-banner {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border: 2px solid #f39c12;
    border-radius: 8px;
    padding: 15px 20px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(243, 156, 18, 0.2);
}

.disclaimer-icon {
    font-size: 24px;
    line-height: 1;
}

.disclaimer-content {
    flex: 1;
    font-size: 14px;
    line-height: 1.6;
    color: #856404;
}

.disclaimer-content strong {
    color: #e67e22;
}

/* Data Status in Footer */
.data-status {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
    font-size: 13px;
    color: #6c757d;
}

.status-indicator {
    margin-right: 5px;
}
'@

if (-not $css.Contains(".disclaimer-banner")) {
    $newCss = $css + $disclaimerStyles
    Set-Content $cssPath $newCss -Encoding UTF8 -NoNewline
    Write-Host "Disclaimer styles added to CSS!"
} else {
    Write-Host "Styles already exist"
}