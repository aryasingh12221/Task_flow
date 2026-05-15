import Avatar from './Avatar'

export default function AvatarGroup({ users = [], max = 3 }) {
  const visible = users.slice(0, max)
  const overflow = users.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((user, index) => (
        <div key={user.id} className={index ? '-ml-1.5' : ''}>
          <Avatar name={user.name} size={24} color={user.avatarColor} />
        </div>
      ))}
      {overflow > 0 && (
        <div className="-ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-jira-border bg-jira-overlay text-[11px] text-jira-text-subtle">
          +{overflow}
        </div>
      )}
    </div>
  )
}
