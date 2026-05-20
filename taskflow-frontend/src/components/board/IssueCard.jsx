import { motion } from 'framer-motion'
import Avatar from '../common/Avatar'
import { IssueTypeIcon, PriorityIcon } from '../common/Badge'

export default function IssueCard({ issue, onClick, index = 0 }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', String(issue.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.2, 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        delay: index * 0.05
      }}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      className="cursor-pointer rounded border border-jira-border bg-jira-surface p-3 transition-colors duration-150 hover:border-jira-blue-bold hover:shadow-md select-none"
    >
      <div className="line-clamp-2 text-sm text-jira-text">{issue.title}</div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-jira-text-subtle">
        <div className="flex items-center gap-1.5">
          <IssueTypeIcon type={issue.issueType} />
          <span className="font-mono">#{issue.issueKey}</span>
        </div>
        <div className="flex items-center gap-2">
          <PriorityIcon priority={issue.priority} />
          {issue.assignee ? <Avatar name={issue.assignee.name} color={issue.assignee.avatarColor} size={20} /> : <span>Unassigned</span>}
        </div>
      </div>
    </motion.div>
  )
}
