import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import IssueCard from './IssueCard'

export default function KanbanColumn({ status, label, issues = [], canCreate = false, onCreateIssue, onIssueClick, index = 0 }) {
  return (
    <motion.section 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
      className="flex min-w-[280px] max-w-[340px] flex-1 flex-col"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="text-xs font-bold uppercase text-jira-text-subtle">{label}</div>
        <div className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-jira-overlay px-1 text-[11px] text-jira-text-subtle">{issues.length}</div>
        {canCreate && <Button variant="subtle" size="sm" className="ml-auto h-7 w-7 p-0" onClick={() => onCreateIssue?.(status)}><Plus size={14} /></Button>}
      </div>
      <div className="flex flex-col gap-2">
        {issues.length === 0 ? (
          <div className="rounded border border-dashed border-jira-border px-3 py-6 text-center text-xs text-jira-text-disabled">No issues</div>
        ) : issues.map((issue, i) => <IssueCard key={issue.id} issue={issue} index={i} onClick={() => onIssueClick?.(issue)} />)}
      </div>
    </motion.section>
  )
}
