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
    const count = document.getElementById('transaction-count');
    const topCategory = document.getElementById('top-category');

    const total = state.transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    count.textContent = state.transactions.length;
}
