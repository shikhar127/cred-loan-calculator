# Comprehensive Build Prompt: Advanced Loan Calculator App

## 🎯 Project Overview

Build a **professional, feature-rich loan calculator web application** with a modern dark theme, mobile-first responsive design, and advanced financial planning tools. The app should be production-ready for both web (GitHub Pages) and native Android (via Capacitor).

---

## 📋 Tech Stack Requirements

### **Core Technologies:**
- **Framework**: React 19.1.1 with Vite 7.1.7
- **Styling**: TailwindCSS 3.4.18 with custom dark theme
- **Charts**: Recharts 3.2.1 for data visualization
- **Export**: html-to-image 1.11.13 for screenshot exports
- **Native**: Capacitor 7.4.3 for Android APK builds
- **Build Tool**: Vite with autoprefixer and PostCSS

### **Project Structure:**
```
src/
├── components/
│   ├── LoanCalculator.jsx (384 lines) - Main calculator with all features
│   ├── CollapsibleSection.jsx (58 lines) - Reusable accordion component
│   ├── LoanInputs.jsx (122 lines) - Amount, Tenure, ROI sliders
│   ├── ChartsSection.jsx (67 lines) - Pie + Line charts
│   ├── ScheduleTable.jsx (35 lines) - Month-wise repayment table
│   ├── ForeclosureCalculator.jsx (176 lines) - Foreclosure planning tool
│   ├── EligibilityChecker.jsx (300 lines) - Loan eligibility assessment
│   ├── LoanComparison.jsx (238 lines) - Side-by-side loan comparison
│   ├── SavedLoans.jsx (130 lines) - Saved loans management
│   ├── Icons.jsx (78 lines) - SVG icon components
│   ├── LoanDisbursal.jsx - Placeholder tab (future feature)
│   └── CreditScore.jsx - Placeholder tab (future feature)
├── hooks/
│   ├── useLocalStorage.js - Persistent state management
│   ├── useDebouncedValue.js - 300ms debouncing for performance
│   └── useDeviceDetect.js - Responsive device detection
├── App.jsx (148 lines) - Main app shell with tab navigation
├── main.jsx - React root renderer
└── index.css (137 lines) - Global styles + custom range sliders
```

**Total Code**: ~2,577 lines across 13 components

---

## 🎨 Design System

### **Color Palette (Dark Theme - CRED-Inspired):**
```javascript
colors: {
  'cred-dark': '#0b0b0f',          // Main background (very dark black)
  'cred-darker': '#121318',        // Card background (dark gray)
  'cred-accent': '#23f0c7',        // Primary accent (bright teal)
  'cred-accent-light': '#7cffb2',  // Secondary accent (light teal)
  'text-primary': 'white',         // Main text
  'text-secondary': '#9ca3af',     // Gray-400 for labels
  'border': '#374151',             // Gray-700 for borders
}
```

### **Typography:**
- **Font**: Inter (Google Fonts) with fallback to system-ui
- **Sizes (Compact Design)**:
  - Hero EMI: `text-3xl` (30px)
  - Card Values: `text-2xl` (24px)
  - Symbols: `text-lg` (18px)
  - Labels: `text-[10px]` (10px)
  - Buttons: `text-sm` (14px)
  - Badges: `text-[10px]` (10px)

### **Spacing (Compact Layout):**
- Container: `px-4 py-4`
- Cards: `p-3 rounded-xl`
- Sections: `space-y-3`
- CollapsibleSection header: `px-4 py-3`
- CollapsibleSection content: `px-4 py-3`
- Buttons: `py-2 px-4`

### **Component Styling Patterns:**
- **Cards**: `bg-cred-darker` + `border-2 border-gray-700` + `rounded-xl`
- **CollapsibleSections**: `bg-cred-darker/50` + `backdrop-blur-sm` + `rounded-xl`
- **Buttons**: Teal accent with `active:scale-95` for feedback
- **Sliders**: Teal gradient track with white thumb + glow effect
- **Icons**: `w-4 h-4` standard size, teal accent color

