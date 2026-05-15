import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import KanbanBoard from '../components/board/KanbanBoard'
import CreateIssueModal from '../components/board/CreateIssueModal'
import IssueDetailPanel from '../components/board/IssueDetailPanel'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useOutletContext, useParams } from 'react-router-dom'

export default function BoardPage() {
  const shell = useOutletContext() || {}
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [initialStatus, setInitialStatus] = useState('TODO')
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      
      const [projectRes, issuesRes] = await Promise.all([api.get(`/projects/${id}`), api.get(`/projects/${id}/issues`)])
      setProject(projectRes.data.project)
      setIssues(issuesRes.data)
      shell.refreshProject?.()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load board')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const visibleIssues = useMemo(() => {
    const projectIssues = project?.myRole === 'ADMIN' || !user?.id
      ? issues
      : issues.filter((issue) => issue.assignee?.id === user.id)
    return projectIssues.filter((issue) => issue.title.toLowerCase().includes(search.toLowerCase()))
  }, [issues, project?.myRole, search, user?.id])
  const members = shell.members || []
  const currentUserRole = shell.currentUserRole || project?.myRole || 'MEMBER'
  const activeProject = shell.project || project || {id}

  const createIssue = async (payload) => {
    try {
      const response = await api.post(`/projects/${id}/issues`, {
        title: payload.title,
        description: payload.description,
        issueType: payload.issueType,
        priority: payload.priority,
        status: initialStatus,
        dueDate: payload.dueDate || null,
        assigneeId: payload.assigneeId ? Number(payload.assigneeId) : null
      })
      setIssues((current) => [response.data, ...current])
      toast.success('Issue created')
      setModalOpen(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create issue')
    }
  }

  const saveIssue = async (payload) => {
    try {
      const response = await api.patch(`/issues/${payload.id}`, {
        title: payload.title,
        description: payload.description,
        issueType: payload.issueType,
        priority: payload.priority,
        status: payload.status,
        dueDate: payload.dueDate,
        assigneeId: payload.assignee?.id || null
      })
      setIssues((current) => current.map((issue) => issue.id === response.data.id ? response.data : issue))
      setSelectedIssue(response.data)
      toast.success('Issue updated')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update issue')
    }
  }

  const deleteIssue = async (id) => {
    if (!window.confirm('Delete this issue?')) return
    try {
      await api.delete(`/issues/${id}`)
      setIssues((current) => current.filter((issue) => issue.id !== id))
      setPanelOpen(false)
      toast.success('Issue deleted')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete issue')
    }
  }

  return (
    <div>
      <TopBar breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: project?.name || 'Project' }, { label: 'Board' }]} actionLabel={project?.myRole === 'ADMIN' ? 'Create issue' : undefined} onAction={() => { setInitialStatus('TODO'); setModalOpen(true) }} />
      <div className="flex flex-col gap-3 border-b border-jira-border px-4 py-3 sm:flex-row sm:items-center sm:px-6">
        <div className="w-full sm:w-72"><Input placeholder="Search issues" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <Button variant="secondary" size="sm" onClick={load}>Refresh</Button>
      </div>
      <KanbanBoard
        issues={visibleIssues}
        canCreate={currentUserRole === 'ADMIN'}
        onIssueClick={(issue) => { setSelectedIssue(issue); setPanelOpen(true) }}
        onCreateIssue={(status) => { setInitialStatus(status); setModalOpen(true) }}
      />
      <CreateIssueModal isOpen={modalOpen} onClose={() => setModalOpen(false)} project={activeProject} members={members} initialStatus={initialStatus} onCreate={createIssue} />
      <IssueDetailPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} issue={selectedIssue} members={members} canEdit={true} onSave={saveIssue} onDelete={deleteIssue} />
      {loading && <div className="px-6 text-sm text-jira-text-subtle">Loading issues...</div>}
    </div>
  )
}
