import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function IssuesByAssigneeChart({ data = [] }) {
  return (
    <div className="rounded border border-jira-border bg-jira-surface p-4">
      <div className="mb-4 text-sm font-medium text-jira-text">Issues by member</div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#8C9BAB" tickLine={false} axisLine={false} />
            <YAxis stroke="#8C9BAB" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#282E33', borderColor: '#2C333A', color: '#B6C2CF' }} />
            <Bar dataKey="count" fill="#579DFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
