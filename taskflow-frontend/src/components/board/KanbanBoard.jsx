import KanbanColumn from './KanbanColumn'

const columns = [
  { status: 'TODO', label: 'TO DO' },
  { status: 'IN_PROGRESS', label: 'IN PROGRESS' },
  { status: 'DONE', label: 'DONE' }
]

export default function KanbanBoard({ issues = [], canCreate = false, onIssueClick, onCreateIssue }) {
  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {columns.map((column, i) => (
        <KanbanColumn
          key={column.status}
          index={i}
          status={column.status}
          label={column.label}
          issues={issues.filter((issue) => issue.status === column.status)}
          canCreate={canCreate}
          onCreateIssue={onCreateIssue}
          onIssueClick={onIssueClick}
        />
      ))}
    </div>
  )
}
