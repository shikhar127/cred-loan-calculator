const LoanInputs = ({
  loanAmount,
  setLoanAmount,
  tenure,
  setTenure,
  tenureType,
  setTenureType,
  roi,
  setRoi,
  formatNumber
}) => {
  // Quick preset amounts
  const presets = [
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹20L', value: 2000000 },
    { label: '₹50L', value: 5000000 },
  ]

  return (
    <div className="space-y-5">
      {/* Quick Presets */}
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-3">Quick Select</p>
        <div className="grid grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setLoanAmount(preset.value)}
              className={`py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200 ${
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

      {/* Loan Amount */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Loan Amount</label>
        <div className="flex items-baseline gap-2 mt-2 mb-1">
          <span className="text-cred-accent text-xl font-bold">₹</span>
          <div className="text-white text-3xl font-bold tracking-tight">
            {formatNumber(loanAmount)}
          </div>
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
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
          <span>₹10K</span>
          <span>₹1Cr</span>
        </div>
      </div>

      {/* Tenure */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Tenure</label>
        <div className="flex items-center gap-3 mt-2 mb-1">
          <div className="text-white text-3xl font-bold tracking-tight">
            {tenure}
          </div>
          <select
            value={tenureType}
            onChange={(e) => setTenureType(e.target.value)}
            className="bg-cred-darker text-cred-accent px-3 py-1.5 rounded-lg outline-none text-base font-semibold border-2 border-cred-accent/20"
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
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
          <span>1 {tenureType === 'years' ? 'Yr' : 'Mo'}</span>
          <span>{tenureType === 'years' ? '30 Yrs' : '360 Mos'}</span>
        </div>
      </div>

      {/* ROI */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Interest Rate (p.a.)</label>
        <div className="flex items-baseline gap-2 mt-2 mb-1">
          <div className="text-white text-3xl font-bold tracking-tight">
            {roi}
          </div>
          <span className="text-cred-accent text-2xl font-bold">%</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={roi}
          onChange={(e) => setRoi(Number(e.target.value))}
          className="w-full mt-3"
        />
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>
    </div>
  )
}

export default LoanInputs
