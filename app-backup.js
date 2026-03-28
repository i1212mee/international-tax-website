// Main Application Logic

// Storage keys
const STORAGE_KEYS = {
    HISTORY: 'taxQueryHistory',
    BOOKMARKS: 'taxQueryBookmarks'
};

// Query direction state
let queryDirection = 'one-payer'; // 'one-payer' or 'one-payee'

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCountryDropdowns();
    initializeBatchCountryCheckboxes();
    initializeTabs();
    initializeEventListeners();
    initializeHistoryAndBookmarks();
    initializeDirectionToggle();
});

// Initialize country dropdowns with autocomplete
function initializeCountryDropdowns() {
    // Setup autocomplete for each country input
    setupAutocomplete('country-input', 'country-dropdown', 'country-select');
    setupAutocomplete('payer-input', 'payer-dropdown', 'payer-country');
    setupAutocomplete('payee-input', 'payee-dropdown', 'payee-country');
    setupAutocomplete('batch-payer-input', 'batch-payer-dropdown', 'batch-payer-country');
    
    // Setup batch country filter
    setupBatchFilter();
}

// Setup autocomplete for a single input
function setupAutocomplete(inputId, dropdownId, hiddenId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const hidden = document.getElementById(hiddenId);
    
    if (!input || !dropdown || !hidden) return;
    
    let highlightedIndex = -1;
    let filteredCountries = [];
    
    // Show dropdown on focus
    input.addEventListener('focus', function() {
        const value = this.value.trim().toLowerCase();
        filteredCountries = value ? 
            COUNTRIES.filter(c => 
                c.name.toLowerCase().includes(value) || 
                c.code.toLowerCase().includes(value)
            ) : COUNTRIES;
        showDropdown(filteredCountries);
    });
    
    // Filter on input
    input.addEventListener('input', function() {
        const value = this.value.trim().toLowerCase();
        hidden.value = ''; // Reset hidden value when input changes
        
        if (!value) {
            filteredCountries = COUNTRIES;
        } else {
            filteredCountries = COUNTRIES.filter(c => 
                c.name.toLowerCase().includes(value) || 
                c.code.toLowerCase().includes(value)
            );
        }
        
        showDropdown(filteredCountries);
        highlightedIndex = -1;
    });
    
    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                selectCountry(items[highlightedIndex]);
            } else if (filteredCountries.length > 0) {
                selectCountryByIndex(0);
            }
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    // Show dropdown function
    function showDropdown(countries) {
        if (countries.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-empty">No countries found</div>';
            dropdown.style.display = 'block';
            return;
        }
        
        dropdown.innerHTML = countries.map((c, index) => `
            <div class="dropdown-item" data-code="${c.code}" data-name="${c.name}">
                <span class="country-name">${c.name}</span>
                <span class="country-code">${c.code}</span>
            </div>
        `).join('');
        
        // Add click handlers
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                selectCountry(this);
            });
        });
        
        dropdown.style.display = 'block';
    }
    
    // Update highlight
    function updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === highlightedIndex);
        });
        
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    // Select country
    function selectCountry(element) {
        const code = element.getAttribute('data-code');
        const name = element.getAttribute('data-name');
        input.value = name;
        hidden.value = code;
        dropdown.style.display = 'none';
        highlightedIndex = -1;
    }
    
    // Select country by index
    function selectCountryByIndex(index) {
        if (filteredCountries[index]) {
            input.value = filteredCountries[index].name;
            hidden.value = filteredCountries[index].code;
            dropdown.style.display = 'none';
        }
    }
}

// Setup batch country filter
function setupBatchFilter() {
    const filterInput = document.getElementById('batch-country-filter');
    const container = document.getElementById('batch-payee-countries');
    
    if (!filterInput || !container) return;
    
    filterInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const items = container.querySelectorAll('.checkbox-item');
        
        items.forEach(item => {
            const label = item.querySelector('label').textContent.toLowerCase();
            item.style.display = label.includes(value) ? '' : 'none';
        });
    });
}

