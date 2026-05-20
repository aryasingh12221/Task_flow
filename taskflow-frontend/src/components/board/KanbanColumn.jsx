import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import IssueCard from './IssueCard'

export default function KanbanColumn({ status, label, issues = [], canCreate = false, onCreateIssue, onIssueClick, onIssueDrop, index = 0 }) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const idStr = e.dataTransfer.getData('text/plain')
    if (idStr && onIssueDrop) {
      onIssueDrop(Number(idStr), status)
    }
    setIsOver(false)
  }

  return (
    <motion.section 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
      className="flex min-w-[280px] max-w-[340px] flex-1 flex-col"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="text-xs font-bold uppercase text-jira-text-subtle">{label}</div>
        <div className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-jira-overlay px-1 text-[11px] text-jira-text-subtle">{issues.length}</div>
        {canCreate && <Button variant="subtle" size="sm" className="ml-auto h-7 w-7 p-0" onClick={() => onCreateIssue?.(status)}><Plus size={14} /></Button>}
      </div>
      <div className={`flex flex-1 flex-col gap-2 rounded-lg p-2 min-h-[400px] transition-all duration-200 ${isOver ? 'bg-jira-blue-bg/10 border-2 border-dashed border-jira-blue-bold/50' : 'bg-transparent border border-transparent'}`}>
        {issues.length === 0 ? (
          <div className="rounded border border-dashed border-jira-border px-3 py-6 text-center text-xs text-jira-text-disabled">No issues</div>
        ) : issues.map((issue, i) => <IssueCard key={issue.id} issue={issue} index={i} onClick={() => onIssueClick?.(issue)} />)}
      </div>
    </motion.section>
  )
}
