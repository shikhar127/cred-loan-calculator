import { useState } from 'react'
import LoanCalculator from './components/LoanCalculator'
import LoanDisbursal from './components/LoanDisbursal'
import CreditScore from './components/CreditScore'
import { Calculator, CreditCard, TrendingUp } from './components/Icons'

function App() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { name: 'Calculator', icon: Calculator, component: LoanCalculator },
    { name: 'Loan', icon: CreditCard, component: LoanDisbursal },
    { name: 'Score', icon: TrendingUp, component: CreditScore },
  ]

  const ActiveComponent = tabs[activeTab].component

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Mobile Device Frame */}
      <div className="relative w-[360px] h-[740px] bg-cred-dark rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-900">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

        {/* App Bar */}
        <div className="bg-gradient-to-b from-cred-darker to-cred-dark px-6 pt-10 pb-4 border-b border-gray-800">
          <h1 className="text-white text-xl font-bold">{tabs[activeTab].name}</h1>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-120px)] overflow-y-auto bg-cred-dark">
          <ActiveComponent />
        </div>

        {/* Tab Bar */}
        <div className="absolute bottom-0 w-full bg-cred-darker border-t border-gray-800 px-4 py-3 flex justify-around items-center">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === index
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-cred-accent/10' : ''
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-cred-accent' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-cred-accent' : 'text-gray-500'}`}>
                  {tab.name}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 w-8 h-1 bg-cred-accent rounded-b-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