// Initialize batch country checkboxes
function initializeBatchCountryCheckboxes() {
    const container = document.getElementById('batch-payee-countries');
    if (!container) return;

    COUNTRIES.forEach(country => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `batch-country-${country.code}`;
        checkbox.value = country.code;

        const label = document.createElement('label');
        label.htmlFor = `batch-country-${country.code}`;
        label.textContent = country.name;

        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

// Initialize tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // National tax query
    document.getElementById('query-national-tax').addEventListener('click', queryNationalTax);

    // Withholding tax query
    document.getElementById('query-withholding-tax').addEventListener('click', queryWithholdingTax);

    // Batch withholding tax query
    document.getElementById('query-batch-withholding-tax').addEventListener('click', queryBatchWithholdingTax);

    // History and bookmarks toggles
    document.getElementById('toggle-history').addEventListener('click', toggleHistoryPanel);
    document.getElementById('toggle-bookmarks').addEventListener('click', toggleBookmarksPanel);
    document.getElementById('clear-history').addEventListener('click', clearHistory);
    document.getElementById('clear-bookmarks').addEventListener('click', clearBookmarks);
}

// Initialize history and bookmarks
function initializeHistoryAndBookmarks() {
    updateHistoryCount();
    updateBookmarkCount();
}

// Initialize direction toggle
function initializeDirectionToggle() {
    const onePayerBtn = document.getElementById('direction-one-payer');
    const onePayeeBtn = document.getElementById('direction-one-payee');

    onePayerBtn.addEventListener('click', function() {
        setQueryDirection('one-payer');
    });

    onePayeeBtn.addEventListener('click', function() {
        setQueryDirection('one-payee');
    });
}

// Set query direction
function setQueryDirection(direction) {
    queryDirection = direction;

    const onePayerBtn = document.getElementById('direction-one-payer');
    const onePayeeBtn = document.getElementById('direction-one-payee');
    const singleCountryLabel = document.getElementById('single-country-label');
    const multipleCountriesLabel = document.getElementById('multiple-countries-label');
    const batchPayerInput = document.getElementById('batch-payer-input');

    if (direction === 'one-payer') {
        onePayerBtn.classList.add('active');
        onePayeeBtn.classList.remove('active');
        singleCountryLabel.textContent = 'Payer Country:';
        multipleCountriesLabel.textContent = 'Select Payee Countries (Multiple Selection):';
        batchPayerInput.placeholder = 'Type to search payer country...';
    } else {
        onePayerBtn.classList.remove('active');
        onePayeeBtn.classList.add('active');
        singleCountryLabel.textContent = 'Payee Country:';
        multipleCountriesLabel.textContent = 'Select Payer Countries (Multiple Selection):';
        batchPayerInput.placeholder = 'Type to search payee country...';
    }

    // Clear the single country input
    document.getElementById('batch-payer-country').value = '';
    batchPayerInput.value = '';

    // Uncheck all checkboxes
    document.querySelectorAll('#batch-payee-countries input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
}

// Toggle history panel
function toggleHistoryPanel() {
    const panel = document.getElementById('history-panel');
    const btn = document.getElementById('toggle-history');
    const bookmarksPanel = document.getElementById('bookmarks-panel');
    const bookmarksBtn = document.getElementById('toggle-bookmarks');
    
    // Close bookmarks panel if open
    if (bookmarksPanel.style.display !== 'none') {
        bookmarksPanel.style.display = 'none';
        bookmarksBtn.classList.remove('active');
    }
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.classList.add('active');
        renderHistoryList();
    } else {
        panel.style.display = 'none';
        btn.classList.remove('active');
    }
}

// Toggle bookmarks panel
function toggleBookmarksPanel() {
    const panel = document.getElementById('bookmarks-panel');
    const btn = document.getElementById('toggle-bookmarks');
    const historyPanel = document.getElementById('history-panel');
    const historyBtn = document.getElementById('toggle-history');
    
    // Close history panel if open
    if (historyPanel.style.display !== 'none') {
        historyPanel.style.display = 'none';
        historyBtn.classList.remove('active');
    }
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.classList.add('active');
        renderBookmarksList();
    } else {
        panel.style.display = 'none';
        btn.classList.remove('active');
    }
}

// Get history from localStorage
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    } catch {
        return [];
    }
}

// Save history to localStorage
function saveHistory(history) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    updateHistoryCount();
}

// Add to history
function addToHistory(query) {
    const history = getHistory();
    const historyItem = {
        id: Date.now(),
        ...query,
        timestamp: new Date().toISOString()
    };
    
    // Add to beginning, limit to 50 items
    history.unshift(historyItem);
    if (history.length > 50) history.pop();
    
    saveHistory(history);
}

// Update history count
function updateHistoryCount() {
    const history = getHistory();
    document.getElementById('history-count').textContent = history.length;
}

