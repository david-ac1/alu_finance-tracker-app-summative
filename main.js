// ======= STATE & STORAGE =======
const KEY = 'momonoswiping';

let state = {
    transactions: []
};

//Load State from LocalStorage

function loadState() {
    const savedState = localStorage.getItem(KEY);
    if (savedState) {
        state.transactions = JSON.parse(savedState);
    }
}

//Save State to LocalStorage

function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state.transactions));
}

//===HELPER FUNCTIONS===

//format Amount to 2 d.p

function formatAmount(value) {
    return parseFloat(value).toFixed(2);
}

//Generate Unique ID for each transaction

function generateId() {
    return 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// === Updates To Be Implemented In UI ===

//Dashboard Cards

function updateDashboard() {
    const totalSpent = document.getElementById('total-spent');
    const countTransactions = document.getElementById('transaction-count');
    const topCategory = document.getElementById('top-category');

    const total = state.transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    const count = state.transactions.length;

//Compute Top Spending Category

const categoryCount = {};
state.transactions.forEach(txn => {
    categoryCount[txn.category] = (categoryCount[txn.category] || 0) + 1;
});

const topCategoryCount = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, null);

totalSpent.textContent = `Total Spent: $${formatAmount(total)}`;
countTransactions.textContent = `Transactions: ${count}`;
topCategory.textContent = `Top Category: ${count === 0 ? 'N/A' : topCategoryCount}`;
};

//Display Transactions in Table

function displayTransactions() {};