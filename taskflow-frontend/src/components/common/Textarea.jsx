export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">{label}</div>}
      <textarea
        {...props}
        className={`min-h-20 w-full resize-y rounded border-2 border-jira-border bg-jira-surface px-3 py-2 text-sm text-jira-text placeholder:text-jira-text-subtle outline-none focus:border-jira-blue-bold focus:shadow-[0_0_0_2px_rgba(87,157,255,0.2)] ${error ? 'border-jira-red-bold' : ''} ${className}`}
      />
      {error && <div className="mt-1 text-xs text-jira-red-bold">{error}</div>}
    </label>
  )
}
