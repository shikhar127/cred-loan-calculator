import { useState, useEffect } from 'react'

const EligibilityChecker = ({ formatCurrency, onApplyToCalculator }) => {
  const [monthlySalary, setMonthlySalary] = useState(50000)
  const [existingEMIs, setExistingEMIs] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(15000)
  const [creditScore, setCreditScore] = useState('good')
  const [eligibilityData, setEligibilityData] = useState(null)

  useEffect(() => {
    calculateEligibility()
  }, [monthlySalary, existingEMIs, monthlyExpenses, creditScore])

  const calculateEligibility = () => {
    // Calculate disposable income
    const disposableIncome = monthlySalary - existingEMIs - monthlyExpenses

    // Credit score multiplier (40% base)
    const creditScoreMultipliers = {
      excellent: 0.50, // 50% of disposable income
      good: 0.40,      // 40% of disposable income
      fair: 0.30,      // 30% of disposable income
      poor: 0.20,      // 20% of disposable income
    }

    const multiplier = creditScoreMultipliers[creditScore] || 0.40

    // Maximum affordable EMI
    const maxEMI = Math.max(0, disposableIncome * multiplier)

    // Calculate max loan amount (assuming 10% ROI, 3 years tenure)
    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
    const roi = 10 / 12 / 100 // 10% annual = 0.833% monthly
    const tenureMonths = 36 // 3 years default

    let maxLoanAmount = 0
    if (roi === 0) {
      maxLoanAmount = maxEMI * tenureMonths
    } else {
      maxLoanAmount = maxEMI * (Math.pow(1 + roi, tenureMonths) - 1) / (roi * Math.pow(1 + roi, tenureMonths))
    }

    // Eligibility rating
    let rating = 'POOR'
    let ratingColor = 'red'
    if (maxLoanAmount >= 500000) {
      rating = 'EXCELLENT'
      ratingColor = 'green'
    } else if (maxLoanAmount >= 200000) {
      rating = 'GOOD'
      ratingColor = 'blue'
    } else if (maxLoanAmount >= 50000) {
      rating = 'FAIR'
      ratingColor = 'yellow'
    }

    // Recommendations
    const recommendations = []
    if (existingEMIs > monthlySalary * 0.3) {
      recommendations.push('⚠️ Your existing EMIs are high. Consider paying them off first.')
    }
    if (monthlyExpenses > monthlySalary * 0.5) {
      recommendations.push('⚠️ Your expenses are over 50% of salary. Try reducing them.')
    }
    if (creditScore === 'poor' || creditScore === 'fair') {
      recommendations.push('💡 Improve your credit score for better eligibility.')
    }
    if (disposableIncome < 0) {
      recommendations.push('❌ Your expenses exceed your income. Cannot afford a loan.')
    }
    if (maxLoanAmount < 50000 && disposableIncome > 0) {
      recommendations.push('💡 Consider a longer tenure or reduce existing commitments.')
    }

    setEligibilityData({
      disposableIncome,
      maxEMI,
      maxLoanAmount,
      rating,
      ratingColor,
      multiplier,
      recommendations,
    })
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num))
  }

  const handleApplyToCalculator = () => {
    if (eligibilityData && eligibilityData.maxLoanAmount > 0) {
      onApplyToCalculator(Math.round(eligibilityData.maxLoanAmount))
    }
  }

  return (
    <div className="space-y-4">
      {/* Input Fields */}
      <div className="space-y-4">
        {/* Monthly Salary */}
        <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Monthly Salary</label>
          <div className="flex items-baseline gap-2 mt-2 mb-1">
            <span className="text-cred-accent text-xl font-bold">₹</span>
            <div className="text-white text-3xl font-bold tracking-tight">
              {formatNumber(monthlySalary)}
            </div>
          </div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full mt-3"
          />
          <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
            <span>₹10K</span>
            <span>₹5L</span>
          </div>
        </div>

        {/* Existing EMIs */}
        <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Existing EMIs/Month</label>
          <div className="flex items-baseline gap-2 mt-2 mb-1">
            <span className="text-cred-accent text-xl font-bold">₹</span>
            <div className="text-white text-3xl font-bold tracking-tight">
              {formatNumber(existingEMIs)}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={existingEMIs}
            onChange={(e) => setExistingEMIs(Number(e.target.value))}
            className="w-full mt-3"
          />
          <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹1L</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Monthly Expenses</label>
          <div className="flex items-baseline gap-2 mt-2 mb-1">
            <span className="text-cred-accent text-xl font-bold">₹</span>
            <div className="text-white text-3xl font-bold tracking-tight">
              {formatNumber(monthlyExpenses)}
            </div>
          </div>
          <input
            type="range"
            min="5000"
            max="200000"
            step="1000"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full mt-3"
          />
          <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
            <span>₹5K</span>
            <span>₹2L</span>
          </div>
        </div>

        {/* Credit Score */}
        <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3 block">Credit Score</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCreditScore('excellent')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                creditScore === 'excellent'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-cred-darker text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Excellent
            </button>
            <button
              onClick={() => setCreditScore('good')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                creditScore === 'good'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-cred-darker text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Good
            </button>
            <button
              onClick={() => setCreditScore('fair')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                creditScore === 'fair'
                  ? 'bg-yellow-500 text-black shadow-lg'
                  : 'bg-cred-darker text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Fair
            </button>
            <button
              onClick={() => setCreditScore('poor')}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                creditScore === 'poor'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-cred-darker text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              Poor
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {eligibilityData && (
        <>
          {/* Main Result */}
          <div className={`p-5 rounded-xl border-2 ${
            eligibilityData.ratingColor === 'green' ? 'bg-green-500/10 border-green-500/30' :
            eligibilityData.ratingColor === 'blue' ? 'bg-blue-500/10 border-blue-500/30' :
            eligibilityData.ratingColor === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Your Eligibility</p>
              <p className={`text-5xl font-extrabold mb-2 ${
                eligibilityData.ratingColor === 'green' ? 'text-green-400' :
                eligibilityData.ratingColor === 'blue' ? 'text-blue-400' :
                eligibilityData.ratingColor === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {eligibilityData.rating}
              </p>
              <p className="text-white text-sm">
                You can afford a loan up to
              </p>
              <p className="text-white text-3xl font-bold mt-2">
                {formatCurrency(eligibilityData.maxLoanAmount)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Disposable Income</span>
              <span className="text-white font-semibold">{formatCurrency(eligibilityData.disposableIncome)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Max Affordable EMI</span>
              <span className="text-cred-accent font-bold">{formatCurrency(eligibilityData.maxEMI)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">EMI to Income Ratio</span>
              <span className="text-white font-semibold">{Math.round(eligibilityData.multiplier * 100)}%</span>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <p className="text-gray-400 text-xs mb-2">Based on:</p>
              <p className="text-gray-500 text-xs">10% ROI • 36 months tenure • {creditScore.toUpperCase()} credit</p>
            </div>
          </div>

          {/* Recommendations */}
          {eligibilityData.recommendations.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
              <h4 className="text-yellow-400 text-xs font-semibold uppercase tracking-wide mb-2">Recommendations</h4>
              <ul className="space-y-1.5">
                {eligibilityData.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-gray-300 text-xs leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Button */}
          {eligibilityData.maxLoanAmount > 0 && (
            <button
              onClick={handleApplyToCalculator}
              className="w-full bg-gradient-to-r from-cred-accent to-cred-accent-light text-black font-bold py-4 rounded-xl shadow-lg shadow-cred-accent/30 hover:shadow-cred-accent/50 transition-all duration-200 active:scale-95"
            >
              Apply ₹{formatNumber(eligibilityData.maxLoanAmount)} to Calculator
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default EligibilityChecker
