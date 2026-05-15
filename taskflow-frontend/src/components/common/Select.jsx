import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">{label}</div>}
      <div className="relative">
        <select
          {...props}
          className={`h-9 w-full appearance-none rounded border-2 border-jira-border bg-jira-surface px-3 pr-9 text-sm text-jira-text outline-none focus:border-jira-blue-bold focus:shadow-[0_0_0_2px_rgba(87,157,255,0.2)] ${error ? 'border-jira-red-bold' : ''} ${className}`}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-jira-text-subtle" size={16} />
      </div>
      {error && <div className="mt-1 text-xs text-jira-red-bold">{error}</div>}
    </label>
  )
}
