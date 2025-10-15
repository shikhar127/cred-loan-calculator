import { useState, useRef } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { toPng } from 'html-to-image'
import { Download, Share, ChevronDown } from './Icons'

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [tenure, setTenure] = useState(12)
  const [tenureType, setTenureType] = useState('months')
  const [roi, setRoi] = useState(10)
  const [processingFee, setProcessingFee] = useState(1000)
  const [feeType, setFeeType] = useState('flat')
  const [loanType, setLoanType] = useState('Personal')
  const [showDetails, setShowDetails] = useState(false)
  const [calculated, setCalculated] = useState(false)
  const [results, setResults] = useState(null)
  const exportRef = useRef(null)

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
    setCalculated(true)

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
          // Fallback: download
          exportAsImage()
        }
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  return (
    <div className="p-6 pb-20 space-y-6">
      {/* Input Fields */}
      <div className="space-y-5">
        {/* Loan Amount */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
          <label className="text-gray-400 text-xs uppercase tracking-wide">Loan Amount</label>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-cred-accent text-sm">₹</span>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="bg-transparent text-white text-2xl font-bold outline-none w-full"
            />
          </div>
          <input
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full mt-3"
          />
        </div>

        {/* Tenure */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
          <label className="text-gray-400 text-xs uppercase tracking-wide">Tenure</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="bg-transparent text-white text-2xl font-bold outline-none w-20"
            />
            <select
              value={tenureType}
              onChange={(e) => setTenureType(e.target.value)}
              className="bg-cred-darker text-cred-accent px-3 py-1 rounded-lg outline-none text-sm"
            >
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <input
            type="range"
            min="1"
            max={tenureType === 'years' ? 30 : 360}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full mt-3"
          />
        </div>

        {/* ROI */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
          <label className="text-gray-400 text-xs uppercase tracking-wide">Interest Rate (p.a.)</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="number"
              step="0.1"
              value={roi}
              onChange={(e) => setRoi(Number(e.target.value))}
              className="bg-transparent text-white text-2xl font-bold outline-none w-20"
            />
            <span className="text-cred-accent text-xl">%</span>
          </div>
        </div>

        {/* Processing Fee */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
          <label className="text-gray-400 text-xs uppercase tracking-wide">Processing Fee</label>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-cred-accent text-sm">{feeType === 'flat' ? '₹' : '%'}</span>
            <input
              type="number"
              value={processingFee}
              onChange={(e) => setProcessingFee(Number(e.target.value))}
              className="bg-transparent text-white text-2xl font-bold outline-none w-full"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFeeType('flat')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                feeType === 'flat' ? 'bg-cred-accent text-black' : 'bg-cred-darker text-gray-400'
              }`}
            >
              Flat Fee (₹)
            </button>
            <button
              onClick={() => setFeeType('percent')}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                feeType === 'percent' ? 'bg-cred-accent text-black' : 'bg-cred-darker text-gray-400'
              }`}
            >
              % of Loan
            </button>
          </div>
        </div>

        {/* Loan Type */}
        <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
          <label className="text-gray-400 text-xs uppercase tracking-wide">Loan Type</label>
          <div className="relative mt-2">
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="bg-cred-darker text-white w-full px-4 py-3 rounded-xl outline-none appearance-none font-medium"
            >
              <option>Personal</option>
              <option>Home</option>
              <option>Car</option>
              <option>Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateEMI}
        className="w-full bg-gradient-to-r from-cred-accent to-cred-accent-light text-black font-bold py-4 rounded-2xl shadow-lg shadow-cred-accent/20 hover:shadow-cred-accent/40 transition-all duration-300"
      >
        Calculate EMI
      </button>

      {/* Results */}
      {calculated && results && (
        <div ref={exportRef} className="space-y-6 bg-cred-dark p-4 rounded-2xl">
          {/* Hero EMI Card */}
          <div className="bg-gradient-to-br from-cred-accent/20 to-cred-accent-light/10 p-6 rounded-2xl border border-cred-accent/30">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Your Monthly EMI</p>
            <p className="text-white text-4xl font-extrabold">{formatCurrency(results.emi)}</p>
            <p className="text-gray-400 text-sm mt-1">/ month</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cred-darker/70 p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase">Total Payable</p>
              <p className="text-white text-lg font-bold mt-1">{formatCurrency(results.totalAmount)}</p>
            </div>
            <div className="bg-cred-darker/70 p-4 rounded-xl">
              <p className="text-gray-400 text-xs uppercase">Extra You'll Pay</p>
              <p className="text-cred-accent-light text-lg font-bold mt-1">{formatCurrency(results.totalInterest)}</p>
            </div>
          </div>

          <div className="bg-cred-darker/70 p-4 rounded-xl">
            <p className="text-gray-400 text-xs uppercase">One-time Processing Fee</p>
            <p className="text-white text-lg font-bold mt-1">{formatCurrency(results.processingFee)}</p>
          </div>

          {/* Pie Chart */}
          <div className="bg-cred-darker/50 p-4 rounded-2xl">
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Payment Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Principal', value: results.principal },
                    { name: 'Interest', value: results.totalInterest },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
            <div className="bg-cred-darker/50 p-4 rounded-2xl">
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-cred-darker border border-cred-accent/30 text-cred-accent py-3 rounded-xl font-semibold hover:bg-cred-accent/10 transition"
            >
              {showDetails ? 'Hide' : 'View'} Details
            </button>
            <button
              onClick={exportAsImage}
              className="bg-cred-darker border border-cred-accent/30 text-cred-accent p-3 rounded-xl hover:bg-cred-accent/10 transition"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={shareAsImage}
              className="bg-cred-darker border border-cred-accent/30 text-cred-accent p-3 rounded-xl hover:bg-cred-accent/10 transition"
            >
              <Share className="w-5 h-5" />
            </button>
          </div>

          {/* Repayment Schedule */}
          {showDetails && (
            <div className="bg-cred-darker/50 p-4 rounded-2xl max-h-96 overflow-y-auto">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide sticky top-0 bg-cred-darker/90 pb-2">
                Month-wise Schedule
              </h3>
              <div className="space-y-2">
                {results.schedule.map((item) => (
                  <div key={item.month} className="bg-cred-dark p-3 rounded-lg text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cred-accent font-bold">Month {item.month}</span>
                      <span className="text-white font-bold">{formatCurrency(item.emi)}</span>
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
