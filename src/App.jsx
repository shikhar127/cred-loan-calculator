import { useState, useEffect } from 'react'
import LoanCalculator from './components/LoanCalculator'
import LoanDisbursal from './components/LoanDisbursal'
import CreditScore from './components/CreditScore'
import { Calculator, CreditCard, TrendingUp } from './components/Icons'
import { useDeviceDetect } from './hooks/useDeviceDetect'

function App() {
  const [activeTab, setActiveTab] = useState(0)
  const { isMobile, isTablet, isDesktop } = useDeviceDetect()
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { name: 'Calculator', icon: Calculator, component: LoanCalculator },
    { name: 'Loan', icon: CreditCard, component: LoanDisbursal },
    { name: 'Score', icon: TrendingUp, component: CreditScore },
  ]

  const ActiveComponent = tabs[activeTab].component

  // Wait for device detection to complete
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cred-dark flex items-center justify-center">
        <div className="text-cred-accent text-xl">Loading...</div>
      </div>
    )
  }

  // Desktop: Show device frame for aesthetic (ONLY on wide screens)
  if (isDesktop && window.innerWidth >= 1024) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        {/* Mobile Device Frame - Desktop Only */}
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

          {/* Tab Bar - Desktop Frame Version */}
          <div className="absolute bottom-0 w-full bg-cred-darker border-t border-gray-800">
            <div className="flex items-center justify-evenly px-4 h-14">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === index
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className="relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-200 active:scale-95"
                  >
                    {isActive && (
                      <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-16 h-1 bg-cred-accent rounded-b-full"></div>
                    )}
                    <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-cred-accent' : 'text-gray-500'}`} />
                    <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-cred-accent' : 'text-gray-500'}`}>
                      {tab.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile/Tablet: Full screen, no frame (default for everything else)
  // This is the default layout that works on all devices
  return (
    <div className="min-h-screen bg-cred-dark flex flex-col">
      {/* App Bar - Universal Design: 56px min height with proper safe area */}
      <div className="bg-cred-darker/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        {/* Safe area spacer - invisible but reserves space for status bar */}
        <div className="h-[env(safe-area-inset-top,0px)]"></div>

        {/* Actual header content - 56px minimum height (Universal Design standard) */}
        <div className="px-6 py-4 min-h-[56px] flex items-center">
          <h1 className="text-white text-2xl font-bold">{tabs[activeTab].name}</h1>
        </div>
      </div>

      {/* Content Area - Native Scrolling */}
      <div className="flex-1 overflow-y-auto bg-cred-dark">
        <div className="pb-20">
          <ActiveComponent />
        </div>
      </div>

      {/* Tab Bar - Universal Design: 56px height, equal spacing, 48px+ touch targets */}
      <div className="fixed bottom-0 left-0 right-0 bg-cred-darker/95 backdrop-blur-lg border-t border-gray-800 z-50">
        <div className="relative">
          {/* Tabs container - 56px height (h-14) with equal spacing */}
          <div className="flex items-center justify-evenly px-4 h-14">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === index
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="relative flex flex-col items-center justify-center gap-1 w-16 h-14 transition-all duration-200 active:scale-95"
                >
                  {/* Active indicator at TOP of tab bar - centered */}
                  {isActive && (
                    <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-16 h-1 bg-cred-accent rounded-b-full"></div>
                  )}

                  <Icon className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-cred-accent' : 'text-gray-500'
                  }`} />

                  <span className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-cred-accent' : 'text-gray-500'
                  }`}>
                    {tab.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Safe area spacer for bottom gestures/notch */}
          <div className="h-[env(safe-area-inset-bottom,0px)] bg-cred-darker"></div>
        </div>
      </div>
    </div>
  )
}

export default App
