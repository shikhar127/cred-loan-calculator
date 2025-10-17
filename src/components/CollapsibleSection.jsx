import { useState } from 'react'
import { ChevronDown } from './Icons'

const CollapsibleSection = ({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  badge = null,
  headerRight = null
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-cred-darker/50 backdrop-blur-sm rounded-2xl border-2 border-gray-800 overflow-hidden transition-all duration-200 hover:border-gray-700">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-cred-darker/70 transition-colors duration-200 active:scale-[0.99]"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-cred-accent" />}
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-cred-accent/20 text-cred-accent text-xs font-medium rounded-full border border-cred-accent/30">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {headerRight}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-5 py-4 border-t border-gray-800">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CollapsibleSection
