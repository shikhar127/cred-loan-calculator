import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CreditScore = () => {
  const [phone, setPhone] = useState('')
  const [pan, setPan] = useState('')
  const [score, setScore] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])

  const generateMockScore = () => {
    if (phone.length === 10 && pan.length === 10) {
      const mockScore = Math.floor(Math.random() * 200) + 600 // 600-800
      setScore(mockScore)

      // Generate 12 months of mock history
      const mockHistory = []
      let baseScore = mockScore - 50
      for (let i = 11; i >= 0; i--) {
        const variation = Math.floor(Math.random() * 30) - 15
        baseScore = Math.max(600, Math.min(800, baseScore + variation))
        const month = new Date()
        month.setMonth(month.getMonth() - i)
        mockHistory.push({
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          score: baseScore,
        })
      }
      setHistory(mockHistory)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-cred-accent'
    if (score >= 700) return 'text-green-400'
    if (score >= 650) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent'
    if (score >= 700) return 'Good'
    if (score >= 650) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreBgColor = (score) => {
    if (score >= 750) return 'from-cred-accent/20 to-cred-accent-light/10'
    if (score >= 700) return 'from-green-500/20 to-green-400/10'
    if (score >= 650) return 'from-yellow-500/20 to-yellow-400/10'
    return 'from-red-500/20 to-red-400/10'
  }

  return (
    <div className="p-6 pb-20 space-y-6">
      {!score ? (
        <>
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-white text-2xl font-bold">Check Your Credit Score</h2>
            <p className="text-gray-400 text-sm">Get your credit score instantly</p>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-cred-accent/10 to-cred-accent-light/5 p-5 rounded-2xl border border-cred-accent/20">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-cred-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white text-sm font-semibold mb-1">Why check your score?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Your credit score helps lenders determine your creditworthiness. A higher score means better loan offers and interest rates.
                </p>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mt-8">
            {/* Phone Number */}
            <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
              <label className="text-gray-400 text-xs uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit mobile number"
                className="bg-transparent text-white text-lg font-medium outline-none w-full mt-2"
              />
              {phone.length > 0 && phone.length !== 10 && (
                <p className="text-red-400 text-xs mt-2">Please enter a valid 10-digit number</p>
              )}
            </div>

            {/* PAN */}
            <div className="bg-cred-darker/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
              <label className="text-gray-400 text-xs uppercase tracking-wide">PAN Number</label>
              <input
                type="text"
                maxLength={10}
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="Enter PAN (e.g., ABCDE1234F)"
                className="bg-transparent text-white text-lg font-medium outline-none w-full mt-2 uppercase"
              />
              {pan.length > 0 && pan.length !== 10 && (
                <p className="text-red-400 text-xs mt-2">PAN must be 10 characters</p>
              )}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-blue-400 text-xs font-semibold">Your data is secure</p>
                <p className="text-blue-300/70 text-xs mt-1">
                  This is a mock UI. No real data is collected or sent anywhere.
                </p>
              </div>
            </div>
          </div>

          {/* Check Score Button */}
          <button
            onClick={generateMockScore}
            disabled={phone.length !== 10 || pan.length !== 10}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${
              phone.length === 10 && pan.length === 10
                ? 'bg-gradient-to-r from-cred-accent to-cred-accent-light text-black shadow-lg shadow-cred-accent/20'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            Check Score
          </button>
        </>
      ) : (
        <>
          {/* Score Display */}
          <div className={`bg-gradient-to-br ${getScoreBgColor(score)} p-6 rounded-2xl border border-cred-accent/30 text-center`}>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Your Credit Score</p>
            <p className={`text-7xl font-extrabold ${getScoreColor(score)}`}>{score}</p>
            <p className={`text-lg font-semibold mt-2 ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-xs">Score Range: 300 - 900</p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cred-darker/70 p-4 rounded-xl text-center">
              <p className="text-gray-400 text-xs uppercase mb-2">Min Score</p>
              <p className="text-white text-2xl font-bold">300</p>
            </div>
            <div className="bg-cred-darker/70 p-4 rounded-xl text-center">
              <p className="text-gray-400 text-xs uppercase mb-2">Max Score</p>
              <p className="text-white text-2xl font-bold">900</p>
            </div>
          </div>

          {/* Score Factors */}
          <div className="bg-cred-darker/50 p-5 rounded-2xl space-y-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wide">What affects your score?</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-xs">Payment History</span>
                <span className="text-cred-accent text-xs font-semibold">35%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-800">
                <span className="text-gray-400 text-xs">Credit Utilization</span>
                <span className="text-cred-accent text-xs font-semibold">30%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-800">
                <span className="text-gray-400 text-xs">Credit History Length</span>
                <span className="text-cred-accent text-xs font-semibold">15%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-800">
                <span className="text-gray-400 text-xs">Credit Mix</span>
                <span className="text-cred-accent text-xs font-semibold">10%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-800">
                <span className="text-gray-400 text-xs">New Credit</span>
                <span className="text-cred-accent text-xs font-semibold">10%</span>
              </div>
            </div>
          </div>

          {/* View History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full bg-cred-darker border border-cred-accent/30 text-cred-accent py-3 rounded-xl font-semibold hover:bg-cred-accent/10 transition"
          >
            {showHistory ? 'Hide' : 'View'} Score History
          </button>

          {/* History Chart */}
          {showHistory && (
            <div className="bg-cred-darker/50 p-4 rounded-2xl">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
                12-Month Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}>
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
                  <YAxis domain={[600, 800]} stroke="#6b7280" style={{ fontSize: '10px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121318',
                      border: '1px solid #23f0c7',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#23f0c7" strokeWidth={3} dot={{ fill: '#23f0c7' }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-gray-500 text-xs text-center mt-3">Mock data - randomly generated</p>
            </div>
          )}

          {/* Check Again Button */}
          <button
            onClick={() => {
              setScore(null)
              setShowHistory(false)
              setPhone('')
              setPan('')
            }}
            className="w-full bg-gradient-to-r from-cred-accent to-cred-accent-light text-black font-bold py-4 rounded-2xl"
          >
            Check Again
          </button>

          {/* Note */}
          <p className="text-gray-500 text-xs text-center">
            Purely simulated UI - No real data fetch
          </p>
        </>
      )}
    </div>
  )
}

export default CreditScore
