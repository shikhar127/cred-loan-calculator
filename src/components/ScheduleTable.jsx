const ScheduleTable = ({ schedule, formatCurrency }) => {
  if (!schedule || schedule.length === 0) return null

  return (
    <div className="max-h-64 overflow-y-auto">
      <div className="space-y-1.5">
        {schedule.map((item) => (
          <div key={item.month} className="bg-white p-2 rounded-lg text-[10px] border-2 border-cred-brown/20">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-cred-orange font-bold text-xs">Month {item.month}</span>
              <span className="text-cred-brown-dark font-bold text-xs">{formatCurrency(item.emi)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-cred-brown">
              <div>
                <div className="text-[9px] uppercase mb-0.5">Principal</div>
                <div className="text-cred-brown-dark text-[10px] font-medium">{formatCurrency(item.principal)}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase mb-0.5">Interest</div>
                <div className="text-cred-brown-dark text-[10px] font-medium">{formatCurrency(item.interest)}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase mb-0.5">Balance</div>
                <div className="text-cred-brown-dark text-[10px] font-medium">{formatCurrency(item.balance)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleTable
