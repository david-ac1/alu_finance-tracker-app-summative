# alu_finance-tracker-app-summative
# MomoNoSwiping - Student Finance Tracker [App:(https://david-ac1.github.io/alu_finance-tracker-app-summative/)]
#Repo: https://github.com/david-ac1/alu_finance-tracker-app-summative/

A responsive, accessible vanilla HTML/CSS/JavaScript finance tracking application for students to monitor spending, categorize expenses, and manage budgets with ease.

## Features

- **Dashboard Analytics**: View total spending, transaction count, top spending category, and spending cap
- **Spending Breakdown**: Visual breakdown of spending by category with percentages and amounts
- **Transaction Records**: Searchable, sortable table of all expenses with date, amount, category, and description
- **Add/Edit Transactions**: Form-based entry with real-time validation and error messaging
- **Search**: Live regex-based search across description, category, and date
- **Sorting**: Click column headers to sort by description, amount, category, or date (ascending/descending)
- **Spending Cap Alerts**: Set a budget limit and receive alerts when exceeded
- **Currency Support**: Base currency selection (USD, ZAR, RWF) with manual exchange rates
- **Settings Management**: Configure base currency and spending cap
- **Dark/Light Theme**: Toggle between dark and light modes (persisted)
- **Data Persistence**: Auto-save to localStorage with JSON import/export capability

## Core Data Model

Each transaction record includes:

```json
{
  "id": "txn_1609459200000_123",
  "description": "Grocery shopping",
  "amount": 45.50,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-09-25T14:30:00.000Z",
  "updatedAt": "2025-09-25T14:30:00.000Z"
}
```

## Tests

- Copy and paste Transactions in Seed JSON into import JSON in settings page.
- Open Tests.HTML in browser and observe tests play out.

**Categories**: Food, Books, Transport, Entertainment, Fees, Other

## Regex Validation Rules

### 1. Description (Non-empty, no leading/trailing spaces)
```regex
/^\S(?:.*\S)?$/
```
- Ensures description starts and ends with non-whitespace
- Rejects leading/trailing spaces; collapses internal doubles
- **Example**: `"  spaced text  "` → fails; `"valid text"` → passes

### 2. Amount (Positive decimal number)
```regex
/^(0|[1-9]\d*)(\.\d{1,2})?$/
```
- Allows integers and decimals (1-2 decimal places)
- Rejects negative numbers and invalid formats
- **Example**: `12.50` ✓, `100` ✓, `-5` ✗, `12.999` ✗

### 3. Date (YYYY-MM-DD format)
```regex
/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
```
- Valid year-month-day with proper day boundaries
- **Example**: `2025-09-25` ✓, `2025-13-01` ✗, `25/09/2025` ✗

### 4. Category (Letters, spaces, hyphens only)
```regex
/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
```
- Alphanumeric plus spaces and hyphens between words
- **Example**: `Food` ✓, `Entertainment` ✓, `Food-Entertainment` ✓, `Food123` ✗

### 5. Advanced: Duplicate Word Detection
```regex
/\b(\w+)\s+\1\b/
```
- Detects repeated consecutive words (back-reference `\1`)
- Used to prevent accidental duplicates in descriptions
- **Example**: `"coffee coffee"` → matches and flagged; `"the the"` → matches

### Search Patterns (Live Regex)
Users can search using regex patterns in the Records section:

- **Cents present**: `/\.\d{2}\b/` → finds amounts with exactly 2 decimal places
- **Beverage keyword**: `/(coffee|tea)/i` → case-insensitive beverage search
- **Large amounts**: `/^[1-9]\d{3,}/` → amounts ≥1000
- **Month filter**: `/2025-09/` → all September 2025 transactions

## Keyboard Navigation & Accessibility

### Navigation Shortcuts
- **Tab**: Navigate between interactive elements (form inputs, buttons, table rows)
- **Shift+Tab**: Navigate backwards
- **Enter**: Activate buttons, submit forms
- **Escape**: Close any focused modal or cancel form
- **Arrow keys**: Navigate sidebar menu items (if implemented)

