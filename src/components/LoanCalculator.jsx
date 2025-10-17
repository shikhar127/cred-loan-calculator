import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { Download, Share, Save, Settings, Chart, Calendar, CheckCircle, Compare } from './Icons'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocalStorage } from '../hooks/useLocalStorage'
import CollapsibleSection from './CollapsibleSection'
import LoanInputs from './LoanInputs'
import ChartsSection from './ChartsSection'
import ScheduleTable from './ScheduleTable'
import ForeclosureCalculator from './ForeclosureCalculator'
import EligibilityChecker from './EligibilityChecker'
import LoanComparison from './LoanComparison'
import SavedLoans from './SavedLoans'

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useLocalStorage('loanAmount', 500000)
  const [tenure, setTenure] = useLocalStorage('tenure', 24)
  const [tenureType, setTenureType] = useLocalStorage('tenureType', 'months')
  const [roi, setRoi] = useLocalStorage('roi', 10)
  const [results, setResults] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [loanName, setLoanName] = useState('')
  const [loanType, setLoanType] = useState('Personal')
  const exportRef = useRef(null)

  // Debounced values for real-time calculation
  const debouncedLoanAmount = useDebouncedValue(loanAmount, 300)
  const debouncedTenure = useDebouncedValue(tenure, 300)
  const debouncedRoi = useDebouncedValue(roi, 300)

  // Auto-calculate on load and when values change
  useEffect(() => {
    calculateEMI()
  }, [debouncedLoanAmount, debouncedTenure, tenureType, debouncedRoi])

  // Parse URL parameters for shared loans
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedAmount = params.get('amount')
    const sharedTenure = params.get('tenure')
    const sharedRoi = params.get('roi')

    if (sharedAmount) setLoanAmount(Number(sharedAmount))
    if (sharedTenure) setTenure(Number(sharedTenure))
    if (sharedRoi) setRoi(Number(sharedRoi))
  }, [])

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
      schedule,
      chartData,
      principal: P,
    })
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
        link.download = 'loan-details.png'
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Failed to export:', err)
      }
    }
  }

  const shareAsLink = async () => {
    const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure
    const shareUrl = `${window.location.origin}${window.location.pathname}?amount=${loanAmount}&tenure=${tenureMonths}&roi=${roi}`

    const shareText = `Check out this loan plan:\n💰 Loan: ${formatCurrency(loanAmount)}\n📅 Tenure: ${tenureMonths} months\n📈 ROI: ${roi}%\n💳 EMI: ${formatCurrency(results.emi)}\n\n`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Loan Calculator',
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to share:', err)
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText + shareUrl)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleSaveLoan = () => {
    if (!loanName.trim()) {
      alert('Please enter a loan name')
      return
    }

    try {
      const savedLoans = JSON.parse(localStorage.getItem('savedLoans') || '[]')

      if (savedLoans.length >= 20) {
        alert('Maximum 20 loans can be saved. Please delete some to add new ones.')
        return
      }

      const tenureMonths = tenureType === 'years' ? tenure * 12 : tenure

      const newLoan = {
        id: Date.now(),
        name: loanName,
        type: loanType,
        loanAmount,
        tenure: tenureMonths,
        roi,
        savedAt: new Date().toISOString()
      }

      savedLoans.push(newLoan)
      localStorage.setItem('savedLoans', JSON.stringify(savedLoans))

      setShowSaveModal(false)
      setLoanName('')
      alert('Loan saved successfully!')
    } catch (err) {
      console.error('Failed to save loan:', err)
      alert('Failed to save loan')
    }
  }

  const handleLoadLoan = (loan) => {
    setLoanAmount(loan.loanAmount)
    setTenure(loan.tenure)
    setTenureType('months')
    setRoi(loan.roi)
  }

  const handleApplyEligibility = (amount) => {
    setLoanAmount(amount)
    // Scroll to top to show the updated amount
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="px-5 py-6 pb-24 space-y-4">
      {/* Hero EMI Display - Always Visible */}
      {results && (
        <div className="bg-gradient-to-br from-cred-accent/20 to-cred-accent-light/10 p-5 rounded-2xl border-2 border-cred-accent/30 shadow-lg">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Your Monthly EMI</p>
          <p className="text-white text-4xl font-extrabold">{formatCurrency(results.emi)}</p>
          <div className="mt-3 pt-3 border-t border-cred-accent/20 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400">Total Payable</p>
              <p className="text-white text-base font-bold">{formatCurrency(results.totalAmount)}</p>
            </div>
            <div>
              <p className="text-gray-400">Interest</p>
              <p className="text-cred-accent-light text-base font-bold">{formatCurrency(results.totalInterest)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Always Visible */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex-1 bg-cred-darker border-2 border-cred-accent/30 text-cred-accent py-3 rounded-xl font-bold hover:bg-cred-accent/10 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save
        </button>
        <button
          onClick={shareAsLink}
          className="flex-1 bg-cred-darker border-2 border-cred-accent/30 text-cred-accent py-3 rounded-xl font-bold hover:bg-cred-accent/10 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Share className="w-5 h-5" />
          Share
        </button>
        <button
          onClick={exportAsImage}
          className="bg-cred-darker border-2 border-cred-accent/30 text-cred-accent p-3 rounded-xl hover:bg-cred-accent/10 transition active:scale-95"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-3" ref={exportRef}>
        {/* Loan Inputs */}
        <CollapsibleSection title="Loan Details" icon={Settings} defaultOpen={!results}>
          <LoanInputs
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            tenure={tenure}
            setTenure={setTenure}
            tenureType={tenureType}
            setTenureType={setTenureType}
            roi={roi}
            setRoi={setRoi}
            formatNumber={formatNumber}
          />
        </CollapsibleSection>

        {/* Charts */}
        <CollapsibleSection title="Charts & Breakdown" icon={Chart} defaultOpen={false}>
          <ChartsSection results={results} formatCurrency={formatCurrency} />
        </CollapsibleSection>

        {/* Repayment Schedule */}
        <CollapsibleSection
          title="Repayment Schedule"
          icon={Calendar}
          defaultOpen={false}
          badge={results ? `${results.schedule.length} months` : null}
        >
          <ScheduleTable schedule={results?.schedule} formatCurrency={formatCurrency} />
        </CollapsibleSection>

        {/* Eligibility Checker */}
        <CollapsibleSection title="Eligibility Checker" icon={CheckCircle} defaultOpen={false}>
          <EligibilityChecker
            formatCurrency={formatCurrency}
            onApplyToCalculator={handleApplyEligibility}
          />
        </CollapsibleSection>

        {/* Foreclosure Calculator */}
        <CollapsibleSection title="Foreclosure Calculator" icon={Settings} defaultOpen={false}>
          <ForeclosureCalculator
            results={results}
            formatCurrency={formatCurrency}
            loanAmount={loanAmount}
            tenure={tenure}
            tenureType={tenureType}
          />
        </CollapsibleSection>

        {/* Compare Loans */}
        <CollapsibleSection title="Compare Loans" icon={Compare} defaultOpen={false}>
          <LoanComparison formatCurrency={formatCurrency} formatNumber={formatNumber} />
        </CollapsibleSection>

        {/* Saved Loans */}
        <CollapsibleSection
          title="My Saved Loans"
          icon={Save}
          defaultOpen={false}
          badge={(() => {
            try {
              const saved = JSON.parse(localStorage.getItem('savedLoans') || '[]')
              return saved.length > 0 ? saved.length : null
            } catch {
              return null
            }
          })()}
        >
          <SavedLoans formatCurrency={formatCurrency} onLoadLoan={handleLoadLoan} />
        </CollapsibleSection>
      </div>

      {/* Save Loan Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
          <div className="bg-cred-darker rounded-2xl p-6 w-full max-w-sm border-2 border-cred-accent/30">
            <h3 className="text-white text-xl font-bold mb-4">Save Loan</h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide block mb-2">
                  Loan Name
                </label>
                <input
                  type="text"
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                  placeholder="e.g., Car Loan - HDFC"
                  className="w-full bg-cred-dark border-2 border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-cred-accent transition"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wide block mb-2">
                  Loan Type
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full bg-cred-dark border-2 border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-cred-accent transition"
                >
                  <option value="Personal">Personal Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Car">Car Loan</option>
                  <option value="Education">Education Loan</option>
                  <option value="Business">Business Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSaveLoan}
                  className="w-full bg-gradient-to-r from-cred-accent to-cred-accent-light text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition active:scale-95"
                >
                  Save Loan
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setLoanName('')
                  }}
                  className="w-full bg-cred-dark border-2 border-gray-700 text-gray-400 font-bold py-3 rounded-xl hover:bg-gray-800 transition active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanCalculator
