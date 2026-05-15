import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import StatWidget from '../components/dashboard/StatWidget'
import IssueStatusChart from '../components/dashboard/IssueStatusChart'
import IssuesByAssigneeChart from '../components/dashboard/IssuesByAssigneeChart'
import OverdueIssuesList from '../components/dashboard/OverdueIssuesList'
import { useOutletContext, useParams} from 'react-router-dom'

export default function DashboardPage() {
  const shell = useOutletContext() || {}
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    
    shell.refreshProject?.()
    Promise.all([api.get(`/projects/${id}`), api.get('/dashboard')])
      .then(([projectRes, dashboardRes]) => {
        setProject(projectRes.data.project)
        setData(dashboardRes.data)
      })
      .catch((error) => toast.error(error?.response?.data?.message || 'Failed to load dashboard'))
  }, [])

  const statusData = [
    { name: 'To do', value: data?.todoCount || 0 },
    { name: 'In progress', value: data?.inProgressCount || 0 },
    { name: 'Done', value: data?.doneCount || 0 }
  ]

  const assigneeData = (data?.issuesByUser || []).map((item) => ({ name: item.userName, count: item.count }))

  return (
    <div>
      <TopBar breadcrumb={[{ label: 'Projects', to: '/projects' }, { label: project?.name || 'Project' }, { label: 'Dashboard' }]} />
      <div className="p-4 sm:p-6">
        <div className="mb-6 text-xl font-medium text-jira-text">Dashboard</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatWidget label="Total issues" value={data?.totalIssues || 0} />
          <StatWidget label="In progress" value={data?.inProgressCount || 0} accent="purple" />
          <StatWidget label="Done" value={data?.doneCount || 0} accent="green" />
          <StatWidget label="Overdue" value={data?.overdueCount || 0} accent="red" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <IssueStatusChart data={statusData} />
          <IssuesByAssigneeChart data={assigneeData} />
        </div>
        <div className="mt-6">
          <div className="mb-3 text-sm font-medium text-jira-text">Overdue issues</div>
          <OverdueIssuesList issues={data?.overdueIssues || []} />
        </div>
      </div>
    </div>
  )
}
