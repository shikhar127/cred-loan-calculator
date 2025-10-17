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
    <div className="bg-white rounded-xl border-2 border-cred-brown/10 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-cred-tan/50 transition-colors duration-200 active:scale-[0.99]"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-cred-orange" />}
          <h3 className="text-sm font-semibold text-cred-brown-dark">{title}</h3>
          {badge && (
            <span className="px-1.5 py-0.5 bg-cred-orange/20 text-cred-orange text-[10px] font-medium rounded-full border border-cred-orange/30">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {headerRight}
          <ChevronDown
            className={`w-4 h-4 text-cred-brown transition-transform duration-300 ${
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
        <div className="px-4 py-3 border-t border-cred-brown/10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CollapsibleSection
