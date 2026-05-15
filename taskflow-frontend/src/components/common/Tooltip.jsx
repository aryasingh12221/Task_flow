export default function Tooltip({ children, text }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-jira-border bg-jira-elevated px-2 py-1 text-xs text-jira-text opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        {text}
      </div>
    </div>
  )
}
