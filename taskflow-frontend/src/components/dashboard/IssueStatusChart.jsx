import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const colors = ['#8C9BAB', '#579DFF', '#4BCE97']

export default function IssueStatusChart({ data = [] }) {
  return (
    <div className="rounded border border-jira-border bg-jira-surface p-4">
      <div className="mb-4 text-sm font-medium text-jira-text">Issues by status</div>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
              {data.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#282E33', borderColor: '#2C333A', color: '#B6C2CF' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