---

## 🏗️ App Architecture

### **Main App Shell (App.jsx):**

**Features:**
1. **Tab Navigation System** (3 tabs):
   - Calculator (main feature)
   - Loan (placeholder)
   - Score (placeholder)

2. **Responsive Layouts**:
   - **Desktop (≥1024px)**: Mobile device frame with notch simulation
   - **Mobile/Tablet**: Full-screen native layout

3. **Universal Design Principles**:
   - 56px minimum touch targets
   - Safe area support: `env(safe-area-inset-top/bottom)`
   - Top bar: Sticky with backdrop blur
   - Bottom nav: Fixed with active indicators (1px top border)
   - Active tab: Teal color + indicator line at top of tab bar

4. **Device Detection**:
   - Custom `useDeviceDetect` hook
   - Responsive breakpoints: 768px (mobile), 1024px (desktop)
   - Window resize listeners

---

## 🧮 Core Feature: Loan Calculator (LoanCalculator.jsx)

### **Architecture:**
- **State Management**:
  - LocalStorage persistence: loan amount, tenure, tenure type, ROI
  - URL parameter parsing for shared loans
  - Modal state for save functionality

- **Performance Optimization**:
  - 300ms debouncing on slider inputs (useDebouncedValue hook)
  - Real-time EMI calculation
  - Memoized calculations

### **Layout Structure:**

```
┌─────────────────────────────────────────┐
│ Hero EMI Card (Always Visible)          │
│ - Monthly EMI (3xl font)                │
│ - Total Payable + Interest              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [Save] [Share] [Export] (Quick Actions) │
└─────────────────────────────────────────┘

┌─ Loan Details (Collapsible) ────────────┐
│ ├── Quick Presets (4 buttons)           │
│ ├── Loan Amount Slider                  │
│ ├── Tenure Slider (Months/Years toggle) │
│ └── ROI Slider (0-30%)                  │
└─────────────────────────────────────────┘

┌─ Charts & Breakdown (Collapsible) ──────┐
│ ├── Pie Chart (Principal vs Interest)   │
│ └── Line Chart (36-month trend)         │
└─────────────────────────────────────────┘

┌─ Repayment Schedule (Collapsible) ──────┐
│ └── Month-wise breakdown (scrollable)   │
└─────────────────────────────────────────┘

┌─ Eligibility Checker (Collapsible) ─────┐
│ ├── Salary, EMIs, Expenses inputs       │
│ ├── Credit Score selector                │
│ ├── Max loan calculation (40% formula)  │
│ └── "Apply to Calculator" button        │
└─────────────────────────────────────────┘

┌─ Foreclosure Calculator (Collapsible) ──┐
│ ├── Foreclosure month selector          │
│ ├── Charge % slider (default 3%)        │
│ ├── Total foreclosure amount            │
│ ├── Continue vs Foreclose comparison    │
│ └── Savings calculation                 │
└─────────────────────────────────────────┘

┌─ Compare Loans (Collapsible) ───────────┐
│ ├── Loan A inputs (blue border)         │
│ ├── Loan B inputs (pink border)         │
│ └── Side-by-side comparison + winner    │
└─────────────────────────────────────────┘

┌─ My Saved Loans (Collapsible) ──────────┐
│ ├── List of saved loans (max 20)        │
│ ├── Load button per loan                │
│ ├── Delete button (hover reveal)        │
│ └── Export all as JSON                  │
└─────────────────────────────────────────┘
```

---

## 🔢 Financial Calculations

### **1. EMI Formula (Equated Monthly Installment):**
```javascript
// Standard EMI calculation
const P = loanAmount              // Principal
const r = roi / 12 / 100          // Monthly interest rate
const n = tenureMonths            // Number of months

if (r === 0) {
  emi = P / n
} else {
  emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

totalAmount = emi * n
totalInterest = totalAmount - P
```

