import Avatar from '../common/Avatar'
import { formatDueDate } from '../../utils/dateUtils'

export default function OverdueIssuesList({ issues = [] }) {
  if (!issues.length) {
    return <div className="rounded border border-jira-border bg-jira-surface p-4 text-sm text-jira-green-bold">No overdue issues</div>
  }

  return (
    <div className="rounded border border-jira-border bg-jira-surface">
      {issues.map((issue) => (
        <div key={issue.id} className="flex items-center gap-3 border-b border-jira-border px-4 py-3 last:border-b-0">
          <div className="h-8 w-1 rounded bg-jira-red" />
          <div className="min-w-0 flex-1">
            <div className="text-sm text-jira-text">{issue.issueKey} {issue.title}</div>
            <div className="text-xs text-jira-red-bold">{formatDueDate(issue.dueDate, issue.status)}</div>
          </div>
          {issue.assignee && <Avatar name={issue.assignee.name} color={issue.assignee.avatarColor} size={24} />}
        </div>
      ))}
    </div>
  )
}