// Render history list
function renderHistoryList() {
    const container = document.getElementById('history-list');
    const history = getHistory();
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">üìã</div>
                <p>No query history yet</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    history.forEach(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const isBookmarked = isItemBookmarked(item);
        
        html += `
            <div class="history-item">
                <div class="item-info" onclick="replayHistoryItem(${item.id})">
                    <div class="item-title">${item.title}</div>
                    <div class="item-meta">${timeStr}</div>
                </div>
                <div class="item-actions">
                    <button class="item-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                            onclick="toggleBookmark(${item.id})" title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                        ${isBookmarked ? '‚ò? : '‚ò?}
                    </button>
                    <button class="item-btn delete-btn" onclick="deleteHistoryItem(${item.id})" title="Delete">
                        ‚ú?
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Replay history item
function replayHistoryItem(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    
    if (!item) return;
    
    // Close panel
    document.getElementById('history-panel').style.display = 'none';
    document.getElementById('toggle-history').classList.remove('active');
    
    // Replay the query based on type
    if (item.type === 'national') {
        document.getElementById('country-input').value = item.countryName;
        document.getElementById('country-select').value = item.countryCode;
        document.getElementById('transaction-type').value = item.transactionType;
        queryNationalTax();
    } else if (item.type === 'wht') {
        document.getElementById('payer-input').value = item.payerName;
        document.getElementById('payer-country').value = item.payerCode;
        document.getElementById('payee-input').value = item.payeeName;
        document.getElementById('payee-country').value = item.payeeCode;
        document.getElementById('payment-type').value = item.paymentType;
        queryWithholdingTax();
    } else if (item.type === 'batch') {
        document.getElementById('batch-payer-input').value = item.payerName;
        document.getElementById('batch-payer-country').value = item.payerCode;
        document.getElementById('batch-payment-type').value = item.paymentType;
        
        // Select the payee countries
        const checkboxes = document.querySelectorAll('#batch-payee-countries input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = item.payeeCodes.includes(cb.value);
        });
        
        queryBatchWithholdingTax();
    }
}

// Delete history item
function deleteHistoryItem(id) {
    const history = getHistory().filter(h => h.id !== id);
    saveHistory(history);
    renderHistoryList();
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all query history?')) {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        updateHistoryCount();
        renderHistoryList();
    }
}

// Get bookmarks from localStorage
function getBookmarks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || [];
    } catch {
        return [];
    }
}

// Save bookmarks to localStorage
function saveBookmarks(bookmarks) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    updateBookmarkCount();
}

// Check if item is bookmarked
function isItemBookmarked(item) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.title === item.title);
}

// Toggle bookmark
function toggleBookmark(historyId) {
    const history = getHistory();
    const item = history.find(h => h.id === historyId);
    
    if (!item) return;
    
    const bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.title === item.title);
    
    if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
    } else {
        bookmarks.push({
            id: Date.now(),
            ...item
        });
    }
    
    saveBookmarks(bookmarks);
    renderHistoryList();
}

// Update bookmark count
function updateBookmarkCount() {
    const bookmarks = getBookmarks();
    document.getElementById('bookmark-count').textContent = bookmarks.length;
}

// Render bookmarks list
function renderBookmarksList() {
    const container = document.getElementById('bookmarks-list');
    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">‚≠?/div>
                <p>No bookmarks yet. Click ‚ò?to bookmark a query.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    bookmarks.forEach(item => {
        html += `
            <div class="bookmark-item">
                <div class="item-info" onclick="replayBookmark(${item.id})">
                    <div class="item-title">${item.title}</div>
                    <div class="item-meta">${item.type.toUpperCase()}</div>
                </div>
                <div class="item-actions">
                    <button class="item-btn delete-btn" onclick="deleteBookmark(${item.id})" title="Remove bookmark">
                        ‚ú?
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Replay bookmark
function replayBookmark(id) {
    const bookmarks = getBookmarks();
    const item = bookmarks.find(b => b.id === id);
    
    if (!item) return;
    
    // Close panel
    document.getElementById('bookmarks-panel').style.display = 'none';
    document.getElementById('toggle-bookmarks').classList.remove('active');
    
    // Replay the query
    if (item.type === 'national') {
        document.getElementById('country-input').value = item.countryName;
        document.getElementById('country-select').value = item.countryCode;
        document.getElementById('transaction-type').value = item.transactionType;
        queryNationalTax();
    } else if (item.type === 'wht') {
        document.getElementById('payer-input').value = item.payerName;
        document.getElementById('payer-country').value = item.payerCode;
        document.getElementById('payee-input').value = item.payeeName;
        document.getElementById('payee-country').value = item.payeeCode;
        document.getElementById('payment-type').value = item.paymentType;
        queryWithholdingTax();
    } else if (item.type === 'batch') {
        document.getElementById('batch-payer-input').value = item.payerName;
        document.getElementById('batch-payer-country').value = item.payerCode;
        document.getElementById('batch-payment-type').value = item.paymentType;
        
        const checkboxes = document.querySelectorAll('#batch-payee-countries input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = item.payeeCodes.includes(cb.value);
        });
        
        queryBatchWithholdingTax();
    }
}

// Delete bookmark
function deleteBookmark(id) {
    const bookmarks = getBookmarks().filter(b => b.id !== id);
    saveBookmarks(bookmarks);
    renderBookmarksList();
}

// Clear all bookmarks
function clearBookmarks() {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
        updateBookmarkCount();
        renderBookmarksList();
    }
}

