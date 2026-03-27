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
                <div class="icon">??</div>
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
                        ${isBookmarked ? '★' : '☆'}
                    </button>
                    <button class="item-btn delete-btn" onclick="deleteHistoryItem(${item.id})" title="Delete">
                        ?
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
                <div class="icon">?</div>
                <p>No bookmarks yet. Click ☆ to bookmark a query.</p>
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
                        ?
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
            // Priority: SST > GST > VAT > Sales Tax > Turnover
            if (baseData) {
                // Check for SST (Malaysia specific)
                if (baseData.sst && baseData.sst.tiers) {
                    actualTaxType = 'sst';
                    taxDisplayName = 'SST (Sales and Service Tax)';
                } 
                // Check for GST (Australia, New Zealand, Singapore, etc.)
                else if (baseData.gst && baseData.gst.tiers) {
                    actualTaxType = 'gst';
                    taxDisplayName = 'GST (Goods and Services Tax)';
                } 
                // Check for VAT (Europe, China, etc.)
                else if (baseData.vat && baseData.vat.tiers) {
                    actualTaxType = 'vat';
                    taxDisplayName = 'VAT (Value Added Tax)';
                }
                // Check for sales tax (US)
                else if (baseData.salesTax && baseData.salesTax.tiers) {
                    actualTaxType = 'salesTax';
                    taxDisplayName = 'Sales Tax';
                }
                // Check for turnover tax
                else if (baseData.turnover && baseData.turnover.tiers) {
                    actualTaxType = 'turnover';
                    taxDisplayName = baseData.turnover.name || 'Turnover Tax';
                }
                // Fallback - show available tax type or note
                else {
                    // Try to find any available indirect tax
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
    
    // Check if we have real-time extracted data from PwC
    const hasRealTimeData = webResults && webResults.results && webResults.results.some(r => r.extractedData);
    const extractedData = hasRealTimeData ? webResults.results.find(r => r.extractedData)?.extractedData : null;

    if (baseData) {
        switch(transactionType) {
            case 'turnover-tax':
                // Use actualTaxType to get the correct tax info
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
                    // Fallback: find any available indirect tax with data
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
                    
                    // If we have real-time extracted VAT/GST rate, show it first
                    if (extractedData && extractedData.vat) {
                        html += `<div class="real-time-indicator">
                            <span class="live-badge">● LIVE</span>
                            <span class="real-time-rate">Real-time rate from PwC: <strong>${extractedData.vat}</strong></span>
                        </div>`;
                    }
                    
                    // Check if it has tiers (new format)
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
                        // Old format fallback
                        html += `<div class="rate-value">${taxInfo.standard || 'N/A'}</div>`;
                    }
                    
                    if (taxInfo.note) {
                        html += `<div class="rate-label">${taxInfo.note}</div>`;
                    }
                    
                    // Add disclaimer about local data
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
                    
                    // Check if it has tiers (new format)
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
                        // Old format fallback
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
                    
                    // Check if it has tiers (new format)
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

    // Add web search sources with real-time indicators
    if (webResults && webResults.length > 0) {
        html += `<div class="source-section">`;
        html += `<div class="realtime-indicator">`;
        html += `<span class="live-badge">● LIVE</span>`;
        html += `<span class="query-time">Queried at: ${queryTime}</span>`;
        html += `<span class="search-duration">Response time: ${searchDuration}ms</span>`;
        html += `</div>`;
        html += `<h4>Authoritative Data Sources</h4>`;
        html += `<p class="source-description">The following sources were queried in real-time for the most current tax information:</p>`;
        
        webResults.forEach((result, index) => {
            const reliabilityBadge = result.reliability === 'high' ? 
                '<span class="reliability-badge high">Official/Professional</span>' : 
                '<span class="reliability-badge medium">Reference</span>';
            const typeIcon = result.type === 'official' ? '???' : 
                            result.type === 'professional' ? '??' : '??';
            
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
