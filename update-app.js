// Get domestic WHT rate (non-treaty rate) for a country
function getDomesticWHTRate(countryCode, paymentType) {
    if (TAX_DATA.domesticWHT && TAX_DATA.domesticWHT[countryCode]) {
        const countryRates = TAX_DATA.domesticWHT[countryCode];
        if (countryRates[paymentType] !== undefined) {
            return {
                rate: countryRates[paymentType],
                hasDomesticRate: true,
                note: countryRates.note || null
            };
        }
    }
    // Return default if no domestic rate found
    return {
        rate: getDefaultWHTRate(paymentType),
        hasDomesticRate: false,
        note: 'Domestic rate not available in database'
    };
}

// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration) {
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

    // Main result card header
    let html = `<div class="tax-result-card">`;
    html += `<div class="tax-type">Withholding Tax Analysis</div>`;
    html += `<div class="country-name">${payerName} → ${payeeName}</div>`;
    html += `<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</div>`;
    
    // Section 1: Domestic Rate (Non-Treaty)
    html += `<div class="wht-section domestic-section">`;
    html += `<div class="section-header"><span class="section-icon">📋</span> Section 1: Domestic Rate (Non-Treaty)</div>`;
    html += `<div class="section-description">The rate that would apply if there is NO Double Taxation Treaty between the two countries.</div>`;
    
    const domesticRateStr = typeof domesticRate === 'object' ? domesticRate.rate : domesticRate;
    const domesticNote = typeof domesticRate === 'object' ? domesticRate.note : null;
    
    html += `<div class="rate-box domestic-rate">`;
    html += `<div class="rate-label">${payerName} Domestic WHT Rate</div>`;
    html += `<div class="rate-value">${domesticRateStr}</div>`;
    if (domesticNote) {
        html += `<div class="rate-note">${domesticNote}</div>`;
    }
    html += `</div>`;
    html += `</div>`; // End domestic-section
    
    // Section 2: Treaty Rate
    html += `<div class="wht-section treaty-section">`;
    html += `<div class="section-header"><span class="section-icon">🤝</span> Section 2: Treaty Rate</div>`;
    html += `<div class="section-description">The rate under the Double Taxation Treaty between ${payerName} and ${payeeName}.</div>`;
    
    html += `<div class="rate-box treaty-rate">`;
    if (hasTreaty && treatyRate) {
        html += `<div class="rate-label">Treaty WHT Rate (${payerName} - ${payeeName} DTT)</div>`;
        html += `<div class="rate-value">${treatyRate}</div>`;
    } else {
        html += `<div class="rate-label">No Applicable Treaty</div>`;
        html += `<div class="rate-value" style="color: #dc3545;">N/A</div>`;
        html += `<div class="rate-note">No comprehensive Double Taxation Treaty exists between ${payerName} and ${payeeName} for this payment type.</div>`;
    }
    html += `</div>`;
    html += `</div>`; // End treaty-section
    
    // Final Rate Determination
    html += `<div class="wht-section final-section">`;
    html += `<div class="section-header"><span class="section-icon">✅</span> Applicable Rate</div>`;
    
    // Determine the applicable rate
    let applicableRate = domesticRateStr;
    let rateReason = '';
    
    if (hasTreaty && treatyRate) {
        const domesticNum = parseFloat(domesticRateStr.replace('%', '')) || 0;
        const treatyNum = parseFloat(String(treatyRate).replace('%', '')) || 0;
        
        if (domesticNum <= treatyNum) {
            applicableRate = domesticRateStr;
            rateReason = `The domestic rate (${domesticRateStr}) is lower than or equal to the treaty rate (${treatyRate}). <strong>The domestic rate applies.</strong>`;
        } else {
            applicableRate = treatyRate;
            rateReason = `The treaty rate (${treatyRate}) is lower than the domestic rate (${domesticRateStr}). <strong>The treaty rate applies.</strong>`;
        }
    } else {
        rateReason = `No treaty exists between ${payerName} and ${payeeName} for this payment type. <strong>The domestic rate applies.</strong>`;
    }
    
    html += `<div class="rate-box applicable-rate">`;
    html += `<div class="rate-label">Final Applicable WHT Rate</div>`;
    html += `<div class="rate-value" style="color: #28a745; font-size: 2em;">${applicableRate}</div>`;
    html += `<div class="rate-note">${rateReason}</div>`;
    html += `</div>`;
    html += `</div>`; // End final-section
    
    // Important Notice
    html += `<div class="alert alert-warning" style="margin-top: 20px;">`;
    html += `<strong>⚠️ Important:</strong> If the domestic WHT rate is lower than the treaty rate, the domestic rate applies. Always verify with tax authorities and obtain proper documentation (e.g., Certificate of Residence) if claiming treaty benefits.`;
    html += `</div>`;
    
    html += `</div>`; // End tax-result-card

    contentDiv.innerHTML = html;

    // Display sources with real-time indicators
    if (webResults && webResults.length > 0) {
        // Real-time indicator
        let indicatorHtml = `
            <div class="realtime-indicator">
                <span class="live-badge">● LIVE</span>
                <span class="query-time">Queried at: ${queryTime}</span>
                <span class="search-duration">Response time: ${searchDuration}ms</span>
            </div>
        `;
        
        // Source items with better formatting
        let sourceHtml = indicatorHtml + `<p class="source-description">The following authoritative sources were queried in real-time:</p>`;

        const sources = webResults.slice(0, 5);

        sources.forEach((source, index) => {
            const reliabilityBadge = source.reliability === 'high' ? 
                '<span class="reliability-badge high">Official/Professional</span>' : 
                '<span class="reliability-badge medium">Reference</span>';
            const typeIcon = source.type === 'official' ? '🏛️' : 
                            source.type === 'professional' ? '💼' : '📖';
            
            sourceHtml += `<div class="source-item verified">`;
            sourceHtml += `<div class="source-header">`;
            sourceHtml += `<span class="source-number">Source ${index + 1}</span>`;
            sourceHtml += `${reliabilityBadge}`;
            sourceHtml += `</div>`;
            sourceHtml += `<a href="${source.url}" target="_blank" rel="noopener">${typeIcon} ${source.title}</a>`;
            sourceHtml += `<p class="source-snippet">${source.snippet}</p>`;
            sourceHtml += `</div>`;
        });

        sourceList.innerHTML = sourceHtml;

        // Cross-verification result
        const verificationHtml = `
            <div class="verification-warning">
                <strong>Cross-Verification Recommended:</strong>
                <p style="margin-top: 10px;">
                    Please verify the tax rate from at least <strong>3 different sources</strong> above.
                    Tax treaties and rates may change. Click the source links to access the original authoritative data.
                </p>
            </div>
        `;

        verificationResult.innerHTML = verificationHtml;
        sourceSection.style.display = 'block';
    } else {
        sourceSection.style.display = 'none';
    }

    resultsContainer.style.display = 'block';
}