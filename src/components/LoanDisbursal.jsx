import { useState } from 'react'

const LoanDisbursal = () => {
  const [step, setStep] = useState(1) // 1: Permissions, 2: Disbursal
  const [smsPermission, setSmsPermission] = useState(false)
  const [aaPermission, setAaPermission] = useState(false)
  const [loanLimit] = useState(Math.floor(Math.random() * 500000) + 100000) // Random 1L-6L
  const [requestedAmount, setRequestedAmount] = useState(50000)
  const [disbursalTenure, setDisbursalTenure] = useState(12)
  const [showSuccess, setShowSuccess] = useState(false)

  const canContinue = smsPermission && aaPermission

  const handleContinue = () => {
    if (canContinue) {
      setStep(2)
    }
  }

  const handleDisburse = () => {
    if (requestedAmount <= loanLimit && requestedAmount > 0) {
      setShowSuccess(true)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (step === 1) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-white text-2xl font-bold">Grant Permissions</h2>
          <p className="text-gray-400 text-sm">We need a few permissions to assess your eligibility</p>
        </div>

        {/* Permission Cards */}
        <div className="space-y-4 mt-8">
          {/* SMS Permission */}
          <div
            onClick={() => setSmsPermission(!smsPermission)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              smsPermission
                ? 'bg-cred-accent/10 border-cred-accent'
                : 'bg-cred-darker/50 border-gray-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  smsPermission ? 'bg-cred-accent border-cred-accent' : 'border-gray-600'
                }`}
              >
                {smsPermission && (
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">SMS Read Access</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We'll analyze your transaction messages to verify your income and spending patterns. This is mock data - no real SMS access.
                </p>
              </div>
            </div>
          </div>

          {/* AA Permission */}
          <div
            onClick={() => setAaPermission(!aaPermission)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              aaPermission
                ? 'bg-cred-accent/10 border-cred-accent'
                : 'bg-cred-darker/50 border-gray-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  aaPermission ? 'bg-cred-accent border-cred-accent' : 'border-gray-600'
                }`}
              >
                {aaPermission && (
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Upload AA Data</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Share your Account Aggregator data to get better loan offers. Mock UI - no real data uploaded.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-500 text-xs font-semibold">Mock UI - No Real API</p>
              <p className="text-yellow-400/70 text-xs mt-1">
                This is a demo interface. No actual data is collected or processed.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-2xl font-bold transition-all ${
            canContinue
              ? 'bg-gradient-to-r from-cred-accent to-cred-accent-light text-black shadow-lg shadow-cred-accent/20'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
        {/* Success Animation */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cred-accent to-cred-accent-light flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-white text-2xl font-bold">Loan Approved!</h2>
          <p className="text-gray-400 text-sm">Your loan has been successfully processed</p>
        </div>

        <div className="bg-cred-darker/70 p-6 rounded-2xl w-full space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Disbursed Amount</span>
            <span className="text-white font-bold">{formatCurrency(requestedAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Tenure</span>
            <span className="text-white font-bold">{disbursalTenure} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span className="text-cred-accent font-bold">Approved</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowSuccess(false)
            setStep(1)
            setSmsPermission(false)
            setAaPermission(false)
          }}
          className="w-full bg-gradient-to-r from-cred-accent to-cred-accent-light text-black font-bold py-4 rounded-2xl"
        >
          Start New Application
        </button>

        <p className="text-gray-500 text-xs">Dummy UI - No real API integration</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-white text-2xl font-bold">Loan Disbursal</h2>
        <p className="text-gray-400 text-sm">Choose your loan amount and tenure</p>
      </div>

      {/* Eligible Limit */}
      <div className="bg-gradient-to-br from-cred-accent/20 to-cred-accent-light/10 p-6 rounded-2xl border border-cred-accent/30">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Your Eligible Limit</p>
        <p className="text-white text-4xl font-extrabold">{formatCurrency(loanLimit)}</p>
        <p className="text-cred-accent text-sm mt-2">Pre-approved just for you</p>
      </div>

      {/* Loan Amount Input */}
      <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
        <label className="text-gray-400 text-xs uppercase tracking-wide">Requested Amount</label>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-cred-accent text-sm">₹</span>
          <input
            type="number"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(Number(e.target.value))}
            max={loanLimit}
            className="bg-transparent text-white text-2xl font-bold outline-none w-full"
          />
        </div>
        <input
          type="range"
          min="10000"
          max={loanLimit}
          step="1000"
          value={requestedAmount}
          onChange={(e) => setRequestedAmount(Number(e.target.value))}
          className="w-full mt-3"
        />
        {requestedAmount > loanLimit && (
          <p className="text-red-400 text-xs mt-2">Amount exceeds eligible limit</p>
        )}
      </div>

      {/* Tenure Input */}
      <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
        <label className="text-gray-400 text-xs uppercase tracking-wide">Tenure (Months)</label>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="number"
            value={disbursalTenure}
            onChange={(e) => setDisbursalTenure(Number(e.target.value))}
            className="bg-transparent text-white text-2xl font-bold outline-none w-20"
          />
          <span className="text-gray-400">months</span>
        </div>
        <input
          type="range"
          min="6"
          max="60"
          value={disbursalTenure}
          onChange={(e) => setDisbursalTenure(Number(e.target.value))}
          className="w-full mt-3"
        />
      </div>

      {/* Summary */}
      <div className="bg-cred-darker/70 p-4 rounded-xl space-y-3">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Loan Amount</span>
            <span className="text-white font-semibold">{formatCurrency(requestedAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tenure</span>
            <span className="text-white font-semibold">{disbursalTenure} months</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Approx. EMI</span>
            <span className="text-cred-accent font-bold">
              {formatCurrency(requestedAmount / disbursalTenure)}
            </span>
          </div>
        </div>
      </div>

      {/* Disburse Button */}
      <button
        onClick={handleDisburse}
        disabled={requestedAmount > loanLimit || requestedAmount <= 0}
        className={`w-full py-4 rounded-2xl font-bold transition-all ${
          requestedAmount <= loanLimit && requestedAmount > 0
            ? 'bg-gradient-to-r from-cred-accent to-cred-accent-light text-black shadow-lg shadow-cred-accent/20'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
        }`}
      >
        Proceed to Disbursal
      </button>

      {/* Info */}
      <p className="text-gray-500 text-xs text-center">Dummy UI - No real API integration</p>
    </div>
  )
}

export default LoanDisbursal
