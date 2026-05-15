import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">{label}</div>}
      <input
        ref={ref}
        {...props}
        className={`h-9 w-full rounded border-2 border-jira-border bg-jira-surface px-3 text-sm text-jira-text placeholder:text-jira-text-subtle outline-none focus:border-jira-blue-bold focus:shadow-[0_0_0_2px_rgba(87,157,255,0.2)] ${error ? 'border-jira-red-bold' : ''} ${className}`}
      />
      {error && <div className="mt-1 text-xs text-jira-red-bold">{error}</div>}
    </label>
  )
})

export default Input
