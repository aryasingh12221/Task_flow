export default function StatWidget({ label, value, accent = 'blue' }) {
  const bg = accent === 'green' ? 'bg-jira-green-bg' : accent === 'red' ? 'bg-jira-red-bg' : accent === 'purple' ? 'bg-jira-purple-bg' : 'bg-jira-blue-bg'
  const color = accent === 'green' ? 'text-jira-green-bold' : accent === 'red' ? 'text-jira-red-bold' : accent === 'purple' ? 'text-jira-purple-bold' : 'text-jira-blue-bold'
  return (
    <div className={`rounded border border-jira-border bg-jira-surface p-4 ${bg}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