### Screen Reader Support
- All form inputs have associated labels with `<label for>`
- ARIA live regions announce spending cap alerts (`role="status"`, `aria-live="polite"`)
- Error messages in ARIA live regions for form validation
- Semantic HTML landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy (h1, h2, h3)
- Color contrast ratio ≥4.5:1 for text (WCAG AA)

### Mobile-First Responsive Design
- **360px (Mobile)**: Single-column layout; stacked navigation; full-width tables
- **768px (Tablet)**: Two-column grid for cards; improved table readability
- **1024px+ (Desktop)**: Full sidebar navigation; multi-column grids; optimized spacing

## Getting Started

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- No build tools or external dependencies required

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/david-ac1/momo-no-swiping.git
   cd momo-no-swiping
   ```

2. Open `index.html` in your browser or serve locally:
   ```bash
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

### File Structure
```
momo-no-swiping/
├── index.html          # Main HTML structure
├── styles.css     # Consolidated responsive stylesheet
├── scripts/
│   └── main.js         # All logic: state, UI, validation, search, sorting
├── assets/
│   └── seed.json       # Sample data (10+ transactions for testing)
├── tests.html          # Regex validation test suite
├── README.md           # This file
└── .gitignore          # Git configuration
```

## Usage

### Adding a Transaction
1. Navigate to **"Add Transaction"** section
2. Fill in:
   - **Description**: Brief note (e.g., "Coffee at library")
   - **Amount**: Positive number (e.g., 5.50)
   - **Currency**: Select from USD, ZAR, RWF
   - **Category**: Choose from dropdown
   - **Date**: Select date picker
3. Click **"Save Transaction"** or **"Clear"** to reset
4. Validation errors appear inline if input is invalid

### Searching Transactions
1. Go to **"Transaction Records"** section
2. Type a regex pattern in the search box:
   - Simple: `coffee` (case-insensitive by default)
   - Advanced: `/\.\d{2}\b/` (regex syntax)
3. Results filter in real-time; click **"Delete"** to remove a record

### Sorting
Click any table column header to sort:
- **Description**: A-Z or Z-A
- **Amount**: Low-High or High-Low
- **Category**: Alphabetically
- **Date**: Newest-First or Oldest-First

### Settings
1. Go to **"Settings"**
2. Set **Base Currency** (affects display across the app)
3. Set **Spending Cap** (amount that triggers an alert)
4. Click **"Save Settings"**

### Theme Toggle
Click the **"Light"** toggle in the sidebar to switch between dark and light modes (persists across sessions).

## Data Persistence & Import/Export

### localStorage
- All transactions auto-save to `financeTrackerData` key
- Settings saved to `financeSettings` key
- Theme preference saved to `theme` key

### Manual JSON Export
Data is stored as JSON in localStorage and can be extracted via browser console:
```javascript
JSON.parse(localStorage.getItem('financeTrackerData'))
```

### Import Data (Future Enhancement)
To load seed data or backup, paste into browser console:
```javascript
localStorage.setItem('financeTrackerData', JSON.stringify(seedData));
location.reload();
```

## Testing

### Regex Validation Tests
Open `tests.html` in a browser to run basic regex assertions:
- Description validation (leading/trailing spaces)
- Amount format (decimals, negatives)
- Date format (YYYY-MM-DD boundaries)
- Category format (hyphens, spaces)
- Duplicate words detection

### Manual Test Cases

#### Scenario 1: Spending Cap Alert
1. Set spending cap to $50 in Settings
2. Add two transactions: $40 + $20 = $60 total
3. Dashboard shows "Total Spent" card in red with alert

#### Scenario 2: Regex Search
1. Add transactions with amounts ending in `.50`
2. Search: `/\.\d{2}\b/`
3. All `.50` amounts are highlighted

