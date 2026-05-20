import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Globe, Users, ArrowRight } from 'lucide-react'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadExploreProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/projects/explore')
      setProjects(response.data)
    } catch {
      toast.error('Failed to load public projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExploreProjects()
  }, [])

  const handleJoinRequest = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/join`)
      toast.success('Join request sent!')
      // Update local state to reflect request status
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return { ...p, myRole: 'PENDING' }
        }
        return p
      }))
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit request')
    }
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.keyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-jira-bg text-jira-text">
      <TopBar breadcrumb={[{ label: 'Home', to: '/projects' }, { label: 'Explore Projects' }]} />
      <div className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Explore Projects</h1>
            <p className="text-sm text-jira-text-subtle">Discover public workspaces and join teams across the platform</p>
          </div>
          
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center text-jira-text-subtle">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded border border-jira-border bg-jira-elevated py-1.5 pl-9 pr-3 text-sm text-jira-text outline-none focus:border-jira-blue"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-jira-text-subtle">Loading public projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-jira-border bg-jira-elevated/40 p-12 text-center text-jira-text-subtle">
            <Globe className="mx-auto mb-3 text-jira-text-subtle" size={32} />
            <p className="font-medium text-jira-text">No public projects found</p>
            <p className="text-xs">Either you are already a member of all public projects, or there aren't any matching search parameters.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex flex-col justify-between rounded-lg border border-jira-border bg-jira-elevated p-5 transition-shadow hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-white"
                        style={{ backgroundColor: project.avatarColor || '#0C66E4' }}
                      >
                        {project.keyCode}
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-jira-text">{project.name}</h2>
                        <span className="text-xs text-jira-text-subtle">Key: {project.keyCode}</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded bg-jira-blue-bg/40 px-2 py-0.5 text-xs text-jira-blue-bold">
                      <Globe size={12} /> Public
                    </span>
                  </div>
                  
                  <p className="mb-4 text-xs text-jira-text-subtle line-clamp-3 min-h-[48px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 border-t border-jira-border/60 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.lead && (
                      <Avatar name={project.lead.name} color={project.lead.avatarColor} size={24} />
                    )}
                    <div className="text-xs">
                      <span className="text-jira-text-subtle block leading-none">Lead</span>
                      <span className="text-jira-text font-medium">{project.lead?.name || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-jira-text-subtle" title="Total Members">
                      <Users size={12} /> {project.members}
                    </span>

                    {project.myRole === 'PENDING' ? (
                      <Button disabled className="bg-jira-border text-jira-text-subtle border-transparent py-1 text-xs">
                        Pending Approval
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJoinRequest(project.id)}
                        className="py-1 text-xs flex items-center gap-1"
                      >
                        Request to Join <ArrowRight size={12} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
