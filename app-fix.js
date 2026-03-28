// Get Curated Sources
function getCuratedSources(query) {
    return [
        { title: 'OECD Tax Database', url: 'https://www.oecd.org/tax/tax-policy/', snippet: 'Official OECD tax statistics and policy analysis.', type: 'official', reliability: 'high' },
        { title: 'IBFD Tax Research Platform', url: 'https://www.ibfd.org/', snippet: 'International Bureau of Fiscal Documentation - comprehensive tax research platform.', type: 'professional', reliability: 'high' },
        { title: 'KPMG Corporate Tax Rates', url: 'https://home.kpmg/xx/en/home/services/tax/tax-tools-and-resources/tax-rates-online.html', snippet: 'KPMG interactive tax rate tables.', type: 'professional', reliability: 'high' },
        { title: 'PwC Worldwide Tax Summaries', url: 'https://taxsummaries.pwc.com/', snippet: 'PwC comprehensive guides to taxes worldwide.', type: 'professional', reliability: 'high' },
        { title: 'Deloitte International Tax', url: 'https://www.deloitte.com/global/en/services/tax.html', snippet: 'Deloitte international tax guides.', type: 'professional', reliability: 'high' }
    ];
}

// Utility Functions
function showLoading() {
    const resultsContainer = document.getElementById('national-tax-results') || document.getElementById('withholding-tax-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
    }
}

function hideLoading() {
    // Hide loading indicator if any
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        queryNationalTax,
        queryWithholdingTax,
        queryBatchWithholdingTax,
        getDomesticWHTRate
    };
}