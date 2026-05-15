import { useEffect, useState } from 'react'
import SlidePanel from '../common/SlidePanel'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import Avatar from '../common/Avatar'
import { IssueTypeIcon, PriorityIcon } from '../common/Badge'
import { formatDateTime } from '../../utils/dateUtils'

export default function IssueDetailPanel({ isOpen, onClose, issue, members = [], canEdit = false, onSave, onDelete }) {
  const [form, setForm] = useState(issue || null)

  useEffect(() => {
    setForm(issue || null)
  }, [issue, isOpen])

  if (!issue) return <SlidePanel isOpen={isOpen} onClose={onClose} />

  const current = form || issue

  const update = (patch) => setForm((value) => ({ ...(value || issue), ...patch }))

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose}>
      <div className="flex min-h-full flex-col">
        <div className="flex flex-col gap-4 border-b border-jira-border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-sm text-jira-blue-bold"><IssueTypeIcon type={current.issueType} /> <span className="font-mono">{current.issueKey}</span></div>
            {canEdit ? <Input value={current.title} onChange={(e) => update({ title: e.target.value })} className="text-base font-medium sm:text-xl" /> : <div className="break-words text-xl font-medium text-jira-text sm:text-2xl">{current.title}</div>}
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {canEdit && <Button variant="danger" onClick={() => onDelete?.(current.id)}>Delete</Button>}
            <Button onClick={() => onSave?.(current)}>Save</Button>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[65%_35%]">
          <div className="border-b border-jira-border p-4 lg:border-b-0 lg:border-r lg:p-6">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Description</div>
            {canEdit ? <Textarea value={current.description || ''} onChange={(e) => update({ description: e.target.value })} placeholder="Add a description..." /> : <div className="text-sm text-jira-text-subtle">{current.description || 'No description provided'}</div>}
          </div>
          <div className="space-y-4 p-4 lg:p-6">
            <Select label="Status" value={current.status} disabled={!canEdit} onChange={(e) => update({ status: e.target.value })}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
            <Select label="Assignee" value={current.assignee?.id || ''} disabled={!canEdit} onChange={(e) => update({ assignee: members.find((member) => String(member.user?.id || member.id) === e.target.value)?.user || null })}>
              <option value="">Unassigned</option>
              {members.map((member) => <option key={member.user?.id || member.id} value={member.user?.id || member.id}>{member.user?.name || member.name}</option>)}
            </Select>
            <Select label="Priority" value={current.priority} disabled={!canEdit} onChange={(e) => update({ priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
            <Select label="Issue type" value={current.issueType} disabled={!canEdit} onChange={(e) => update({ issueType: e.target.value })}>
              <option value="TASK">Task</option>
              <option value="BUG">Bug</option>
              <option value="STORY">Story</option>
            </Select>
            <div>
              <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Reporter</div>
              <div className="flex items-center gap-2 text-sm text-jira-text"><Avatar name={current.reporter?.name || ''} color={current.reporter?.avatarColor || '#0C66E4'} />{current.reporter?.name}</div>
            </div>
            <Input label="Due date" type="date" value={current.dueDate ? String(current.dueDate).replaceAll(',','-'): ''} disabled={!canEdit} onChange={(e) => update({ dueDate: e.target.value })} />
            <div><div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Created</div><div className="text-sm text-jira-text">{formatDateTime(current.createdAt)}</div></div>
            <div><div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Updated</div><div className="text-sm text-jira-text">{formatDateTime(current.updatedAt)}</div></div>
            <div className="pt-2"><PriorityIcon priority={current.priority} /></div>
          </div>
        </div>
      </div>
    </SlidePanel>
  )
}