// Show loading overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Query National Tax Rates
async function queryNationalTax() {
    const countryCode = document.getElementById('country-select').value;
    const transactionType = document.getElementById('transaction-type').value;

    if (!countryCode) {
        alert('Please select a country/region.');
        return;
    }
    
    if (!transactionType) {
        alert('Please select a transaction type.');
        return;
    }

    showLoading();

    try {
        // Get country name
        const country = COUNTRIES.find(c => c.code === countryCode);
        const countryName = country ? country.name : countryCode;

        // Get base data from local database
        const baseData = TAX_DATA.national[countryCode];

        // Determine the actual tax type for turnover tax
        let actualTaxType = transactionType;
        let taxDisplayName = '';
        
        if (transactionType === 'turnover-tax') {
            // Auto-detect the tax type based on country
            if (baseData) {
                if (baseData.sst && baseData.sst.tiers) {
                    actualTaxType = 'sst';
                    taxDisplayName = 'SST (Sales and Service Tax)';
                } else if (baseData.gst && baseData.gst.tiers) {
                    actualTaxType = 'gst';
                    taxDisplayName = 'GST (Goods and Services Tax)';
                } else if (baseData.vat && baseData.vat.tiers) {
                    actualTaxType = 'vat';
                    taxDisplayName = 'VAT (Value Added Tax)';
                } else if (baseData.salesTax && baseData.salesTax.tiers) {
                    actualTaxType = 'salesTax';
                    taxDisplayName = 'Sales Tax';
                } else if (baseData.turnover && baseData.turnover.tiers) {
                    actualTaxType = 'turnover';
                    taxDisplayName = baseData.turnover.name || 'Turnover Tax';
                } else {
                    if (baseData.sst && baseData.sst.note) {
                        actualTaxType = 'sst';
                        taxDisplayName = 'SST (Sales and Service Tax)';
                    } else if (baseData.gst && baseData.gst.note) {
                        actualTaxType = 'gst';
                        taxDisplayName = 'GST (Goods and Services Tax)';
                    } else if (baseData.vat && baseData.vat.note) {
                        actualTaxType = 'vat';
                        taxDisplayName = 'VAT (Value Added Tax)';
                    } else {
                        actualTaxType = 'vat';
                        taxDisplayName = 'Indirect Tax';
                    }
                }
            } else {
                taxDisplayName = 'VAT/GST';
            }
        }

        // Record search start time
        const searchStartTime = Date.now();
        
        // Determine search type for API
        let searchType = 'national';
        if (actualTaxType === 'vat' || actualTaxType === 'gst' || actualTaxType === 'sst' || actualTaxType === 'turnover') {
            searchType = 'vat';
        } else if (actualTaxType === 'income-tax') {
            searchType = 'income-tax';
        } else if (actualTaxType === 'business-tax') {
            searchType = 'business-tax';
        }
        
        // Search web for current rates via API
        const searchQuery = `${countryName} ${actualTaxType.replace('-', ' ')} tax rate 2026`;
        const webResults = await searchWebRates(searchQuery, searchType);
        
        // Calculate search duration
        const searchDuration = Date.now() - searchStartTime;

        // Add to history
        addToHistory({
            type: 'national',
            title: `${countryName} - ${transactionType === 'turnover-tax' ? 'VAT/GST' : transactionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            countryCode,
            countryName,
            transactionType
        });

        // Display results
        displayNationalTaxResults(countryName, countryCode, transactionType, actualTaxType, taxDisplayName, baseData, webResults, searchDuration);
    } catch (error) {
        console.error('Error querying national tax:', error);
        alert('Error querying tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display National Tax Results
function displayNationalTaxResults(countryName, countryCode, transactionType, actualTaxType, taxDisplayName, baseData, webResults, searchDuration) {
    const resultsContainer = document.getElementById('national-tax-results');
    const contentDiv = document.getElementById('national-tax-content');
    const queryTime = new Date().toLocaleString('en-US', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let html = `<div class="tax-result-card">`;
    html += `<div class="country-name">${countryName}</div>`;
    
    if (baseData) {
        switch(transactionType) {
            case 'turnover-tax':
                let taxInfo = null;
                if (actualTaxType === 'sst' && baseData.sst) {
                    taxInfo = baseData.sst;
                } else if (actualTaxType === 'gst' && baseData.gst) {
                    taxInfo = baseData.gst;
                } else if (actualTaxType === 'vat' && baseData.vat) {
                    taxInfo = baseData.vat;
                } else if (actualTaxType === 'salesTax' && baseData.salesTax) {
                    taxInfo = baseData.salesTax;
                } else if (actualTaxType === 'turnover' && baseData.turnover) {
                    taxInfo = baseData.turnover;
                } else {
                    if (baseData.sst && baseData.sst.tiers) {
                        taxInfo = baseData.sst;
                        taxDisplayName = 'SST (Sales and Service Tax)';
                    } else if (baseData.gst && baseData.gst.tiers) {
                        taxInfo = baseData.gst;
                        taxDisplayName = 'GST (Goods and Services Tax)';
                    } else if (baseData.vat && baseData.vat.tiers) {
                        taxInfo = baseData.vat;
                        taxDisplayName = 'VAT (Value Added Tax)';
                    } else if (baseData.sst) {
                        taxInfo = baseData.sst;
                        taxDisplayName = 'SST (Sales and Service Tax)';
                    } else if (baseData.gst) {
                        taxInfo = baseData.gst;
                        taxDisplayName = 'GST (Goods and Services Tax)';
                    } else if (baseData.vat) {
                        taxInfo = baseData.vat;
                        taxDisplayName = 'VAT (Value Added Tax)';
                    }
                }
                
                if (taxInfo) {
                    html += `<div class="tax-type">${taxDisplayName}</div>`;
                    
                    if (taxInfo.tiers && taxInfo.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        taxInfo.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        html += `<div class="rate-value">${taxInfo.standard || 'N/A'}</div>`;
                    }
                    
                    if (taxInfo.note) {
                        html += `<div class="rate-label">${taxInfo.note}</div>`;
                    }
                    
                    html += `<div class="data-disclaimer">
                        <small>Local database data shown above. Please verify with official sources below for the most current rates.</small>
                    </div>`;
                } else {
                    html += `<div class="alert alert-warning">No turnover tax data available for this country.</div>`;
                }
                break;

            case 'income-tax':
                if (baseData.incomeTax) {
                    html += `<div class="tax-type">Income Tax</div>`;
                    
                    if (baseData.incomeTax.tiers && baseData.incomeTax.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        baseData.incomeTax.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        html += `<div class="rate-value" style="font-size: 1.5em;">`;
                        html += `Corporate: ${baseData.incomeTax.corporate?.standard || 'N/A'}<br>`;
                        html += `Individual: ${baseData.incomeTax.individual?.standard || 'N/A'}`;
                        html += `</div>`;
                        if (baseData.incomeTax.corporate?.note) {
                            html += `<div class="rate-label">${baseData.incomeTax.corporate.note}</div>`;
                        }
                    }
                } else {
                    html += `<div class="alert alert-warning">No Income Tax data available for this country.</div>`;
                }
                break;

            case 'business-tax':
                if (baseData.businessTax) {
                    html += `<div class="tax-type">Business Tax</div>`;
                    
                    if (baseData.businessTax.tiers && baseData.businessTax.tiers.length > 0) {
                        html += `<div class="all-rates-container">`;
                        baseData.businessTax.tiers.forEach(tier => {
                            const tierClass = tier.type || 'standard';
                            html += `<div class="rate-tier ${tierClass}">`;
                            html += `<div class="tier-info">`;
                            html += `<span class="tier-label">${tier.label}</span>`;
                            if (tier.note) {
                                html += `<span class="tier-note">${tier.note}</span>`;
                            }
                            html += `</div>`;
                            html += `<span class="tier-rate">${tier.rate}</span>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    } else {
                        html += `<div class="rate-value">${baseData.businessTax.standard || 'N/A'}</div>`;
                    }
                    
                    if (baseData.businessTax.note) {
                        html += `<div class="rate-label">${baseData.businessTax.note}</div>`;
                    }
                } else {
                    html += `<div class="alert alert-warning">No Business Tax data available for this country.</div>`;
                }
                break;
        }
    } else {
        html += `<div class="alert alert-warning">Limited data available for this country. Please verify with official sources.</div>`;
    }

    html += `</div>`;

    // Add web search sources
    if (webResults && webResults.length > 0) {
        html += `<div class="source-section">`;
        html += `<div class="realtime-indicator">`;
        html += `<span class="live-badge">‚ó?LIVE</span>`;
        html += `<span class="query-time">Queried at: ${queryTime}</span>`;
        html += `<span class="search-duration">Response time: ${searchDuration}ms</span>`;
        html += `</div>`;
        html += `<h4>Authoritative Data Sources</h4>`;
        html += `<p class="source-description">The following sources were queried in real-time for the most current tax information:</p>`;
        
        webResults.forEach((result, index) => {
            const reliabilityBadge = result.reliability === 'high' ? 
                '<span class="reliability-badge high">Official/Professional</span>' : 
                '<span class="reliability-badge medium">Reference</span>';
            const typeIcon = result.type === 'official' ? 'üèõÔ∏? : 
                            result.type === 'professional' ? 'üíº' : 'üìñ';
            
            html += `<div class="source-item verified">`;
            html += `<div class="source-header">`;
            html += `<span class="source-number">Source ${index + 1}</span>`;
            html += `${reliabilityBadge}`;
            html += `</div>`;
            html += `<a href="${result.url}" target="_blank" rel="noopener">${typeIcon} ${result.title}</a>`;
            html += `<p class="source-snippet">${result.snippet}</p>`;
            html += `</div>`;
        });
        html += `</div>`;
    }

    contentDiv.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Get domestic WHT rate (non-treaty rate) for a country
