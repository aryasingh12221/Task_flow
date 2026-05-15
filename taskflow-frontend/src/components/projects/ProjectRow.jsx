import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import AvatarGroup from '../common/AvatarGroup'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectRow({ project, index = 0 }) {
  const progress = project.totalIssues ? Math.round((project.doneIssues / project.totalIssues) * 100) : 0

  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="border-b border-jira-border transition-colors hover:bg-jira-surface"
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-jira-blue text-xs font-bold text-white">{project.keyCode?.[0] || project.name?.[0]}</div>
          <Link to={`/projects/${project.id}/board`} className="text-sm font-medium text-jira-blue-bold hover:underline">{project.name}</Link>
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-jira-text-subtle font-mono">{project.keyCode}</td>
      <td className="px-3 py-3 text-sm text-jira-text"><div className="flex items-center gap-2"><Avatar name={project.lead?.name || ''} color={project.lead?.avatarColor || '#0C66E4'} size={20} />{project.lead?.name}</div></td>
      <td className="px-3 py-3"><AvatarGroup users={project.members || []} max={3} /></td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1 w-28 rounded-full bg-jira-overlay"><div className="h-1 rounded-full bg-jira-blue-bold" style={{ width: `${progress}%` }} /></div>
          <span className="text-xs text-jira-text-subtle">{project.doneIssues}/{project.totalIssues}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-sm text-jira-text-subtle">{formatDistanceToNow(new Date(project.updatedAt || project.createdAt), { addSuffix: true })}</td>
    </motion.tr>
  )
}
