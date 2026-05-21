import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import ProjectsTable from '../components/projects/ProjectsTable'
import CreateProjectModal from '../components/projects/CreateProjectModal'
import { getLastProjectId, saveLastProjectId } from '../utils/tokenUtils'
import { useAuth } from '../hooks/useAuth'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const isMember = user?.role === 'MEMBER'

  const load = async () => {
    try {
      setLoading(true)
      const response = await api.get('/projects')
      setProjects(response.data)
      if (response.data?.length && !getLastProjectId()) {
        saveLastProjectId(response.data[0].id)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createProject = async (payload) => {
    try {
      await api.post('/projects', payload)
      toast.success('Project created!')
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create project')
    }
  }

  return (
    <div>
      <TopBar 
        breadcrumb={[{ label: 'Projects' }]} 
        actionLabel={isMember ? null : "Create project"} 
        onAction={isMember ? null : () => setOpen(true)} 
      />
      <div className="p-6">
        <div className="mb-6 text-2xl font-medium text-jira-text">Projects</div>
        <ProjectsTable projects={projects} loading={loading} onCreate={() => setOpen(true)} canCreate={!isMember} />
      </div>
      {!isMember && <CreateProjectModal isOpen={open} onClose={() => setOpen(false)} onCreate={createProject} />}
    </div>
  )
}