function getDomesticWHTRate(countryCode, paymentType) {
    const domesticRates = {
        'SG': { interest: '15%', dividend: '0%', royalty: '15%', technical: '15%', management: '15%' },
        'HK': { interest: '0%', dividend: '0%', royalty: '2.475-4.95%', technical: 'N/A', management: 'N/A' },
        'MY': { interest: '15%', dividend: '0%', royalty: '10%', technical: '10%', management: '10%' },
        'CN': { interest: '20%', dividend: '20%', royalty: '20%', technical: '20%', management: '20%' },
        'JP': { interest: '20.42%', dividend: '20%', royalty: '20.42%', technical: '20.42%', management: '20.42%' },
        'US': { interest: '30%', dividend: '30%', royalty: '30%', technical: '30%', management: '30%' },
        'UK': { interest: '20%', dividend: '0%', royalty: '20%', technical: '20%', management: '20%' },
        'DE': { interest: '25%', dividend: '25%', royalty: '15%', technical: '15%', management: '15%' },
        'FR': { interest: '12.8%', dividend: '30%', royalty: '33.33%', technical: '33.33%', management: '33.33%' },
        'AU': { interest: '30%', dividend: '30%', royalty: '30%', technical: '30%', management: '30%' },
        'CA': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'IN': { interest: '20%', dividend: '20%', royalty: '10%', technical: '10%', management: '10%' },
        'KR': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'TW': { interest: '20%', dividend: '21%', royalty: '20%', technical: '20%', management: '20%' },
        'TH': { interest: '15%', dividend: '10%', royalty: '15%', technical: '15%', management: '15%' },
        'ID': { interest: '20%', dividend: '20%', royalty: '20%', technical: '20%', management: '20%' },
        'VN': { interest: '5%', dividend: '5%', royalty: '10%', technical: '10%', management: '10%' },
        'PH': { interest: '25%', dividend: '25%', royalty: '25%', technical: '25%', management: '25%' },
        'NZ': { interest: '15%', dividend: '0%', royalty: '15%', technical: '15%', management: '15%' },
        'NL': { interest: '15%', dividend: '15%', royalty: '15%', technical: '15%', management: '15%' },
        'CH': { interest: '35%', dividend: '35%', royalty: '35%', technical: '35%', management: '35%' },
        'LU': { interest: '0%', dividend: '0%', royalty: '0%', technical: '0%', management: '0%' },
        'IE': { interest: '20%', dividend: '25%', royalty: '20%', technical: '20%', management: '20%' },
        'MO': { interest: '0%', dividend: '0%', royalty: '0%', technical: '0%', management: '0%' }
    };
    if (domesticRates[countryCode] && domesticRates[countryCode][paymentType]) {
        return domesticRates[countryCode][paymentType];
    }
    return 'Standard rate applies';
}

