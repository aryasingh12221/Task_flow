export default function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-jira-blue-bold" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
