import { useState, useRef, useEffect } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { toPng } from 'html-to-image'
import { Download, Share, ChevronDown } from './Icons'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useLocalStorage('loanAmount', 500000)
  const [tenure, setTenure] = useLocalStorage('tenure', 24)
  const [tenureType, setTenureType] = useLocalStorage('tenureType', 'months')
  const [roi, setRoi] = useLocalStorage('roi', 10)
  const [processingFee, setProcessingFee] = useState(1000)
  const [feeType, setFeeType] = useState('flat')
  const [loanType, setLoanType] = useState('Personal')
  const [showDetails, setShowDetails] = useState(false)
  const [results, setResults] = useState(null)
  const exportRef = useRef(null)

  // Debounced values for real-time calculation
  const debouncedLoanAmount = useDebouncedValue(loanAmount, 300)
  const debouncedTenure = useDebouncedValue(tenure, 300)
  const debouncedRoi = useDebouncedValue(roi, 300)

  // Auto-calculate on load and when values change
  useEffect(() => {
    calculateEMI()
  }, [debouncedLoanAmount, debouncedTenure, tenureType, debouncedRoi, processingFee, feeType])

  const calculateEMI = () => {
    const P = loanAmount
    const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure
    const r = roi / 12 / 100
    const n = tenureMonths

    let emi = 0
    if (r === 0) {
      emi = P / n
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    }

    const totalAmount = emi * n
    const totalInterest = totalAmount - P
    const actualFee = feeType === 'flat' ? processingFee : (P * processingFee) / 100

    // Generate repayment schedule
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
        balance: Math.max(0, balance),
      })
    }

    // Generate line chart data (first 36 months)
    const chartData = schedule.slice(0, Math.min(36, n)).map(item => ({
      month: item.month,
      Principal: item.principal,
      Interest: item.interest,
    }))

    setResults({
      emi,
      totalAmount,
      totalInterest,
      processingFee: actualFee,
      schedule,
      chartData,
      principal: P,
    })

    // Console test cases
    console.log('EMI Calculation Test:')
    console.log(`Loan: ₹${P}, ROI: ${roi}%, Tenure: ${n} months`)
    console.log(`EMI: ₹${emi.toFixed(2)}`)
    console.log(`Total Interest: ₹${totalInterest.toFixed(2)}`)
    console.log(`Final Balance: ₹${schedule[schedule.length - 1].balance.toFixed(2)}`)
  }

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

  const exportAsImage = async () => {
    if (exportRef.current) {
      try {
        const dataUrl = await toPng(exportRef.current, { quality: 0.95 })
        const link = document.createElement('a')
        link.download = 'repayment-schedule.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Failed to export:', err)
      }
    }
  }

  const shareAsImage = async () => {
    if (exportRef.current) {
      try {
        const dataUrl = await toPng(exportRef.current, { quality: 0.95 })
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'repayment-schedule.png', { type: 'image/png' })

        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'EMI Repayment Schedule',
          })
        } else {
          exportAsImage()
        }
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  // Quick preset amounts
  const presets = [
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹20L', value: 2000000 },
    { label: '₹50L', value: 5000000 },
  ]

  return (
    <div className="px-5 py-6 pb-24 space-y-6">
      {/* Hero EMI Display - Show immediately */}
      {results && (
        <div className="bg-gradient-to-br from-cred-accent/20 to-cred-accent-light/10 p-6 rounded-3xl border-2 border-cred-accent/30 shadow-lg">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Your Monthly EMI</p>
          <p className="text-white text-5xl font-extrabold leading-tight">{formatCurrency(results.emi)}</p>
          <p className="text-gray-400 text-sm mt-1">per month</p>
          <div className="mt-4 pt-4 border-t border-cred-accent/20 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs">Total Payable</p>
              <p className="text-white text-lg font-bold">{formatCurrency(results.totalAmount)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Interest</p>
              <p className="text-cred-accent-light text-lg font-bold">{formatCurrency(results.totalInterest)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-3">Quick Select Loan Amount</p>
        <div className="grid grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setLoanAmount(preset.value)}
              className={`py-4 px-2 rounded-xl font-bold text-base transition-all duration-200 ${
                loanAmount === preset.value
                  ? 'bg-gradient-to-br from-cred-accent to-cred-accent-light text-black shadow-lg shadow-cred-accent/30 scale-105'
                  : 'bg-cred-darker/70 text-gray-400 hover:bg-cred-darker hover:text-white border-2 border-gray-800 active:scale-95'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-5">
        {/* Loan Amount */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-5 rounded-2xl border-2 border-gray-800">
          <label className="text-gray-400 text-sm font-medium uppercase tracking-wide">Loan Amount</label>
          <div className="flex items-baseline gap-2 mt-3 mb-1">
            <span className="text-cred-accent text-2xl font-bold">₹</span>
            <div className="text-white text-4xl font-bold tracking-tight">
              {formatNumber(loanAmount)}
            </div>
          </div>
          <div className="text-gray-500 text-xs mb-4">Slide to adjust or tap the amount above to edit</div>
          <input
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-sm font-semibold text-gray-400 mt-3">
            <span>₹10K</span>
            <span>₹10Cr (Max)</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-5 rounded-2xl border-2 border-gray-800">
          <label className="text-gray-400 text-sm font-medium uppercase tracking-wide">Tenure</label>
          <div className="flex items-center gap-3 mt-3 mb-1">
            <div className="text-white text-4xl font-bold tracking-tight">
              {tenure}
            </div>
            <select
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value)}
              className="bg-cred-darker text-cred-accent px-4 py-2 rounded-xl outline-none text-lg font-semibold border-2 border-cred-accent/20"
            >
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <div className="text-gray-500 text-xs mb-4">Slide to adjust repayment period</div>
          <input
            type="range"
            min="1"
            max={tenureType === 'years' ? 30 : 360}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-sm font-semibold text-gray-400 mt-3">
            <span>1 {tenureType === 'years' ? 'Year' : 'Month'}</span>
            <span>{tenureType === 'years' ? '30 Years' : '360 Months'} (Max)</span>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-5 rounded-2xl border-2 border-gray-800">
          <label className="text-gray-400 text-sm font-medium uppercase tracking-wide">Interest Rate (p.a.)</label>
          <div className="flex items-baseline gap-2 mt-3 mb-1">
            <div className="text-white text-4xl font-bold tracking-tight">
              {roi}
            </div>
            <span className="text-cred-accent text-3xl font-bold">%</span>
          </div>
          <div className="text-gray-500 text-xs mb-4">Slide to adjust annual interest rate</div>
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={roi}
            onChange={(e) => setRoi(Number(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-sm font-semibold text-gray-400 mt-3">
            <span>0% (Min)</span>
            <span>30% (Max)</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      {results && (
        <div ref={exportRef} className="space-y-5 bg-cred-dark rounded-2xl">
          {/* Pie Chart */}
          <div className="bg-cred-darker/50 p-5 rounded-2xl border border-gray-800">
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Payment Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Principal', value: results.principal },
                    { name: 'Interest', value: results.totalInterest },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  <Cell fill="#23f0c7" />
                  <Cell fill="#f093fb" />
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#121318', border: '1px solid #23f0c7', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cred-accent rounded"></div>
                <span className="text-gray-400 text-xs">Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-400 rounded"></div>
                <span className="text-gray-400 text-xs">Interest</span>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          {results.chartData.length > 0 && (
            <div className="bg-cred-darker/50 p-5 rounded-2xl border border-gray-800">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
                Principal vs Interest Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={results.chartData}>
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#121318', border: '1px solid #23f0c7', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="Principal" stroke="#23f0c7" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Interest" stroke="#f093fb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 px-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-cred-darker border-2 border-cred-accent/30 text-cred-accent py-4 rounded-2xl font-bold hover:bg-cred-accent/10 transition active:scale-95"
            >
              {showDetails ? 'Hide' : 'View'} Schedule
            </button>
            <button
              onClick={exportAsImage}
              className="bg-cred-darker border-2 border-cred-accent/30 text-cred-accent p-4 rounded-2xl hover:bg-cred-accent/10 transition active:scale-95"
            >
              <Download className="w-6 h-6" />
            </button>
            <button
              onClick={shareAsImage}
              className="bg-cred-darker border-2 border-cred-accent/30 text-cred-accent p-4 rounded-2xl hover:bg-cred-accent/10 transition active:scale-95"
            >
              <Share className="w-6 h-6" />
            </button>
          </div>

          {/* Repayment Schedule */}
          {showDetails && (
            <div className="bg-cred-darker/50 p-5 rounded-2xl border border-gray-800 max-h-96 overflow-y-auto">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide sticky top-0 bg-cred-darker/90 pb-2">
                Month-wise Schedule
              </h3>
              <div className="space-y-2">
                {results.schedule.map((item) => (
                  <div key={item.month} className="bg-cred-dark p-4 rounded-xl text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cred-accent font-bold">Month {item.month}</span>
                      <span className="text-white font-bold text-sm">{formatCurrency(item.emi)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-gray-400">
                      <div>
                        <div className="text-[10px] uppercase">Principal</div>
                        <div className="text-white text-xs">{formatCurrency(item.principal)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase">Interest</div>
                        <div className="text-white text-xs">{formatCurrency(item.interest)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase">Balance</div>
                        <div className="text-white text-xs">{formatCurrency(item.balance)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
