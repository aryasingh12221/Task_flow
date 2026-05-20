import Avatar from '../common/Avatar'
import Button from '../common/Button'
import Input from '../common/Input'
import { useState } from 'react'
import UserProfileModal from './UserProfileModal'

export default function MembersPanel({ members = [], canEdit = false, onAddMember, onRemoveMember }) {
  const [email, setEmail] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <div className="px-2">
      {canEdit && onAddMember && (
        <div className="mb-3 flex gap-2 px-2">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Add member by email" className="h-8" />
          <Button size="sm" onClick={() => { onAddMember(email); setEmail('') }}>Add</Button>
        </div>
      )}
      <div className="space-y-1">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm text-jira-text hover:bg-jira-sidebar-icon cursor-pointer group" onClick={() => setSelectedMember(member)}>
            <Avatar name={member.user?.name || member.name} color={member.user?.avatarColor || member.avatarColor} size={24} />
            <div className="min-w-0 flex-1 truncate group-hover:text-jira-blue-bold">{member.user?.name || member.name}</div>
            <span className="text-xs text-jira-text-disabled uppercase px-1.5 py-0.5 rounded bg-jira-bg">{member.role === 'ADMIN' ? 'Admin' : 'Member'}</span>
            {canEdit && onRemoveMember && (
              <button 
                className="text-jira-text-subtle hover:text-red-500 font-bold ml-1 px-1.5 py-0.5 rounded hover:bg-jira-bg/60" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveMember(member.user?.id || member.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <UserProfileModal 
        isOpen={!!selectedMember} 
        onClose={() => setSelectedMember(null)} 
        member={selectedMember} 
      />
    </div>
  )
}