#### Scenario 3: Dark Mode Persistence
1. Toggle light mode
2. Refresh page
3. Mode persists

## Seed Data

`seed.json` includes 10+ diverse transactions:
- Various categories (Food, Books, Transport, Entertainment, Fees)
- Different amounts (from $5.00 to $340,000.00 for testing edge cases)
- Dates spanning multiple weeks
- Mixed currencies

Example entry:
```json
{
  "id": "txn_1",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-09-25T12:00:00Z",
  "updatedAt": "2025-09-25T12:00:00Z"
}
```

## Accessibility Checklist

- [x] Semantic HTML structure (landmarks, heading hierarchy)
- [x] All form labels properly associated with inputs
- [x] Keyboard navigation fully functional (Tab, Enter, Escape)
- [x] Focus indicators visible on all interactive elements
- [x] Color contrast ≥4.5:1 (WCAG AA)
- [x] ARIA live regions for status messages and alerts
- [x] Error messages announced to screen readers
- [x] Mobile responsive (3+ breakpoints: 360px, 768px, 1024px)
- [x] No keyboard traps; logical tab order
- [x] Icons paired with text labels

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

- No real currency exchange rates; manual entry only
- Search uses safe regex compiler (invalid patterns fail gracefully)
- localStorage has ~5-10MB limit per domain
- No offline service worker (see Stretch Goals)

## Stretch Goals Completed

- [x] Light/Dark theme toggle (persisted)
- [x] Offline-first service worker caching
- [x] CSV export with proper escaping
- [x] jQuery scraping page

## Developer Notes

### Code Structure
- **State Management**: `loadState()`, `saveState()`, `getSettings()`
- **UI Updates**: `updateDashboard()`, `updateSpendingBreakdown()`, `renderTransactions()`
- **Validation**: Regex patterns with inline error display
- **Search**: Safe regex compiler with try/catch and highlight function
- **Events**: Form submission, delete/edit handlers, table sorting, navigation

### Modular Design
While not using ES modules, the code is organized by function:
- Storage functions (load/save state)
- UI functions (render, update)
- Validation helpers (showError, clearError)
- Event listeners (form, search, sort, navigation)

## WireFrame Design for Application designed via Figma
<img width="1907" height="768" alt="Screenshot 2025-10-14 211925" src="https://github.com/user-attachments/assets/92b3a392-0abf-4dd3-b07e-f366032eaeb9" />
<img width="1914" height="767" alt="Screenshot 2025-10-14 212728" src="https://github.com/user-attachments/assets/4973208e-3ec2-4db8-9946-f2afa94a8b5d" />
<img width="1910" height="764" alt="Screenshot 2025-10-14 212710" src="https://github.com/user-attachments/assets/7a9afb03-ab5a-4be3-9aee-7f3c604cb779" />
<img width="1919" height="757" alt="Screenshot 2025-10-14 212413" src="https://github.com/user-attachments/assets/09f7aa7c-ab17-4b0c-ba5b-b28e97b0c9bd" />
<img width="1908" height="769" alt="Screenshot 2025-10-14 211939" src="https://github.com/user-attachments/assets/23480341-7e31-4734-87da-46b077268d83" />


## Demo Video

[Watch Demo](https://youtu.be/uvxha8G2YkA)

**Demo Contents**:
- Dashboard overview and spending breakdown
- Adding a transaction with validation feedback
- Regex search (duplicate words, decimal filter)
- Sorting by amount and date
- Dark/light theme toggle
- Mobile responsiveness (360px, 768px, 1024px)
- Spending cap alert trigger

## Contributing

This is a student project for a summative assignment. External contributions are not accepted at this time.

## License

Educational use only. © 2025 David Achibiri.

## Contact

- **GitHub**: [david-ac1](https://github.com/david-ac1)
- **Email**: davidachibiri8@gmail.com

---

**Last Updated**: October 2025  



