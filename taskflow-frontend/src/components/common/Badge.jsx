import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUp, Bug, CheckSquare2, Bookmark } from 'lucide-react'

export const STATUS_LABELS = {
  TODO: 'TO DO',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE'
}

export function StatusBadge({ status }) {
  const classes = {
    TODO: 'bg-jira-overlay text-jira-text-subtle',
    IN_PROGRESS: 'bg-jira-blue-bg text-jira-blue-bold',
    DONE: 'bg-jira-green-bg text-jira-green-bold'
  }
  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`inline-flex cursor-default rounded px-2 py-0.5 text-xs font-bold uppercase transition-shadow hover:shadow-sm ${classes[status]}`}
    >
      {STATUS_LABELS[status]}
    </motion.span>
  )
}

export function IssueTypeIcon({ type, className = 'h-4 w-4' }) {
  if (type === 'BUG') return <Bug className={`${className} text-jira-red-bold`} />
  if (type === 'STORY') return <Bookmark className={`${className} text-jira-green-bold`} />
  return <CheckSquare2 className={`${className} text-jira-blue-bold`} />
}

export function PriorityIcon({ priority, className = 'h-4 w-4' }) {
  if (priority === 'HIGH') return <ArrowUp className={`${className} text-jira-red-bold`} />
  if (priority === 'LOW') return <ArrowDown className={`${className} text-jira-green-bold`} />
  return <ArrowRight className={`${className} text-jira-yellow`} />
}
