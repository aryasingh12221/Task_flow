import Button from './Button'

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  const Icon = icon
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-jira-border p-8 text-center">
      {Icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jira-overlay text-jira-text-subtle"><Icon size={24} /></div>}
      <div className="text-base font-medium text-jira-text">{title}</div>
      <div className="mt-1 max-w-md text-sm text-jira-text-subtle">{description}</div>
      {actionLabel && onAction && <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
