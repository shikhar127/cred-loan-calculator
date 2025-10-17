import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const ChartsSection = ({ results, formatCurrency }) => {
  if (!results) return null

  return (
    <div className="space-y-3">
      {/* Pie Chart */}
      <div className="bg-white p-3 rounded-xl border-2 border-cred-brown/20">
        <h3 className="text-cred-brown-dark text-[10px] font-semibold mb-2 uppercase tracking-wide">Payment Breakdown</h3>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={[
                { name: 'Principal', value: results.principal },
                { name: 'Interest', value: results.totalInterest },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              <Cell fill="#d4834f" />
              <Cell fill="#8b5a3c" />
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#f9f6f1', border: '1px solid #d4834f', borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-cred-orange rounded"></div>
            <span className="text-cred-brown text-[10px]">Principal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-cred-brown rounded"></div>
            <span className="text-cred-brown text-[10px]">Interest</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      {results.chartData && results.chartData.length > 0 && (
        <div className="bg-white p-3 rounded-xl border-2 border-cred-brown/20">
          <h3 className="text-cred-brown-dark text-[10px] font-semibold mb-2 uppercase tracking-wide">
            Principal vs Interest Trend
          </h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={results.chartData}>
              <XAxis dataKey="month" stroke="#8b5a3c" style={{ fontSize: '10px' }} />
              <YAxis stroke="#8b5a3c" style={{ fontSize: '10px' }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#f9f6f1', border: '1px solid #d4834f', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="Principal" stroke="#d4834f" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Interest" stroke="#8b5a3c" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default ChartsSection
