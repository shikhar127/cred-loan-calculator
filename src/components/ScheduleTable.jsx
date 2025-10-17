const ScheduleTable = ({ schedule, formatCurrency }) => {
  if (!schedule || schedule.length === 0) return null

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="space-y-2">
        {schedule.map((item) => (
          <div key={item.month} className="bg-cred-dark/70 p-3 rounded-xl text-xs border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-cred-accent font-bold text-sm">Month {item.month}</span>
              <span className="text-white font-bold text-sm">{formatCurrency(item.emi)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-gray-400">
              <div>
                <div className="text-[10px] uppercase mb-0.5">Principal</div>
                <div className="text-white text-xs font-medium">{formatCurrency(item.principal)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-0.5">Interest</div>
                <div className="text-white text-xs font-medium">{formatCurrency(item.interest)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-0.5">Balance</div>
                <div className="text-white text-xs font-medium">{formatCurrency(item.balance)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleTable
