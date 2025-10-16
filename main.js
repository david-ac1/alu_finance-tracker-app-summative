// ======= STATE & STORAGE =======
const KEY = 'financeTrackerData';
let state = { transactions: [] };

// Load State from LocalStorage
function loadState() {
    const savedState = localStorage.getItem(KEY);
    if (savedState) {
        state.transactions = JSON.parse(savedState);
    }
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state.transactions));
}

// ======= SETTINGS STORAGE =======
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('financeSettings')) || {};
    if (settings.currency) document.getElementById('base-currency').value = settings.currency;
    if (settings.cap) document.getElementById('spending-cap').value = settings.cap;
}

function getSettings() {
    return JSON.parse(localStorage.getItem('financeSettings')) || { currency: 'USD', cap: 0 };
}

function saveSettings() {
    const settings = {
        currency: document.getElementById('base-currency').value,
        cap: parseFloat(document.getElementById('spending-cap').value) || 0
    };
    localStorage.setItem('financeSettings', JSON.stringify(settings));
    alert('Settings saved!');
    updateDashboard();
}

// ======= EVENT FOR SETTINGS SAVE =======
document.getElementById('save-settings').addEventListener('click', saveSettings);

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const toggleSwitch = document.getElementById('toggle-switch');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        toggleSwitch.classList.add('active');
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleSwitch.classList.toggle('active');
    const newTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
});

// ===== NAVIGATION =====
const navLinks = document.querySelectorAll('[data-section]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        link.classList.add('active');
        const sectionId = link.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// === HELPER FUNCTIONS ===
function formatAmount(value) {
    return parseFloat(value).toFixed(2);
}

function generateId() {
    return 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

function getCurrencySymbol(currency) {
    const symbols = {
        'USD': '$',
        'ZAR': 'R',
        'RWF': 'RWF '
    };
    return symbols[currency] || '$';
}

// ======= DASHBOARD UPDATES =======
function updateDashboard() {
    const totalSpent = document.getElementById('total-spent');
    const countTransactions = document.getElementById('transaction-count');
    const topCategory = document.getElementById('top-category');
    const spendingCapCard = document.getElementById('spending-cap-card');
    const settings = getSettings();

    const total = state.transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    const count = state.transactions.length;

    // Compute top spending category
    const categoryCount = {};
    state.transactions.forEach(txn => {
        categoryCount[txn.category] = (categoryCount[txn.category] || 0) + 1;
    });

    const topCategoryName = count === 0
        ? 'N/A'
        : Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
        );

    const currencySymbol = getCurrencySymbol(settings.currency);

    totalSpent.querySelector('.card-value').textContent = `${currencySymbol}${formatAmount(total)}`;
    countTransactions.querySelector('.card-value').textContent = count;
    topCategory.querySelector('.card-value').textContent = topCategoryName;
    spendingCapCard.querySelector('.card-value').textContent = `${currencySymbol}${formatAmount(settings.cap)}`;

    // Spending cap alert
    if (settings.cap && total > settings.cap) {
        totalSpent.classList.add('alert');
    } else {
        totalSpent.classList.remove('alert');
    }

    // Update spending breakdown
    updateSpendingBreakdown();
}

// ======= SPENDING BREAKDOWN =======
function updateSpendingBreakdown() {
    const breakdownBars = document.getElementById('breakdown-bars');
    const settings = getSettings();
    const currencySymbol = getCurrencySymbol(settings.currency);

    if (state.transactions.length === 0) {
        breakdownBars.innerHTML = '<p style="color: var(--text-secondary);">No transactions yet</p>';
        return;
    }

    // Group by category and sum amounts
    const categoryTotals = {};
    state.transactions.forEach(txn => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + parseFloat(txn.amount);
    });

    // Find max for percentage calculation
    const maxAmount = Math.max(...Object.values(categoryTotals));

    // Build breakdown
    breakdownBars.innerHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => {
            const percentage = (amount / maxAmount) * 100;
            return `
                <div class="breakdown-item">
                    <div class="breakdown-label">${category}</div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${percentage}%;">${percentage.toFixed(0)}%</div>
                    </div>
                    <div class="breakdown-amount">${currencySymbol}${formatAmount(amount)}</div>
                </div>
            `;
        })
        .join('');
}

