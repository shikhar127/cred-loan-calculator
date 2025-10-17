import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const ChartsSection = ({ results, formatCurrency }) => {
  if (!results) return null

  return (
    <div className="space-y-4">
      {/* Pie Chart */}
      <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
        <h3 className="text-white text-xs font-semibold mb-3 uppercase tracking-wide">Payment Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
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
              <Cell fill="#23f0c7" />
              <Cell fill="#f093fb" />
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#121318', border: '1px solid #23f0c7', borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cred-accent rounded"></div>
            <span className="text-gray-400 text-xs">Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-400 rounded"></div>
            <span className="text-gray-400 text-xs">Interest</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      {results.chartData && results.chartData.length > 0 && (
        <div className="bg-cred-darker p-4 rounded-xl border-2 border-gray-700">
          <h3 className="text-white text-xs font-semibold mb-3 uppercase tracking-wide">
            Principal vs Interest Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={results.chartData}>
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#121318', border: '1px solid #23f0c7', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="Principal" stroke="#23f0c7" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Interest" stroke="#f093fb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default ChartsSection