### **2. Repayment Schedule (Amortization):**
```javascript
let balance = P
const schedule = []

for (let i = 1; i <= n; i++) {
  const interestPart = balance * r
  const principalPart = emi - interestPart
  balance -= principalPart

  schedule.push({
    month: i,
    emi: emi,
    principal: principalPart,
    interest: interestPart,
    balance: Math.max(0, balance)
  })
}
```

### **3. Eligibility Calculation (40% Disposable Income):**
```javascript
const disposableIncome = salary - existingEMIs - expenses

// Credit score multiplier
const multipliers = {
  excellent: 0.50,  // 50% of disposable income
  good: 0.40,       // 40% of disposable income
  fair: 0.30,       // 30% of disposable income
  poor: 0.20        // 20% of disposable income
}

const maxEMI = disposableIncome * multipliers[creditScore]

// Max loan (assuming 10% ROI, 36 months)
const roi = 10 / 12 / 100
const n = 36
maxLoanAmount = maxEMI * (Math.pow(1 + roi, n) - 1) / (roi * Math.pow(1 + roi, n))
```

### **4. Foreclosure Calculation:**
```javascript
// Get balance after X months from schedule
const monthData = schedule[foreclosureMonth - 1]
const remainingPrincipal = monthData.balance

// Foreclosure charges (default 3%, editable 0-10%)
const foreclosureCharge = (remainingPrincipal * chargePercent) / 100
const totalForeclosureAmount = remainingPrincipal + foreclosureCharge

// Calculate savings
const remainingMonths = totalMonths - foreclosureMonth
const remainingEMIPayments = emi * remainingMonths
const savingsFromForeclosure = remainingEMIPayments - totalForeclosureAmount
```

### **5. Loan Comparison:**
```javascript
// Calculate both loans independently
const resultsA = calculateLoan(amountA, tenureA, roiA)
const resultsB = calculateLoan(amountB, tenureB, roiB)

// Compare
const interestDiff = resultsB.totalInterest - resultsA.totalInterest
const better = interestDiff < 0 ? 'B' : 'A'  // Lower interest is better
```

---

## 🎯 Feature Specifications

### **1. Collapsible Section Component (CollapsibleSection.jsx):**
**Props:**
- `title` (string): Section header text
- `icon` (Component): Icon component
- `defaultOpen` (boolean): Initial open state
- `children` (ReactNode): Section content
- `badge` (string|null): Optional badge (e.g., "24 months")
- `headerRight` (ReactNode): Optional right-side content

**Behavior:**
- Smooth expand/collapse animation (300ms ease-in-out)
- Chevron icon rotation (0° → 180°)
- Max height transition (0 → 3000px)
- Hover effect on header
- Active scale feedback (0.99) on click

### **2. Loan Inputs (LoanInputs.jsx):**

**Quick Presets:**
- 4 buttons: ₹5L, ₹10L, ₹20L, ₹50L
- Active state: Teal gradient + scale(1.05)
- Inactive state: Dark gray with border

**Loan Amount Slider:**
- Range: ₹10K - ₹1Cr (10,000 - 10,000,000)
- Step: ₹10,000
- Display: Indian number format with Intl.NumberFormat
- Label: "Loan Amount" (10px uppercase)
- Value: 2xl bold + teal rupee symbol

**Tenure Slider:**
- Range: 1-360 months OR 1-30 years
- Dynamic max based on tenure type
- Dropdown: Months/Years toggle
- Display: Bold number + unit

**ROI Slider:**
- Range: 0% - 30%
- Step: 0.5%
- Display: Bold number + teal % symbol

**All Sliders:**
- Teal gradient track with glow (box-shadow)
- White thumb with teal border
- Active scale: 1.1
- Real-time updates with 300ms debouncing

### **3. Charts Section (ChartsSection.jsx):**

**Pie Chart:**
- Inner radius: 60px, Outer radius: 80px
- Height: 160px (compact)
- Data: Principal (teal) vs Interest (pink)
- Labels: Percentage display
- Tooltip: Currency format
- Legend: Below chart with color indicators

**Line Chart:**
- Height: 150px (compact)
- Data: First 36 months of schedule
- X-axis: Month number
- Y-axis: Currency amount
- Two lines: Principal (teal), Interest (pink)
- Tooltip: Currency format
- No dots (smooth lines)

### **4. Schedule Table (ScheduleTable.jsx):**
- **Max height**: 256px (64 * 4px) with scroll
- **Each month card**:
  - Month number + EMI (top row, bold)
  - 3-column grid: Principal, Interest, Balance
  - Labels: 9px uppercase
  - Values: 10px with Indian currency format
- **Compact spacing**: 1.5 gap, 2 padding

### **5. Foreclosure Calculator (ForeclosureCalculator.jsx):**

**Inputs:**
1. **Foreclosure Month Slider**:
   - Range: 1 to (totalMonths - 1)
   - Display: Bold number + "months"

2. **Foreclosure Charge % Slider**:
   - Range: 0% - 10%
   - Step: 0.5%
   - Default: 3%
   - Display: Bold number + teal %

**Outputs:**
1. **Foreclosure Summary Card** (teal accent):
   - Total foreclosure amount (3xl font)
   - Remaining principal
   - Foreclosure charges breakdown

2. **Comparison Cards** (2-column grid):
   - Red card: "If You Continue" (remaining EMI payments)
   - Green card: "If You Foreclose" (one-time payment)

3. **Savings Card** (green/red based on benefit):
   - Large savings amount
   - Explanation text

4. **Detailed Breakdown Card**:
   - Paid so far
   - Remaining interest if continued
   - Remaining EMI payments
   - Net benefit (green/red)

### **6. Eligibility Checker (EligibilityChecker.jsx):**

**Inputs:**
1. **Monthly Salary Slider**: ₹10K - ₹5L (step: ₹5K)
2. **Existing EMIs Slider**: ₹0 - ₹1L (step: ₹1K)
3. **Monthly Expenses Slider**: ₹5K - ₹2L (step: ₹1K)
4. **Credit Score Buttons** (2x2 grid):
   - Excellent (green), Good (blue), Fair (yellow), Poor (red)
   - Active: Colored background + shadow
   - Inactive: Dark gray with border

**Calculation Logic:**
```javascript
disposableIncome = salary - EMIs - expenses
maxEMI = disposableIncome * creditScoreMultiplier
// Multipliers: excellent=50%, good=40%, fair=30%, poor=20%

// Max loan based on 10% ROI, 36 months
maxLoanAmount = calculateReverseLoan(maxEMI, 10, 36)
```

**Outputs:**
1. **Eligibility Rating Card** (color-coded):
   - EXCELLENT (green): ≥₹5L
   - GOOD (blue): ≥₹2L
   - FAIR (yellow): ≥₹50K
   - POOR (red): <₹50K
   - Large text: Rating + max loan amount

2. **Details Card**:
   - Disposable income
   - Max affordable EMI
   - EMI to income ratio
   - Calculation basis (10% ROI, 36 months, credit score)

3. **Recommendations** (yellow card if applicable):
   - Warning if existing EMIs > 30% of salary
   - Warning if expenses > 50% of salary
   - Credit score improvement suggestion
   - Custom messages based on situation

4. **Apply Button** (teal gradient):
   - Auto-fills main calculator with max loan amount
   - Smooth scroll to top

### **7. Loan Comparison (LoanComparison.jsx):**

**Layout:**
- Loan A card (blue border, 40% opacity)
- "VS" divider (teal background, bold)
- Loan B card (pink border, 40% opacity)
- Comparison result card (winner's color)

**Each Loan Card:**
- Editable name input (top, colored text)
- 3 sliders: Amount, Tenure, ROI
- Results display: EMI, Interest, Total
- Compact layout with 2xl value fonts

**Comparison Result:**
- Shows better loan name (large, colored)
- EMI difference (red/green)
- Interest difference (red/green)
- Total savings (large, green)
- Explanation text

### **8. Saved Loans (SavedLoans.jsx):**

**Features:**
- **Storage**: LocalStorage (max 20 loans)
- **Each saved loan card**:
  - Name + type (e.g., "Car Loan - HDFC", "Personal")
  - Monthly EMI (large, teal)
  - 3-column grid: Amount, Tenure, ROI
  - "Load into Calculator" button
  - Delete button (hover reveal, red)

**Header:**
- Count display: "X / 20 saved"
- "Export All" button (downloads JSON)

**Save Modal:**
- Name input (text field)
- Type dropdown: Personal, Home, Car, Education, Business, Other
- Save button (teal gradient)
- Cancel button (dark gray)

**Data Structure:**
```javascript
{
  id: Date.now(),
  name: "Car Loan - HDFC",
  type: "Car",
  loanAmount: 500000,
  tenure: 24,  // Always stored in months
  roi: 10,
  savedAt: ISO timestamp
}
```

### **9. Share Feature:**

**URL Sharing:**
```javascript
// Generate shareable URL
const shareUrl = `${origin}${pathname}?amount=${amount}&tenure=${months}&roi=${roi}`

// Share text
const shareText = `
Check out this loan plan:
💰 Loan: ₹5,00,000
📅 Tenure: 24 months
📈 ROI: 10%
💳 EMI: ₹25,465
`
```

**Share Methods:**
1. **Native Share API** (mobile):
   - `navigator.share()` with title, text, url
   - Shares to WhatsApp, SMS, Email, etc.

2. **Clipboard Fallback** (desktop):
   - Copy text + URL to clipboard
   - Show "Link copied!" alert

**URL Parameter Parsing:**
```javascript
// On app load, parse URL params
const params = new URLSearchParams(window.location.search)
const sharedAmount = params.get('amount')
const sharedTenure = params.get('tenure')
const sharedRoi = params.get('roi')

// Auto-fill calculator if params present
if (sharedAmount) setLoanAmount(Number(sharedAmount))
// ... etc
```

### **10. Export Feature:**

**Export as Image** (html-to-image):
- Captures collapsible sections div
- Quality: 0.95
- Format: PNG
- Filename: `loan-details.png`
- Downloads automatically

---

## 🎨 Custom Styling Details

### **Range Sliders (index.css):**
```css
input[type="range"]::-webkit-slider-track {
  background: linear-gradient(to right, #23f0c7, #7cffb2);
  height: 6px;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(35, 240, 199, 0.3);  /* Glow for visibility */
}

input[type="range"]::-webkit-slider-thumb {
  background: #FFFFFF;
  height: 28px;
  width: 28px;
  border-radius: 50%;
  margin-top: -11px;  /* Centered on 6px track */
  box-shadow: 0 4px 12px rgba(35, 240, 199, 0.6);
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(35, 240, 199, 0.8);
}
```

### **Custom Scrollbar:**
```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #23f0c7;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7cffb2;
}
```

### **Global Styles:**
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #0b0b0f;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior-y: none;  /* Prevent pull-to-refresh */
  -webkit-overflow-scrolling: touch;
}

/* Prevent zoom on input focus (mobile) */
input, select, textarea {
  font-size: 16px !important;
}

/* Disable tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 🔧 Custom Hooks

### **1. useLocalStorage Hook:**
```javascript
// Syncs state with localStorage
const [value, setValue] = useLocalStorage('key', initialValue)

// Features:
// - JSON serialization/deserialization
// - Error handling with fallback
// - Function setValue support
// - Automatic sync across tabs (via storage event)
```

### **2. useDebouncedValue Hook:**
```javascript
// Debounces value changes by specified delay
const debouncedValue = useDebouncedValue(value, 300)

// Use case: Debounce slider inputs to prevent excessive re-calculations
```

### **3. useDeviceDetect Hook:**
```javascript
const { isMobile, isTablet, isDesktop } = useDeviceDetect()

// Features:
// - User agent detection
// - Width-based detection
// - Resize event listener
// - SSR-safe initialization
```

---

## 📱 Responsive Behavior

### **Breakpoints:**
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### **Desktop Layout (≥1024px):**
```jsx
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
  <div className="w-[360px] h-[740px] bg-white rounded-[40px] border-8 border-slate-300">
    {/* Notch simulation */}
    <div className="w-40 h-7 bg-black rounded-b-3xl" />

    {/* App content */}
    <div className="h-[calc(100%-120px)]">
      <ActiveComponent />
    </div>

    {/* Bottom nav */}
  </div>
</div>
```

### **Mobile Layout (< 1024px):**
```jsx
<div className="min-h-screen bg-cred-dark flex flex-col">
  {/* Top bar with safe area */}
  <div className="sticky top-0 bg-cred-darker/95 backdrop-blur-lg">
    <div className="h-[env(safe-area-inset-top,0px)]" />
    <div className="px-6 py-4 min-h-[56px]">
      <h1>{activeTab.name}</h1>
    </div>
  </div>

  {/* Content */}
  <div className="flex-1 overflow-y-auto">
    <div className="pb-20">
      <ActiveComponent />
    </div>
  </div>

  {/* Bottom nav with safe area */}
  <div className="fixed bottom-0 bg-cred-darker/95 backdrop-blur-lg">
    <div className="h-14">{/* Tabs */}</div>
    <div className="h-[env(safe-area-inset-bottom,0px)]" />
  </div>
</div>
```

---

## 🚀 Build & Deployment

### **Scripts:**
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:android": "BUILD_TARGET=android npm run build && npx cap sync android",
  "open:android": "npx cap open android",
  "preview": "vite preview"
}
```

### **Vite Config:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.BUILD_TARGET === 'android' ? './' : '/cred-loan-app/',
})
```

### **GitHub Pages Deployment:**
- Base path: `/cred-loan-app/`
- GitHub Actions workflow for auto-deployment
- Deploys to: `https://username.github.io/cred-loan-app/`

### **Android APK Build:**
1. Run `npm run build:android`
2. Open Android Studio: `npm run open:android`
3. Build APK: Build > Build Bundle(s) / APK(s) > Build APK(s)
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
5. APK size: ~4-5 MB

### **Capacitor Config (capacitor.config.json):**
```json
{
  "appId": "com.credloan.app",
  "appName": "cred-loan-app",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

---

## ✅ Performance Optimizations

1. **Debouncing**: 300ms delay on all slider inputs
2. **LocalStorage Caching**: Persist loan inputs across sessions
3. **Lazy Calculation**: Only calculate when needed
4. **Memoization**: Reuse calculation results
5. **Compact Layout**: Reduced DOM elements (~30-40% less space)
6. **Efficient Rendering**: Collapsible sections hide unused content
7. **Code Splitting**: Vite automatic chunking
8. **Tree Shaking**: Remove unused dependencies
9. **CSS Optimization**: TailwindCSS JIT compilation

---

## 🎯 User Experience (UX) Features

### **Visual Feedback:**
- All buttons: `active:scale-95` for press feedback
- Hover states on all interactive elements
- Smooth transitions: 200-300ms duration
- Loading states with brief delay (100ms)
- Active tab indicators (teal color + top border)

### **Accessibility:**
- ARIA labels on collapsible sections
- Semantic HTML structure
- Keyboard navigation support
- High contrast text (white on dark)
- Minimum 10px font size for readability
- 48px+ touch targets on mobile

### **Mobile Optimizations:**
- No pull-to-refresh bounce
- Smooth touch scrolling
- 16px input font size (prevents zoom)
- Safe area insets for notched devices
- Backdrop blur on nav bars
- Native share API integration

### **Data Persistence:**
- Loan inputs saved to localStorage
- Auto-restore on page reload
- Saved loans survive page refresh
- Max 20 saved loans (configurable)

---

## 📊 Indian Number Formatting

All currency displays use Intl.NumberFormat:

```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Examples:
// 500000 → ₹5,00,000
// 2500000 → ₹25,00,000
```

---

## 🔍 Edge Cases & Validation

### **EMI Calculation:**
- Handle 0% interest rate (simple division)
- Handle very small tenures (1 month)
- Handle very large amounts (₹1Cr+)
- Round to 2 decimal places internally
- Display as whole currency externally

### **Foreclosure:**
- Cannot foreclose on last month (max = tenure - 1)
- Handle 0% foreclosure charge
- Handle negative savings (higher foreclosure cost)

### **Eligibility:**
- Handle negative disposable income (show error state)
- Handle very low salary (show poor rating)
- Handle 100% expenses (show cannot afford message)

### **Saved Loans:**
- Max 20 loans (show alert if full)
- Duplicate names allowed (different IDs)
- Export as valid JSON
- Handle corrupted localStorage gracefully

---

## 🎨 Icon System (Icons.jsx)

**All Icons (SVG, stroke-based):**
- Calculator, CreditCard, TrendingUp (bottom nav)
- Download, Share, ChevronDown
- Trash, Settings, Save
- Chart, Calendar, CheckCircle, Compare

**Standard Props:**
```javascript
<Icon className="w-4 h-4 text-cred-accent" />
```

**All icons use:**
- `fill="none"`
- `stroke="currentColor"`
- `strokeLinecap="round"`
- `strokeLinejoin="round"`
- `strokeWidth={2}`
- `viewBox="0 0 24 24"`

---

## 📝 Code Quality Standards

### **Component Structure:**
1. Imports (React, hooks, components, utilities)
2. Component definition with props destructuring
3. State declarations (grouped by purpose)
4. Hooks (useEffect, custom hooks)
5. Helper functions
6. Event handlers
7. JSX return (with comments for sections)
8. Export default

### **Naming Conventions:**
- Components: PascalCase (LoanCalculator.jsx)
- Hooks: camelCase with "use" prefix (useLocalStorage.js)
- Functions: camelCase (calculateEMI)
- Constants: UPPERCASE (MAX_LOANS)
- CSS classes: kebab-case or Tailwind utilities

### **Comments:**
- Section dividers with `{/* Section Name */}`
- Complex calculations explained
- Edge cases documented
- TODO markers for future enhancements

---

## 🚦 Testing Checklist

### **Functional Tests:**
- [ ] EMI calculation accuracy (compare with Excel)
- [ ] Slider interactions (all ranges)
- [ ] LocalStorage persistence
- [ ] URL parameter parsing
- [ ] Save/Load loans
- [ ] Export as image
- [ ] Share functionality
- [ ] Collapsible sections (expand/collapse)
- [ ] Tab navigation
- [ ] Foreclosure calculations
- [ ] Eligibility calculations
- [ ] Loan comparison
- [ ] Chart rendering
- [ ] Schedule table generation

### **Responsive Tests:**
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768-1023px)
- [ ] Desktop layout (≥1024px)
- [ ] Safe area insets (notched devices)
- [ ] Rotation (portrait/landscape)
- [ ] Different screen sizes

### **Browser Tests:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### **Performance Tests:**
- [ ] Load time < 2 seconds
- [ ] Slider lag test (rapid movement)
- [ ] Large schedule generation (360 months)
- [ ] Multiple saved loans (20)
- [ ] Chart rendering performance

---

## 🎯 Future Enhancements (Not Implemented)

1. **Advanced Calculator Modes:**
   - Calculate ROI (given EMI)
   - Calculate Tenure (given max EMI)
   - Calculate Loan Amount (given max EMI)

2. **Loan Disbursal Tab:**
   - Track actual disbursals
   - Pending approvals
   - Document upload

3. **Credit Score Tab:**
   - Credit score tracking
   - Score improvement tips
   - Score history graph

4. **Additional Features:**
   - Dark/Light theme toggle
   - Multiple currency support
   - PDF export (not just image)
   - Email sharing
   - Loan reminders/notifications
   - Prepayment calculator
   - Tax benefits calculator

---

## 📦 Final Deliverables

### **Repository Structure:**
```
cred-loan-app/
├── src/                    # Source code (2,577 lines)
├── public/                 # Static assets
├── dist/                   # Build output (auto-generated)
├── android/                # Capacitor Android project
├── node_modules/           # Dependencies
├── .github/workflows/      # GitHub Actions
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── capacitor.config.json   # Capacitor configuration
└── index.html              # Entry point
```

### **Deployment Artifacts:**
1. **Web App**: Deployed to GitHub Pages
2. **Android APK**: 4-5 MB debug APK
3. **Documentation**: This prompt (comprehensive guide)

---

## 🎓 Key Learnings & Best Practices

### **React Patterns:**
- Custom hooks for reusability
- Controlled components for forms
- Debouncing for performance
- LocalStorage for persistence
- Component composition (extract reusable parts)

### **Financial Calculations:**
- EMI formula (standard loan calculation)
- Amortization schedule generation
- Reverse calculation (eligibility)
- Foreclosure impact analysis

### **UX Design:**
- Progressive disclosure (collapsible sections)
- Visual hierarchy (fonts, colors, spacing)
- Mobile-first responsive design
- Touch-friendly interactions
- Immediate feedback on actions

### **Performance:**
- Debounce expensive calculations
- Lazy load collapsed content
- Optimize re-renders
- Use memoization where applicable

### **Deployment:**
- GitHub Pages for web
- Capacitor for native Android
- Environment-based base path
- Automated CI/CD with GitHub Actions

---

## 🎯 Success Criteria

✅ **Functional**: All calculations accurate within 0.01 INR
✅ **Responsive**: Works on all devices (mobile, tablet, desktop)
✅ **Performance**: < 2s load time, smooth 60fps interactions
✅ **Accessible**: WCAG 2.1 AA compliant (contrast, touch targets)
✅ **Compact**: ~30-40% space reduction, minimal scrolling
✅ **Production-Ready**: Deployed to web + Android APK available

---

## 📚 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI framework |
| react-dom | 19.1.1 | DOM rendering |
| vite | 7.1.7 | Build tool |
| tailwindcss | 3.4.18 | Styling |
| recharts | 3.2.1 | Charts |
| html-to-image | 1.11.13 | Export |
| @capacitor/android | 7.4.3 | Native Android |
| @capacitor/core | 7.4.3 | Native core |

**Total Size**: ~587 KB JS, ~26 KB CSS (gzipped: ~174 KB JS, ~5 KB CSS)

---

## 🏁 Conclusion

This prompt describes a **production-ready, feature-rich loan calculator application** with:
- **8 major features** (EMI, Eligibility, Foreclosure, Comparison, Saved Loans, Charts, Schedule, Share)
- **13 React components** (~2,577 lines of code)
- **Dark theme design** (CRED-inspired)
- **Compact layout** (30-40% space reduction)
- **Mobile-first responsive** (works on all devices)
- **Native Android support** (via Capacitor)
- **LocalStorage persistence** (state survives refresh)
- **Accurate financial calculations** (standard EMI formulas)
- **Excellent UX** (smooth animations, visual feedback, accessibility)

**Build this app exactly as described to create a professional loan calculator suitable for fintech companies, banks, or personal finance tools.**

---

**End of Comprehensive Build Prompt**