// ======= RENDER TRANSACTIONS =======
function renderTransactions() {
    const tbody = document.querySelector('#records-table tbody');
    tbody.innerHTML = '';

    state.transactions.forEach(t => {
        const settings = getSettings();
        const currencySymbol = getCurrencySymbol(settings.currency);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.description}</td>
            <td>${currencySymbol}${formatAmount(t.amount)}</td>
            <td>${t.category}</td>
            <td>${t.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="delete-btn danger" data-id="${t.id}">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ======= FORM HANDLING =======
const form = document.getElementById('transaction-form');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    let valid = true;

    if (!description) {
        showError('description', 'Description cannot be empty.');
        valid = false;
    } else clearError('description');

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        showError('amount', 'Amount must be a positive number.');
        valid = false;
    } else clearError('amount');

    if (!category) {
        showError('category', 'Please select a category.');
        valid = false;
    } else clearError('category');

    if (!date) {
        showError('date', 'Please select a date.');
        valid = false;
    } else clearError('date');

    if (!valid) return;

    const transaction = {
        id: generateId(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    state.transactions.push(transaction);
    saveState();
    renderTransactions();
    updateDashboard();
    form.reset();
});

// ======= ERROR MESSAGES =======
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = field.nextElementSibling;
    errorEl.textContent = message;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = field.nextElementSibling;
    errorEl.textContent = '';
}

// ======= DELETE & EDIT HANDLERS =======
document.querySelector('#records-table tbody').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        state.transactions = state.transactions.filter(t => t.id !== id);
        saveState();
        renderTransactions();
        updateDashboard();
    }

    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const t = state.transactions.find(t => t.id === id);
        if (!t) return;

        document.getElementById('description').value = t.description;
        document.getElementById('amount').value = t.amount;
        document.getElementById('category').value = t.category;
        document.getElementById('date').value = t.date;

        state.transactions = state.transactions.filter(tx => tx.id !== id);
        saveState();
        renderTransactions();
        updateDashboard();

        // Scroll to form
        document.getElementById('add-transaction').scrollIntoView({ behavior: 'smooth' });
    }
});

// ======= SEARCH FEATURE =======
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const filtered = state.transactions.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.date.includes(query)
    );
    renderFilteredTransactions(filtered);
});

function renderFilteredTransactions(transactions) {
    const tbody = document.querySelector('#records-table tbody');
    tbody.innerHTML = '';

    transactions.forEach(t => {
        const settings = getSettings();
        const currencySymbol = getCurrencySymbol(settings.currency);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.description}</td>
            <td>${currencySymbol}${formatAmount(t.amount)}</td>
            <td>${t.category}</td>
            <td>${t.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="delete-btn danger" data-id="${t.id}">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ======= SORT FEATURE =======
const headers = document.querySelectorAll('#records-table th[data-sort]');
let sortState = { key: null, ascending: true };

headers.forEach(header => {
    header.addEventListener('click', () => {
        const key = header.getAttribute('data-sort');
        sortState.ascending = sortState.key === key ? !sortState.ascending : true;
        sortState.key = key;

        state.transactions.sort((a, b) => {
            if (key === 'amount') {
                return sortState.ascending ? a.amount - b.amount : b.amount - a.amount;
            }
            return sortState.ascending
                ? a[key].localeCompare(b[key])
                : b[key].localeCompare(a[key]);
        });

        renderTransactions();
        saveState();
    });
});

// ======= INIT =======
function init() {
    initTheme();
    loadState();
    loadSettings();
    renderTransactions();
    updateDashboard();
}

init();