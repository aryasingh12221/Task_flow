import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Select from '../common/Select'
import { StatusBadge, IssueTypeIcon } from '../common/Badge'

export default function CreateIssueModal({ isOpen, onClose, project, members = [], initialStatus = 'TODO', onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', issueType: 'TASK', priority: 'MEDIUM', dueDate: '', assigneeId: '', status: initialStatus ||'TODO' })

  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', description: '', issueType: 'TASK', priority: 'MEDIUM', dueDate: '', assigneeId: '' , status:initialStatus || 'TODO'})
    }
  }, [initialStatus, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create issue">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {['TASK', 'BUG', 'STORY'].map((type) => (
            <button key={type} type="button" onClick={() => setForm((current) => ({ ...current, issueType: type }))} className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${form.issueType === type ? 'border-jira-blue-bold bg-jira-blue-bg text-jira-blue-bold' : 'border-jira-border bg-jira-surface text-jira-text'}`}>
              <IssueTypeIcon type={type} /> {type[0] + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <Input label="Project" value={project?.name || ''} readOnly />
        <Input label="Summary" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
        <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Priority" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
          <Input label="Due date" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Assignee" value={form.assigneeId} onChange={(event) => setForm((current) => ({ ...current, assigneeId: event.target.value }))}>
            <option value="">Unassigned</option>
            {members.map((member) => {
              const memberId = member.user?.id || member.id
              return <option key={memberId} value={memberId}>{member.user?.name || member.name}</option>
            })}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onCreate?.(form)}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}
