import { useState, useEffect } from 'react'
import { Trash, Download } from './Icons'

const SavedLoans = ({ formatCurrency, onLoadLoan }) => {
  const [savedLoans, setSavedLoans] = useState([])
  const MAX_SAVES = 20

  useEffect(() => {
    loadSavedLoans()
  }, [])

  const loadSavedLoans = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedLoans') || '[]')
      setSavedLoans(saved)
    } catch (err) {
      console.error('Failed to load saved loans:', err)
      setSavedLoans([])
    }
  }

  const deleteLoan = (id) => {
    const updated = savedLoans.filter((loan) => loan.id !== id)
    localStorage.setItem('savedLoans', JSON.stringify(updated))
    setSavedLoans(updated)
  }

  const exportLoans = () => {
    const dataStr = JSON.stringify(savedLoans, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'saved-loans.json'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const calculateEMI = (amount, tenure, roi) => {
    const P = amount
    const r = roi / 12 / 100
    const n = tenure

    let emi = 0
    if (r === 0) {
      emi = P / n
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    }

    return emi
  }

  if (savedLoans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm mb-2">No saved loans yet</p>
        <p className="text-gray-500 text-xs">Save loans from the calculator to view them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-400 text-xs">
          {savedLoans.length} / {MAX_SAVES} saved
        </p>
        {savedLoans.length > 0 && (
          <button
            onClick={exportLoans}
            className="flex items-center gap-1 text-cred-accent text-xs font-semibold hover:text-cred-accent-light transition"
          >
            <Download className="w-3 h-3" />
            Export All
          </button>
        )}
      </div>

      {/* Saved Loans List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {savedLoans.map((loan) => {
          const emi = calculateEMI(loan.loanAmount, loan.tenure, loan.roi)

          return (
            <div
              key={loan.id}
              className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700 hover:border-cred-accent/50 transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-bold text-sm">{loan.name}</h4>
                  <p className="text-gray-500 text-[10px] mt-0.5">{loan.type}</p>
                </div>
                <button
                  onClick={() => deleteLoan(loan.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                  aria-label="Delete loan"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>

              {/* EMI Display */}
              <div className="bg-cred-darker/50 p-3 rounded-lg mb-3">
                <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Monthly EMI</p>
                <p className="text-cred-accent text-2xl font-bold">{formatCurrency(emi)}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <p className="text-gray-400 text-[10px]">Amount</p>
                  <p className="text-white font-semibold">{formatCurrency(loan.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Tenure</p>
                  <p className="text-white font-semibold">{loan.tenure}m</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">ROI</p>
                  <p className="text-white font-semibold">{loan.roi}%</p>
                </div>
              </div>

              {/* Load Button */}
              <button
                onClick={() => onLoadLoan(loan)}
                className="w-full bg-cred-accent/10 border border-cred-accent/30 text-cred-accent py-2 rounded-lg text-xs font-bold hover:bg-cred-accent/20 transition active:scale-95"
              >
                Load into Calculator
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SavedLoans
