import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LayoutDashboard, BarChart2, Settings, LogOut, Home } from 'lucide-react'
import GlobalSidebar from './GlobalSidebar'
import ProjectSidebar from './ProjectSidebar'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'
import { saveLastProjectId } from '../../utils/tokenUtils'

export default function AppShell({ children, project, members = [], currentUserRole, onAddMember, onRemoveMember }) {
  const location = useLocation()
  const { logout } = useAuth()
  const { id } = useParams()
  const showProjectSidebar = location.pathname.startsWith(`/projects/${id}/`)
  const [projectData, setProjectData] = useState(project || null)
  const [memberData, setMemberData] = useState(members)
  const [role, setRole] = useState(currentUserRole || 'MEMBER')

  useEffect(() => {
    if (!showProjectSidebar || !id) return
    let active = true
    if (id && id !== 'undefined') {
  saveLastProjectId(id)
}

    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`)
        if (!active) return
        setProjectData(response.data.project)
        setMemberData(response.data.members || [])
        setRole(response.data.project?.myRole || 'MEMBER')
      } catch {
        if (active) toast.error('Failed to load project')
      }
    }

    loadProject()
    return () => {
      active = false
    }
  }, [id, showProjectSidebar])

  const refreshProject = async () => {
    if (!id) return
    const response = await api.get(`/projects/${id}`)
    setProjectData(response.data.project)
    setMemberData(response.data.members || [])
    setRole(response.data.project?.myRole || 'MEMBER')
  }

  const handleAddMember = async (email) => {
    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Enter a member email')
      return
    }
    try {
      const response = await api.post(`/projects/${id}/members`, { email: trimmed })
      setProjectData(response.data.project)
      setMemberData(response.data.members || [])
      setRole(response.data.project?.myRole || 'MEMBER')
      toast.success('Member added')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add member')
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`)
      await refreshProject()
      toast.success('Member removed')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove member')
    }
  }

  const context = {
    project: projectData,
    members: memberData,
    currentUserRole: role,
    refreshProject,
    addMember: handleAddMember,
    removeMember: handleRemoveMember
  }

  const mobileNavItems = showProjectSidebar ? [
    { to: `/projects/${id}/board`, label: 'Board', icon: LayoutDashboard },
    { to: `/projects/${id}/dashboard`, label: 'Dashboard', icon: BarChart2 },
    { to: `/projects/${id}/settings`, label: 'Settings', icon: Settings },
    { to: '/projects', label: 'Projects', icon: Home }
  ] : [
    { to: '/projects', label: 'Projects', icon: Home }
  ]

  return (
    <div className="min-h-screen bg-jira-bg text-jira-text">
      <GlobalSidebar />
      {showProjectSidebar && (
        <ProjectSidebar project={projectData} members={memberData} currentUserRole={role} onAddMember={handleAddMember} onRemoveMember={handleRemoveMember} />
      )}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-jira-border bg-jira-sidebar px-3 md:hidden">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {mobileNavItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link key={label} to={to} className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${active ? 'bg-jira-blue-bg text-jira-blue-bold' : 'text-jira-text-subtle'}`}>
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
        <button type="button" onClick={logout} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-jira-text-subtle">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
      <main className={`${showProjectSidebar ? 'md:pl-[296px]' : 'md:pl-14'} min-h-screen pt-0 md:pt-0`}>
        <Outlet context={context} />
      </main>
    </div>
  )
}
