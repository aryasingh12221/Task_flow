import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useOutletContext, useParams } from 'react-router-dom'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import MembersPanel from '../components/members/MembersPanel'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'

export default function ProjectSettingsPage() {
  const shell = useOutletContext() || {}
  const { id } = useParams()
  const [project, setProject] = useState(shell.project || null)
  const [members, setMembers] = useState(shell.members || [])
  const [joinRequests, setJoinRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const loadJoinRequests = async (isAdmin) => {
    if (!isAdmin) return
    try {
      const response = await api.get(`/projects/${id}/join-requests`)
      setJoinRequests(response.data || [])
    } catch (error) {
      console.error('Failed to load join requests', error)
    }
  }

  const load = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/projects/${id}`)
      setProject(response.data.project)
      setMembers(response.data.members || [])
      shell.refreshProject?.()
      
      const isAdmin = response.data.project?.myRole === 'ADMIN'
      await loadJoinRequests(isAdmin)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load project settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const addMember = async (email) => {
    try {
      const response = await api.post(`/projects/${id}/members`, { email })
      setProject(response.data.project)
      setMembers(response.data.members || [])
      shell.refreshProject?.()
      toast.success('Member added')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add member')
    }
  }

  const removeMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`)
      await load()
      shell.refreshProject?.()
      toast.success('Member removed')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove member')
    }
  }

  const resolveRequest = async (requestId, status) => {
    try {
      await api.post(`/projects/${id}/join-requests/${requestId}/resolve`, { status })
      toast.success(`Request ${status.toLowerCase()}ed!`)
      await load()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to resolve request')
    }
  }

  const deleteProject = async () => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted')
      window.location.href = '#/projects'
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete project')
    }
  }

  return (
    <div>
      <TopBar breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: project?.name || 'Project' }, { label: 'Settings' }]} />
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <div className="text-2xl font-medium text-jira-text">Project settings</div>
          <div className="mt-1 text-sm text-jira-text-subtle">Manage members and project access.</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-jira-border bg-jira-elevated p-5">
              <div className="mb-4 text-sm font-medium text-jira-text">Members</div>
              <MembersPanel members={members} canEdit={project?.myRole === 'ADMIN'} onAddMember={addMember} onRemoveMember={removeMember} />
            </section>

            {project?.myRole === 'ADMIN' && (
              <section className="rounded-lg border border-jira-border bg-jira-elevated p-5">
                <div className="mb-4 text-sm font-medium text-jira-text">Pending Join Requests</div>
                {joinRequests.length === 0 ? (
                  <div className="text-xs text-jira-text-subtle">No pending join requests.</div>
                ) : (
                  <div className="divide-y divide-jira-border/60">
                    {joinRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <Avatar name={req.user.name} color={req.user.avatarColor} size={32} />
                          <div>
                            <div className="text-sm font-medium text-jira-text">{req.user.name}</div>
                            <div className="text-xs text-jira-text-subtle">{req.user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-jira-blue hover:bg-jira-blue-bold text-white border-transparent text-xs py-1"
                            onClick={() => resolveRequest(req.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="text-xs py-1"
                            onClick={() => resolveRequest(req.id, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          <section className="rounded-lg border border-jira-border bg-jira-elevated p-5 h-fit">
            <div className="mb-4 text-sm font-medium text-jira-text">Project info</div>
            <div className="space-y-3 text-sm text-jira-text-subtle">
              <div>
                <div className="text-xs uppercase tracking-[0.04em] text-jira-text-disabled">Name</div>
                <div className="text-jira-text">{project?.name || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.04em] text-jira-text-disabled">Key</div>
                <div className="font-mono text-jira-text">{project?.keyCode || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.04em] text-jira-text-disabled">Description</div>
                <div className="text-jira-text">{project?.description || 'No description'}</div>
              </div>
            </div>
            <div className="mt-6 border-t border-jira-border pt-4">
              <Button variant="danger" size="sm" onClick={deleteProject} disabled={project?.myRole !== 'ADMIN'}>
                Delete project
              </Button>
            </div>
          </section>
        </div>

        {loading && <div className="mt-4 text-sm text-jira-text-subtle">Loading project settings...</div>}
      </div>
    </div>
  )
}