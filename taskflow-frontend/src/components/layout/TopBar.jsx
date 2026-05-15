import { Link } from 'react-router-dom'
import Button from '../common/Button'

export default function TopBar({ breadcrumb = [], actionLabel, onAction, rightSlot }) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-jira-border bg-jira-sidebar px-6">
      <div className="flex items-center gap-1 text-sm text-jira-text-subtle">
        {breadcrumb.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && <span className="text-jira-text-disabled">&gt;</span>}
            {item.to ? <Link to={item.to} className="text-jira-blue-bold hover:underline">{item.label}</Link> : <span>{item.label}</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
    </header>
  )
}