// Query Withholding Tax Rate
async function queryWithholdingTax() {
    const payerCountry = document.getElementById('payer-country').value;
    const payeeCountry = document.getElementById('payee-country').value;
    const paymentType = document.getElementById('payment-type').value;
    
    if (!payerCountry || !payeeCountry || !paymentType) {
        alert('Please select payer country, payee country, and payment type.');
        return;
    }
    
    if (payerCountry === payeeCountry) {
        alert('Payer and payee countries should be different for withholding tax.');
        return;
    }
    
    showLoading();
    
    try {
        const payerName = COUNTRIES.find(c => c.code === payerCountry)?.name || payerCountry;
        const payeeName = COUNTRIES.find(c => c.code === payeeCountry)?.name || payeeCountry;
        
        // Get domestic rate
        const domesticRate = getDomesticWHTRate(payerCountry, paymentType);
        
        // Get treaty rate
        const treatyKey = payerCountry + '_' + payeeCountry + '_' + paymentType;
        const treatyRate = TAX_DATA.withholding[treatyKey] || 'No Treaty';
        const hasTreaty = treatyRate !== 'No Treaty' && !treatyRate.includes('No Treaty');
        
        // Search web for verification
        const searchStartTime = Date.now();
        const searchQuery = payerName + ' ' + payeeName + ' withholding tax ' + paymentType + ' treaty rate 2026';
        const webResults = await searchWebRates(searchQuery, 'wht', payerName, payeeName, paymentType);
        const searchDuration = Date.now() - searchStartTime;
        
        // Add to history
        addToHistory({
            type: 'wht',
            title: 'WHT: ' + payerName + ' to ' + payeeName + ' (' + paymentType + ')',
            payerCode: payerCountry,
            payerName: payerName,
            payeeCode: payeeCountry,
            payeeName: payeeName,
            paymentType: paymentType
        });
        
        // Display results with two sections
        displayWithholdingTaxResults(payerName, payerCountry, payeeName, payeeCountry, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration);
        
    } catch (error) {
        console.error('Error querying withholding tax:', error);
        alert('Error querying withholding tax rates. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Withholding Tax Results with Two Sections
function displayWithholdingTaxResults(payerName, payerCode, payeeName, payeeCode, paymentType, domesticRate, treatyRate, hasTreaty, webResults, searchDuration) {
    const resultsContainer = document.getElementById('withholding-tax-results');
    const contentDiv = document.getElementById('withholding-tax-content');
    const sourceSection = document.getElementById('source-verification');
    const sourceList = document.getElementById('source-list');
    
    const queryTime = new Date().toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    
    // Handle domesticRate as object {rate, note} or string (backward compatible)
    const domesticRateValue = typeof domesticRate === 'object' ? domesticRate.rate : domesticRate;
    const domesticRateNote = typeof domesticRate === 'object' ? domesticRate.note : 'Standard WHT rate';
    
    // Calculate applicable rate
    let domesticRateNum = parseFloat(String(domesticRateValue).replace(/[^0-9.]/g, '')) || 0;
    let treatyRateNum = parseFloat(String(treatyRate).replace(/[^0-9.]/g, '')) || 0;
    
    let applicableRate = treatyRate;
    let applicableNote = '';
    
    if (domesticRateNum > 0 && (treatyRateNum === 0 || domesticRateNum < treatyRateNum)) {
        applicableRate = domesticRateValue;
        applicableNote = 'Domestic rate applies (lower than treaty rate)';
    } else if (treatyRateNum > 0 && treatyRateNum <= domesticRateNum) {
        applicableRate = treatyRate;
        applicableNote = 'Treaty rate applies';
    } else if (treatyRateNum === 0 && domesticRateNum === 0) {
        applicableRate = '0%';
        applicableNote = 'No WHT applicable';
    } else if (!hasTreaty) {
        applicableRate = domesticRateValue;
        applicableNote = 'No treaty - domestic rate applies';
    }
    
    let html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Withholding Tax Analysis</div>';
    html += '<div class="country-name">' + payerName + ' to ' + payeeName + '</div>';
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';
    
    // Section 1: Domestic WHT Rate (Non-Treaty)
    html += '<div class="wht-section domestic-section" style="margin: 15px 0; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">';
    html += '<div class="section-header" style="font-weight: bold; color: #e65100; margin-bottom: 8px;"><span>üèõÔ∏?Section 1: Domestic WHT Rate (Non-Treaty)</span></div>';
    html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under ' + payerName + ' domestic tax law, without considering any Double Tax Treaty</div>';
    html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #e65100;">' + domesticRateValue + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + domesticRateNote + '</div>';
    html += '</div>';
    
    // Section 2: Treaty WHT Rate
    html += '<div class="wht-section treaty-section" style="margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">';
    html += '<div class="section-header" style="font-weight: bold; color: #1565c0; margin-bottom: 8px;"><span>ü§ù Section 2: Treaty WHT Rate</span></div>';
    
    if (!hasTreaty || treatyRate.includes('No Treaty') || treatyRate.includes('Limited Treaty')) {
        html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">No applicable Double Tax Treaty between ' + payerName + ' and ' + payeeName + ' for ' + paymentType + '</div>';
        html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #1565c0;">N/A</div>';
        html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">Domestic rate applies</div>';
    } else {
        html += '<div class="section-desc" style="font-size: 0.85em; color: #666; margin-bottom: 10px;">WHT rate under Double Tax Treaty between ' + payerName + ' and ' + payeeName + '</div>';
        html += '<div class="rate-display" style="font-size: 1.8em; font-weight: bold; color: #1565c0;">' + treatyRate + '</div>';
        html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">DTT rate for ' + paymentType + '</div>';
    }
    html += '</div>';
    
    // Applicable Rate
    html += '<div class="wht-section applicable-section" style="margin: 15px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">';
    html += '<div class="section-header" style="font-weight: bold; color: #2e7d32; margin-bottom: 8px;"><span>‚ú?Applicable Rate</span></div>';
    html += '<div class="rate-display" style="font-size: 2em; font-weight: bold; color: #2e7d32;">' + applicableRate + '</div>';
    html += '<div class="rate-label" style="font-size: 0.85em; color: #666;">' + applicableNote + '</div>';
    html += '</div>';
    
    // Important note
    html += '<div class="alert alert-warning" style="margin-top: 15px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px;">';
    html += '<strong>‚ö†Ô∏è Important:</strong> If the domestic rate is <strong>lower</strong> than the treaty rate, the domestic rate applies. The treaty rate is a <strong>maximum</strong> rate that the source country can withhold, not a minimum. Always verify with local tax authorities.';
    html += '</div>';
    
    html += '</div>';
    
    // Live indicator
    html += '<div class="live-indicator" style="margin-top: 15px; padding: 10px; background: #e8f5e9; border-radius: 5px; font-size: 0.85em;">';
    html += '<span class="live-badge">‚ó?LIVE</span> Queried at: ' + queryTime;
    if (searchDuration) html += ' | Response time: ' + searchDuration + 'ms';
    html += '</div>';
    
    contentDiv.innerHTML = html;
    
    // Show sources
    if (webResults && webResults.length > 0) {
        sourceSection.style.display = 'block';
        let sourceHtml = '';
        webResults.forEach(function(result) {
            let isOfficial = result.url.includes('gov') || result.url.includes('ird') || result.url.includes('tax');
            sourceHtml += '<div class="source-item" style="padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 5px;">';
            sourceHtml += '<a href="' + result.url + '" target="_blank" style="color: #0066cc;">' + result.title + '</a>';
            sourceHtml += '<span style="margin-left: 10px; padding: 2px 6px; background: ' + (isOfficial ? '#d4edda' : '#cce5ff') + '; border-radius: 3px; font-size: 0.75em;">' + (isOfficial ? 'Official' : 'Professional') + '</span>';
            sourceHtml += '</div>';
        });
        sourceList.innerHTML = sourceHtml;
    }
    
    resultsContainer.style.display = 'block';
}

// Batch Query Withholding Tax
async function queryBatchWithholdingTax() {
    const singleCountry = document.getElementById('batch-payer-country').value;
    const paymentType = document.getElementById('batch-payment-type').value;
    
    if (!singleCountry) {
        alert('Please select a country.');
        return;
    }
    
    if (!paymentType) {
        alert('Please select a payment type.');
        return;
    }
    
    const checkboxes = document.querySelectorAll('#batch-payee-countries input[type="checkbox"]:checked');
    const multipleCountries = Array.from(checkboxes).map(cb => cb.value);
    
    if (multipleCountries.length === 0) {
        alert('Please select at least one country to compare.');
        return;
    }
    
    showLoading();
    
    try {
        const singleName = COUNTRIES.find(c => c.code === singleCountry)?.name || singleCountry;
        const results = [];
        const bidirectional = document.getElementById('bidirectional-compare').checked;
        
        for (const multiCode of multipleCountries) {
            const multiName = COUNTRIES.find(c => c.code === multiCode)?.name || multiCode;
            let primaryRate, reverseRate;
            
            if (queryDirection === 'one-payer') {
                const key = singleCountry + '_' + multiCode + '_' + paymentType;
                primaryRate = TAX_DATA.withholding[key] || 'No Treaty';
                
                if (bidirectional) {
                    const reverseKey = multiCode + '_' + singleCountry + '_' + paymentType;
                    reverseRate = TAX_DATA.withholding[reverseKey] || 'No Treaty';
                }
            } else {
                const key = multiCode + '_' + singleCountry + '_' + paymentType;
                primaryRate = TAX_DATA.withholding[key] || 'No Treaty';
                
                if (bidirectional) {
                    const reverseKey = singleCountry + '_' + multiCode + '_' + paymentType;
                    reverseRate = TAX_DATA.withholding[reverseKey] || 'No Treaty';
                }
            }
            
            results.push({
                code: multiCode,
                name: multiName,
                rate: primaryRate,
                reverseRate: reverseRate
            });
        }
        
        addToHistory({
            type: 'batch',
            title: 'Batch WHT: ' + singleName + ' (' + paymentType + ')',
            payerCode: singleCountry,
            payerName: singleName,
            payeeCodes: multipleCountries,
            paymentType: paymentType
        });
        
        displayBatchResults(singleName, singleCountry, paymentType, results, bidirectional, queryDirection);
        
    } catch (error) {
        console.error('Error in batch query:', error);
        alert('Error in batch query. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Batch Results
function displayBatchResults(singleName, singleCode, paymentType, results, bidirectional, direction) {
    const resultsContainer = document.getElementById('batch-results');
    const contentDiv = document.getElementById('batch-content');
    
    let html = '<div class="tax-result-card">';
    html += '<div class="tax-type">Batch Withholding Tax Comparison</div>';
    
    if (direction === 'one-payer') {
        html += '<div class="country-name">Payer: ' + singleName + '</div>';
    } else {
        html += '<div class="country-name">Payee: ' + singleName + '</div>';
    }
    
    html += '<div class="tax-type" style="font-size: 0.9em; color: #6c757d;">Payment Type: ' + paymentType.charAt(0).toUpperCase() + paymentType.slice(1) + '</div>';
    
    html += '<table class="results-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
    html += '<thead><tr><th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6; text-align: left;">Country</th>';
    
    if (direction === 'one-payer') {
        html += '<th style="padding: 10px; background: #d4edda; border: 1px solid #dee2e6;">' + singleName + ' to Country</th>';
        if (bidirectional) {
            html += '<th style="padding: 10px; background: #cce5ff; border: 1px solid #dee2e6;">Country to ' + singleName + '</th>';
            html += '<th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6;">Difference</th>';
        }
    } else {
        html += '<th style="padding: 10px; background: #d4edda; border: 1px solid #dee2e6;">Country to ' + singleName + '</th>';
        if (bidirectional) {
            html += '<th style="padding: 10px; background: #cce5ff; border: 1px solid #dee2e6;">' + singleName + ' to Country</th>';
            html += '<th style="padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6;">Difference</th>';
        }
    }
    
    html += '</tr></thead><tbody>';
    
    results.forEach(function(result) {
        html += '<tr><td style="padding: 10px; border: 1px solid #dee2e6;">' + result.name + '</td>';
        html += '<td style="padding: 10px; border: 1px solid #dee2e6; background: #d4edda; text-align: center;">' + result.rate + '</td>';
        
        if (bidirectional) {
            html += '<td style="padding: 10px; border: 1px solid #dee2e6; background: #cce5ff; text-align: center;">' + (result.reverseRate || 'N/A') + '</td>';
            
            const rate1 = parseFloat(String(result.rate).replace(/[^0-9.]/g, '')) || 0;
            const rate2 = parseFloat(String(result.reverseRate).replace(/[^0-9.]/g, '')) || 0;
            const diff = Math.abs(rate1 - rate2);
            
            html += '<td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">' + (diff > 0 ? diff + '%' : '0%') + '</td>';
        }
        
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    contentDiv.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Web Search Function
async function searchWebRates(query, type, payerCountry, payeeCountry, paymentType) {
    try {
        let url = '/.netlify/functions/search?query=' + encodeURIComponent(query) + '&type=' + encodeURIComponent(type || 'general');
        if (payerCountry) url += '&payer=' + encodeURIComponent(payerCountry);
        if (payeeCountry) url += '&payee=' + encodeURIComponent(payeeCountry);
        if (paymentType) url += '&paymentType=' + encodeURIComponent(paymentType);
        
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.results || [];
        }
    } catch (error) {
        console.warn('API search error:', error);
    }
    
    return getCuratedSources(query);
}

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