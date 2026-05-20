import Modal from '../common/Modal'
import Avatar from '../common/Avatar'
import { Mail, Shield, Calendar } from 'lucide-react'

export default function UserProfileModal({ isOpen, onClose, member }) {
  if (!member) return null

  const { user, role, joinedAt } = member

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <Avatar name={user?.name || 'User'} color={user?.avatarColor} size={64} />
        
        <div>
          <h2 className="text-xl font-semibold text-jira-text">{user?.name}</h2>
          <p className="text-sm text-jira-text-subtle">{user?.email}</p>
        </div>

        <div className="w-full border-t border-jira-border/60 my-2 pt-4 text-left space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-jira-text-subtle" />
            <div>
              <span className="text-xs text-jira-text-disabled block uppercase tracking-wider">Email</span>
              <span className="text-jira-text font-medium">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Shield size={16} className="text-jira-text-subtle" />
            <div>
              <span className="text-xs text-jira-text-disabled block uppercase tracking-wider">Project Role</span>
              <span className="text-jira-text font-medium text-jira-blue-bold">{role || 'MEMBER'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Shield size={16} className="text-jira-text-subtle" />
            <div>
              <span className="text-xs text-jira-text-disabled block uppercase tracking-wider">Global System Role</span>
              <span className="text-jira-text font-medium">{user?.role === 'SYSTEM_ADMIN' ? 'System Administrator' : 'Standard User'}</span>
            </div>
          </div>

          {joinedAt && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-jira-text-subtle" />
              <div>
                <span className="text-xs text-jira-text-disabled block uppercase tracking-wider">Joined Project On</span>
                <span className="text-jira-text font-medium">{new Date(joinedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
