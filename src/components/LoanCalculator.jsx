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
  const debouncedLoanAmount = useDebouncedValue(loanAmount, 100)
  const debouncedTenure = useDebouncedValue(tenure, 100)
  const debouncedRoi = useDebouncedValue(roi, 100)

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
    <div className="px-4 py-4 pb-20 space-y-3">
      {/* Hero EMI Display - Always Visible */}
      {results && (
        <div className="bg-gradient-to-br from-cred-orange to-cred-orange-dark p-6 rounded-3xl shadow-xl">
          <p className="text-white text-xs uppercase tracking-wide mb-2 font-medium">LOAN REPAYMENT</p>
          <p className="text-white text-5xl font-bold mb-1">{formatCurrency(results.emi)}</p>
          <p className="text-white/80 text-sm">monthly estimate</p>
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-white/70">Total Payable</p>
              <p className="text-white text-base font-semibold mt-0.5">{formatCurrency(results.totalAmount)}</p>
            </div>
            <div>
              <p className="text-white/70">Interest</p>
              <p className="text-white text-base font-semibold mt-0.5">{formatCurrency(results.totalInterest)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Always Visible */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex-1 bg-white border-2 border-cred-brown/20 text-cred-brown py-3 rounded-xl text-sm font-semibold hover:bg-cred-tan transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={shareAsLink}
          className="flex-1 bg-white border-2 border-cred-brown/20 text-cred-brown py-3 rounded-xl text-sm font-semibold hover:bg-cred-tan transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Share className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={exportAsImage}
          className="bg-white border-2 border-cred-brown/20 text-cred-brown p-3 rounded-xl hover:bg-cred-tan transition active:scale-95 shadow-sm"
        >
          <Download className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-cred-brown-dark text-xl font-bold mb-4">Save Loan</h3>

            <div className="space-y-4">
              <div>
                <label className="text-cred-brown text-xs font-medium uppercase tracking-wide block mb-2">
                  Loan Name
                </label>
                <input
                  type="text"
                  value={loanName}
                  onChange={(e) => setLoanName(e.target.value)}
                  placeholder="e.g., Car Loan - HDFC"
                  className="w-full bg-cred-tan border-2 border-cred-brown/20 text-cred-brown-dark px-4 py-3 rounded-xl outline-none focus:border-cred-orange transition"
                />
              </div>

              <div>
                <label className="text-cred-brown text-xs font-medium uppercase tracking-wide block mb-2">
                  Loan Type
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full bg-cred-tan border-2 border-cred-brown/20 text-cred-brown-dark px-4 py-3 rounded-xl outline-none focus:border-cred-orange transition"
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
                  className="w-full bg-cred-orange text-white font-bold py-3 rounded-xl shadow-lg hover:bg-cred-orange-dark transition active:scale-95"
                >
                  Save Loan
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setLoanName('')
                  }}
                  className="w-full bg-white border-2 border-cred-brown/20 text-cred-brown font-semibold py-3 rounded-xl hover:bg-cred-tan transition active:scale-95"
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
