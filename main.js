// ======= STATE & STORAGE =======
const KEY = 'financeTrackerData';

let state = {
    transactions: []
};

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

// === HELPER FUNCTIONS ===

// Format amount to 2 decimal places
function formatAmount(value) {
    return parseFloat(value).toFixed(2);
}

// Generate unique ID for each transaction
function generateId() {
    return 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// === DASHBOARD UPDATES ===
function updateDashboard() {
    const totalSpent = document.getElementById('total-spent');
    const countTransactions = document.getElementById('transaction-count');
    const topCategory = document.getElementById('top-category');

    const total = state.transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    const count = state.transactions.length;

    // Compute top spending category
    const categoryCount = {};
    state.transactions.forEach(txn => {
        categoryCount[txn.category] = (categoryCount[txn.category] || 0) + 1;
    });

    const topCategoryCount = count === 0
        ? 'N/A'
        : Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
        );

    totalSpent.textContent = `Total Spent: $${formatAmount(total)}`;
    countTransactions.textContent = `Transactions: ${count}`;
    topCategory.textContent = `Top Category: ${topCategoryCount}`;
}

// === DISPLAY TRANSACTIONS IN TABLE ===
function renderTransactions() {
    const tbody = document.querySelector('#records-table tbody');
    tbody.innerHTML = '';

    state.transactions.forEach(t => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${t.description}</td>
            <td>${formatAmount(t.amount)}</td>
            <td>${t.category}</td>
            <td>${t.date}</td>
            <td>
                <button class="edit-btn" data-id="${t.id}">Edit</button>
                <button class="delete-btn" data-id="${t.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// === FORM HANDLING ===
const form = document.getElementById('transaction-form');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values (moved inside event listener)
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Simple validation logic
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

    // Create Transaction Object
    const transaction = {
        id: generateId(),
        description,
        amount: parseFloat(amount),
        category,
        date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add to state & save
    state.transactions.push(transaction);
    saveState();

    // Update UI
    renderTransactions();
    updateDashboard();

    // Reset form
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

        // Populate form for editing
        document.getElementById('description').value = t.description;
        document.getElementById('amount').value = t.amount;
        document.getElementById('category').value = t.category;
        document.getElementById('date').value = t.date;

        // Remove old transaction temporarily
        state.transactions = state.transactions.filter(tx => tx.id !== id);
        saveState();
        renderTransactions();
        updateDashboard();
    }
});

// ======= INIT =======
function init() {
    loadState();
    renderTransactions();
    updateDashboard();
}

init();
