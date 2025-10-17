import { useState, useEffect } from 'react'

const ForeclosureCalculator = ({ results, formatCurrency, loanAmount, tenure, tenureType }) => {
  const [foreclosureMonth, setForeclosureMonth] = useState(12)
  const [foreclosureChargePercent, setForeclosureChargePercent] = useState(3)
  const [foreclosureData, setForeclosureData] = useState(null)

  const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure

  useEffect(() => {
    if (!results || !results.schedule) return

    const monthData = results.schedule[foreclosureMonth - 1]
    if (!monthData) return

    const remainingPrincipal = monthData.balance
    const foreclosureCharge = (remainingPrincipal * foreclosureChargePercent) / 100
    const totalForeclosureAmount = remainingPrincipal + foreclosureCharge

    // Calculate remaining EMIs if continued
    const remainingMonths = tenureMonths - foreclosureMonth
    const remainingEMIPayments = results.emi * remainingMonths

    // Calculate remaining interest if continued
    const paidSoFar = results.emi * foreclosureMonth
    const remainingInterest = results.schedule.slice(foreclosureMonth).reduce((sum, month) => sum + month.interest, 0)

    const savingsFromForeclosure = remainingEMIPayments - totalForeclosureAmount

    setForeclosureData({
      remainingPrincipal,
      foreclosureCharge,
      totalForeclosureAmount,
      remainingMonths,
      remainingEMIPayments,
      remainingInterest,
      savingsFromForeclosure,
      paidSoFar,
    })
  }, [foreclosureMonth, foreclosureChargePercent, results, tenureMonths])

  if (!results) {
    return (
      <div className="text-center py-8 text-cred-brown text-sm">
        Calculate your loan first to plan foreclosure
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Foreclosure Month Selector */}
      <div className="bg-white p-4 rounded-xl border-2 border-cred-brown/20">
        <label className="text-cred-brown text-xs font-medium uppercase tracking-wide">Foreclose After (Months)</label>
        <div className="flex items-baseline gap-2 mt-2 mb-1">
          <div className="text-cred-brown-dark text-3xl font-bold tracking-tight">{foreclosureMonth}</div>
          <span className="text-cred-brown text-sm">months</span>
        </div>
        <input
          type="range"
          min="1"
          max={tenureMonths - 1}
          value={foreclosureMonth}
          onChange={(e) => setForeclosureMonth(Number(e.target.value))}
          className="w-full mt-3"
        />
        <div className="flex justify-between text-xs font-medium text-cred-brown mt-2">
          <span>1 month</span>
          <span>{tenureMonths - 1} months</span>
        </div>
      </div>

      {/* Foreclosure Charge % */}
      <div className="bg-white p-4 rounded-xl border-2 border-cred-brown/20">
        <label className="text-cred-brown text-xs font-medium uppercase tracking-wide">Foreclosure Charges (%)</label>
        <div className="flex items-baseline gap-2 mt-2 mb-1">
          <div className="text-cred-brown-dark text-3xl font-bold tracking-tight">{foreclosureChargePercent}</div>
          <span className="text-cred-orange text-2xl font-bold">%</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={foreclosureChargePercent}
          onChange={(e) => setForeclosureChargePercent(Number(e.target.value))}
          className="w-full mt-3"
        />
        <div className="flex justify-between text-xs font-medium text-cred-brown mt-2">
          <span>0%</span>
          <span>10%</span>
        </div>
      </div>

      {/* Results */}
      {foreclosureData && (
        <>
          {/* Foreclosure Summary */}
          <div className="bg-gradient-to-br from-cred-orange/20 to-cred-orange-dark/10 p-4 rounded-xl border-2 border-cred-orange/30">
            <p className="text-cred-brown text-xs uppercase tracking-wide mb-1">Total Foreclosure Amount</p>
            <p className="text-cred-brown-dark text-3xl font-extrabold">{formatCurrency(foreclosureData.totalForeclosureAmount)}</p>
            <div className="mt-3 pt-3 border-t border-cred-orange/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-cred-brown">Remaining Principal</span>
                <span className="text-cred-brown-dark font-semibold">{formatCurrency(foreclosureData.remainingPrincipal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cred-brown">Foreclosure Charges ({foreclosureChargePercent}%)</span>
                <span className="text-cred-orange-dark font-semibold">+ {formatCurrency(foreclosureData.foreclosureCharge)}</span>
              </div>
            </div>
          </div>

          {/* Comparison: Foreclose vs Continue */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-500/10 border-2 border-red-500/30 p-3 rounded-xl">
              <p className="text-red-400 text-[10px] uppercase tracking-wide mb-1">If You Continue</p>
              <p className="text-cred-brown-dark text-xl font-bold">{formatCurrency(foreclosureData.remainingEMIPayments)}</p>
              <p className="text-cred-brown text-[10px] mt-1">{foreclosureData.remainingMonths} EMIs left</p>
            </div>
            <div className="bg-green-500/10 border-2 border-green-500/30 p-3 rounded-xl">
              <p className="text-green-400 text-[10px] uppercase tracking-wide mb-1">If You Foreclose</p>
              <p className="text-cred-brown-dark text-xl font-bold">{formatCurrency(foreclosureData.totalForeclosureAmount)}</p>
              <p className="text-cred-brown text-[10px] mt-1">One-time payment</p>
            </div>
          </div>

          {/* Savings */}
          <div className={`p-4 rounded-xl border-2 ${
            foreclosureData.savingsFromForeclosure > 0
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className="text-cred-brown text-xs uppercase tracking-wide mb-1">
              {foreclosureData.savingsFromForeclosure > 0 ? 'You Save' : 'Additional Cost'}
            </p>
            <p className={`text-3xl font-extrabold ${
              foreclosureData.savingsFromForeclosure > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(Math.abs(foreclosureData.savingsFromForeclosure))}
            </p>
            <p className="text-cred-brown text-xs mt-2">
              {foreclosureData.savingsFromForeclosure > 0
                ? 'By foreclosing now, you avoid future interest payments'
                : 'Foreclosure charges exceed the remaining interest'}
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white p-4 rounded-xl border-2 border-cred-brown/20 space-y-2 text-xs">
            <h4 className="text-cred-brown-dark font-semibold uppercase tracking-wide mb-3">Detailed Breakdown</h4>
            <div className="flex justify-between">
              <span className="text-cred-brown">Paid So Far ({foreclosureMonth} months)</span>
              <span className="text-cred-brown-dark font-medium">{formatCurrency(foreclosureData.paidSoFar)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cred-brown">Remaining Interest (if continued)</span>
              <span className="text-cred-brown-dark font-medium">{formatCurrency(foreclosureData.remainingInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cred-brown">Remaining EMI Payments</span>
              <span className="text-cred-brown-dark font-medium">{formatCurrency(foreclosureData.remainingEMIPayments)}</span>
            </div>
            <div className="pt-2 border-t border-cred-brown/20 flex justify-between">
              <span className="text-cred-orange font-semibold">Net Benefit of Foreclosure</span>
              <span className={`font-bold ${
                foreclosureData.savingsFromForeclosure > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {foreclosureData.savingsFromForeclosure > 0 ? '+' : '-'} {formatCurrency(Math.abs(foreclosureData.savingsFromForeclosure))}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ForeclosureCalculator
