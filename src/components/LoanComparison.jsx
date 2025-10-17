import { useState, useEffect } from 'react'

const LoanComparison = ({ formatCurrency, formatNumber }) => {
  // Loan A
  const [loanAmountA, setLoanAmountA] = useState(500000)
  const [tenureA, setTenureA] = useState(24)
  const [roiA, setRoiA] = useState(10)
  const [loanNameA, setLoanNameA] = useState('Loan A')

  // Loan B
  const [loanAmountB, setLoanAmountB] = useState(500000)
  const [tenureB, setTenureB] = useState(36)
  const [roiB, setRoiB] = useState(12)
  const [loanNameB, setLoanNameB] = useState('Loan B')

  const [resultsA, setResultsA] = useState(null)
  const [resultsB, setResultsB] = useState(null)

  useEffect(() => {
    setResultsA(calculateLoan(loanAmountA, tenureA, roiA))
  }, [loanAmountA, tenureA, roiA])

  useEffect(() => {
    setResultsB(calculateLoan(loanAmountB, tenureB, roiB))
  }, [loanAmountB, tenureB, roiB])

  const calculateLoan = (amount, tenure, roi) => {
    const P = amount
    const r = roi / 12 / 100
    const n = tenure

    let emi = 0
    if (r === 0) {
      emi = P / n
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    }

    const totalAmount = emi * n
    const totalInterest = totalAmount - P

    return { emi, totalAmount, totalInterest, principal: P }
  }

  const getDifference = () => {
    if (!resultsA || !resultsB) return null

    const emiDiff = resultsB.emi - resultsA.emi
    const interestDiff = resultsB.totalInterest - resultsA.totalInterest
    const totalDiff = resultsB.totalAmount - resultsA.totalAmount

    const better = interestDiff < 0 ? 'B' : 'A'

    return { emiDiff, interestDiff, totalDiff, better }
  }

  const diff = getDifference()

  return (
    <div className="space-y-4">
      {/* Loan A */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-blue-500/40">
        <input
          type="text"
          value={loanNameA}
          onChange={(e) => setLoanNameA(e.target.value)}
          className="bg-transparent text-blue-400 font-bold text-sm mb-3 outline-none border-b border-blue-500/30 pb-1 w-full"
          placeholder="Loan A Name"
        />

        <div className="space-y-3">
          {/* Amount */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">Amount</label>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-blue-400 text-lg font-bold">₹</span>
              <div className="text-white text-2xl font-bold">{formatNumber(loanAmountA)}</div>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loanAmountA}
              onChange={(e) => setLoanAmountA(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">Tenure (Months)</label>
            <div className="text-white text-2xl font-bold mt-1">{tenureA}</div>
            <input
              type="range"
              min="1"
              max="360"
              value={tenureA}
              onChange={(e) => setTenureA(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* ROI */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">ROI (p.a.)</label>
            <div className="flex items-baseline gap-1 mt-1">
              <div className="text-white text-2xl font-bold">{roiA}</div>
              <span className="text-blue-400 text-xl font-bold">%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={roiA}
              onChange={(e) => setRoiA(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Results A */}
        {resultsA && (
          <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">EMI</span>
              <span className="text-white font-bold">{formatCurrency(resultsA.emi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Interest</span>
              <span className="text-blue-400 font-bold">{formatCurrency(resultsA.totalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Payable</span>
              <span className="text-white font-bold">{formatCurrency(resultsA.totalAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* VS Divider */}
      <div className="flex items-center justify-center">
        <div className="bg-cred-accent text-black font-extrabold text-sm px-4 py-2 rounded-full">
          VS
        </div>
      </div>

      {/* Loan B */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-pink-500/40">
        <input
          type="text"
          value={loanNameB}
          onChange={(e) => setLoanNameB(e.target.value)}
          className="bg-transparent text-pink-400 font-bold text-sm mb-3 outline-none border-b border-pink-500/30 pb-1 w-full"
          placeholder="Loan B Name"
        />

        <div className="space-y-3">
          {/* Amount */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">Amount</label>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-pink-400 text-lg font-bold">₹</span>
              <div className="text-white text-2xl font-bold">{formatNumber(loanAmountB)}</div>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loanAmountB}
              onChange={(e) => setLoanAmountB(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">Tenure (Months)</label>
            <div className="text-white text-2xl font-bold mt-1">{tenureB}</div>
            <input
              type="range"
              min="1"
              max="360"
              value={tenureB}
              onChange={(e) => setTenureB(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* ROI */}
          <div>
            <label className="text-gray-400 text-[10px] font-medium uppercase">ROI (p.a.)</label>
            <div className="flex items-baseline gap-1 mt-1">
              <div className="text-white text-2xl font-bold">{roiB}</div>
              <span className="text-pink-400 text-xl font-bold">%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={roiB}
              onChange={(e) => setRoiB(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Results B */}
        {resultsB && (
          <div className="mt-4 pt-4 border-t border-pink-500/20 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">EMI</span>
              <span className="text-white font-bold">{formatCurrency(resultsB.emi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Interest</span>
              <span className="text-pink-400 font-bold">{formatCurrency(resultsB.totalInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Payable</span>
              <span className="text-white font-bold">{formatCurrency(resultsB.totalAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Result */}
      {diff && (
        <div className={`p-5 rounded-xl border-2 ${
          diff.better === 'A'
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-pink-500/10 border-pink-500/30'
        }`}>
          <div className="text-center mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Better Option</p>
            <p className={`text-4xl font-extrabold ${
              diff.better === 'A' ? 'text-blue-400' : 'text-pink-400'
            }`}>
              {diff.better === 'A' ? loanNameA : loanNameB}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">EMI Difference</span>
              <span className={`font-bold ${diff.emiDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {diff.emiDiff > 0 ? '+' : ''}{formatCurrency(Math.abs(diff.emiDiff))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Interest Difference</span>
              <span className={`font-bold ${diff.interestDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {diff.interestDiff > 0 ? '+' : ''}{formatCurrency(Math.abs(diff.interestDiff))}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-white font-semibold">Total Savings</span>
              <span className="text-green-400 font-bold text-lg">
                {formatCurrency(Math.abs(diff.interestDiff))}
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-xs text-center mt-4">
            {diff.better === 'A' ? loanNameA : loanNameB} saves you {formatCurrency(Math.abs(diff.interestDiff))} in interest
          </p>
        </div>
      )}
    </div>
  )
}

export default LoanComparison
