# CRED-Style Fintech Loan App

A mobile-first, CRED-inspired fintech utility app built with React, TailwindCSS, and Recharts. Features a beautiful dark theme with mint green accents and smooth animations.

**Live Web App:** https://shikhar127.github.io/cred-loan-app/

**Android APK:** Available! See [BUILD_APK.md](BUILD_APK.md) for instructions.

## Features

### Tab 1: Loan Calculator
- **EMI Calculation**: Calculate monthly installments with interactive sliders
- **Visual Analytics**:
  - Pie chart showing principal vs interest breakdown
  - Line chart displaying 36-month payment trend
- **Detailed Schedule**: Month-by-month repayment breakdown
- **Export & Share**: Download or share repayment schedule as JPEG
- **Inputs**:
  - Loan amount (₹10,000 - ₹1 Crore)
  - Tenure (months/years)
  - Interest rate (% p.a.)
  - Processing fee (flat or percentage)
  - Loan type selection

### Tab 2: Loan Disbursal Flow
- **Step 1: Permissions**
  - Mock SMS read access
  - Mock Account Aggregator data upload
- **Step 2: Disbursal**
  - Dynamic loan limit (randomly generated)
  - Amount and tenure selection
  - Instant approval simulation
  - Success confirmation screen

### Tab 3: Credit Score Checker
- **Score Generation**: Mock credit score (600-800 range)
- **Score Breakdown**: Visual indicators and categories
- **Historical Trend**: 12-month score history with line chart
- **Influencing Factors**: Breakdown of what affects credit score
- **Inputs**: Phone number & PAN (mock validation)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **html-to-image** - Image export functionality

## Design Language

Inspired by CRED's premium design:
- Deep charcoal backgrounds (#0b0b0f, #121318)
- Mint green accent gradients (#23f0c7 → #7cffb2)
- Bold typography with generous spacing
- Smooth transitions and subtle shadows
- Mobile-first, app-like experience (360×740px frame)

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## EMI Calculation Formula

```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

Where:
- P = Principal loan amount
- R = Monthly interest rate (annual rate / 12 / 100)
- N = Number of monthly installments
```

## Test Cases (Console Logged)

- Sanity check: ₹1,00,000 @10% for 12 months ≈ ₹8,791.59
- Zero interest handling
- Schedule integrity (final balance ≈ 0)
- Edge cases: 0 months → EMI=0

## Mock Data Notice

**All features are purely simulated:**
- No real API calls
- No actual data collection
- No real credit bureau integration
- Demo purposes only

## Screenshots

The app displays in a mobile frame (360×740px) with:
- Rounded corners and device notch
- Bottom tab navigation
- Smooth scrolling content area
- Sticky CTAs for thumb reach

## Building Android APK

This app can be built as an installable Android APK! See [BUILD_APK.md](BUILD_APK.md) for detailed instructions.

**Quick Start:**
```bash
# Install dependencies (if not already done)
npm install

# Build for Android
npm run build:android

# Open in Android Studio
npm run open:android

# Build APK in Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**Requirements:**
- JDK 17+
- Android Studio
- Android SDK

The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

## License

MIT

---

Built with React + TailwindCSS + Recharts

