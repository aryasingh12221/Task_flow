import Avatar from '../common/Avatar'
import Button from '../common/Button'
import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import UserProfileModal from './UserProfileModal'

export default function MembersPanel({ members = [], canEdit = false, onAddMember, onRemoveMember }) {
  const [selectedMember, setSelectedMember] = useState(null)
  const [systemUsers, setSystemUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!canEdit) return
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users')
        setSystemUsers(res.data || [])
      } catch (err) {
        console.error('Failed to fetch system users', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [canEdit, members])

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const existingEmails = new Set(
    members.map(m => (m.user?.email || m.email || '').trim().toLowerCase())
  )

  const addableUsers = systemUsers.filter(user => {
    const email = (user.email || '').trim().toLowerCase()
    return !existingEmails.has(email)
  })

  const filteredUsers = addableUsers.filter(user => {
    const query = search.toLowerCase()
    return (
      (user.name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query)
    )
  })

  const handleAdd = () => {
    if (!selectedUser) return
    onAddMember(selectedUser.email)
    setSelectedUser(null)
    setSearch('')
  }

  return (
    <div className="px-2">
      {canEdit && onAddMember && (
        <div className="mb-3 flex gap-2 px-2 relative" ref={dropdownRef}>
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-8 w-full items-center justify-between rounded border border-jira-border bg-jira-bg px-3 text-sm text-jira-text focus:outline-none hover:border-jira-text-subtle/40 transition-colors"
            >
              {selectedUser ? (
                <div className="flex items-center gap-2 truncate">
                  <Avatar name={selectedUser.name} color={selectedUser.avatarColor} size={18} />
                  <span className="truncate">{selectedUser.name} ({selectedUser.email})</span>
                </div>
              ) : (
                <span className="text-jira-text-disabled text-xs">Select user...</span>
              )}
              <span className="ml-2 text-[10px] text-jira-text-subtle">▼</span>
            </button>

            {isOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 rounded border border-jira-border bg-jira-elevated shadow-lg p-2 max-h-64 overflow-y-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="mb-2 h-8 w-full rounded border border-jira-border bg-jira-bg px-2 text-xs text-jira-text focus:outline-none focus:border-jira-blue transition-colors"
                  autoFocus
                />
                
                {loading ? (
                  <div className="py-2 text-center text-xs text-jira-text-subtle">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-2 text-center text-xs text-jira-text-subtle">No users found</div>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user)
                          setIsOpen(false)
                        }}
                        className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs text-jira-text hover:bg-jira-sidebar-icon cursor-pointer ${
                          selectedUser?.id === user.id ? 'bg-jira-sidebar-icon font-medium' : ''
                        }`}
                      >
                        <Avatar name={user.name} color={user.avatarColor} size={20} />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="font-medium">{user.name}</span>
                          <span className="ml-1 text-jira-text-subtle">({user.email})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <Button size="sm" onClick={handleAdd} disabled={!selectedUser} className="h-8">Add</Button>
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
