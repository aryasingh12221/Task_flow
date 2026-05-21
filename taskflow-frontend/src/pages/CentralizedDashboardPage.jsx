import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Avatar from '../components/common/Avatar'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Download, 
  Clipboard, 
  Search, 
  Filter, 
  Calendar, 
  RefreshCw,
  Shield,
  UserCheck,
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

export default function CentralizedDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRole, setSelectedRole] = useState(user?.role || 'MEMBER')
  
  // EOD Submission Form State
  const [eodToday, setEodToday] = useState('')
  const [eodBlockers, setEodBlockers] = useState('')
  const [eodPending, setEodPending] = useState('')
  const [isSubmittingEod, setIsSubmittingEod] = useState(false)

  // Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard')
      setData(response.data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load centralized dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
    if (user?.role) {
      setSelectedRole(user.role)
    }
  }, [user])

  // Custom role change handler for demo purposes
  const handleRoleChange = (role) => {
    setSelectedRole(role)
    toast.success(`Switched cockpit view to ${role.replace('_', ' ')}`)
  }

  // Handle EOD submitter
  const handleEodSubmit = (e) => {
    e.preventDefault()
    if (!eodToday.trim()) {
      toast.error('Please enter completed tasks')
      return
    }
    setIsSubmittingEod(true)
    setTimeout(() => {
      toast.success('Your EOD status has been compiled successfully!')
      setEodToday('')
      setEodPending('')
      setEodBlockers('')
      setIsSubmittingEod(false)
    }, 1000)
  }

  // Download EOD report
  const downloadEodReport = () => {
    if (!data?.eodReport?.markdownSummary) return
    const blob = new Blob([data.eodReport.markdownSummary], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `EOD_Report_${new Date().toISOString().slice(0,10)}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Report downloaded!')
  }

  // Copy EOD to clipboard
  const copyEodToClipboard = () => {
    if (!data?.eodReport?.markdownSummary) return
    navigator.clipboard.writeText(data.eodReport.markdownSummary)
    toast.success('Copied report to clipboard!')
  }

  // Aggregate and filter tasks
  const allTasks = useMemo(() => {
    if (!data) return []
    const tasks = []
    
    // We can extract all tasks from activeProjects or eodReport pending/completed lists,
    // but the most comprehensive way is compiling from overdue, recent and completed lists.
    // To make sure the user has a full searchable list, we will aggregate all available tasks:
    const map = new Map()
    
    if (data.recentIssues) data.recentIssues.forEach(t => map.set(t.id, t))
    if (data.overdueIssues) data.overdueIssues.forEach(t => map.set(t.id, t))
    if (data.eodReport?.completedToday) data.eodReport.completedToday.forEach(t => map.set(t.id, t))
    if (data.eodReport?.pendingTasks) data.eodReport.pendingTasks.forEach(t => map.set(t.id, t))
    if (data.eodReport?.blockers) data.eodReport.blockers.forEach(t => map.set(t.id, t))
    
    return Array.from(map.values())
  }, [data])

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.issueKey.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || 
                            (statusFilter === 'OVERDUE' && task.overdue) ||
                            task.status === statusFilter
                            
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [allTasks, searchTerm, statusFilter, priorityFilter])

  // Pie chart data
  const pieData = [
    { name: 'Pending', value: data?.todoCount || 0, color: '#F1A10D' },
    { name: 'In progress', value: data?.inProgressCount || 0, color: '#6E5DC6' },
    { name: 'Blocked', value: data?.blockedCount || 0, color: '#CA3521' },
    { name: 'Completed', value: data?.doneCount || 0, color: '#1F845A' }
  ].filter(d => d.value > 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-jira-bg text-jira-text">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-jira-blue" />
          <span className="text-sm font-medium">Analyzing operations and compiling forecast models...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jira-bg text-jira-text pb-12">
      <TopBar 
        breadcrumb={[{ label: 'Operations Dashboard' }]} 
        actionLabel="Refresh operations" 
        onAction={fetchDashboard} 
      />

      {/* Role Picker Banner */}
      <div className="mx-4 mt-4 sm:mx-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-jira-blue/20 bg-jira-blue-bg/40 p-3 sm:px-4">
        <div className="flex items-center gap-2 text-sm text-jira-blue-bold font-medium">
          <Shield size={16} />
          <span>Role-Based Cockpit Simulator:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleRoleChange('SYSTEM_ADMIN')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-semibold border transition-all ${selectedRole === 'SYSTEM_ADMIN' ? 'bg-jira-blue text-white border-jira-blue shadow' : 'bg-jira-elevated text-jira-text-subtle border-jira-border hover:text-jira-text'}`}
          >
            <Shield size={12} /> Admin Cockpit
          </button>
          <button 
            onClick={() => handleRoleChange('MANAGER')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-semibold border transition-all ${selectedRole === 'MANAGER' ? 'bg-jira-blue text-white border-jira-blue shadow' : 'bg-jira-elevated text-jira-text-subtle border-jira-border hover:text-jira-text'}`}
          >
            <UserCheck size={12} /> Manager Cockpit
          </button>
          <button 
            onClick={() => handleRoleChange('MEMBER')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-semibold border transition-all ${selectedRole === 'MEMBER' ? 'bg-jira-blue text-white border-jira-blue shadow' : 'bg-jira-elevated text-jira-text-subtle border-jira-border hover:text-jira-text'}`}
          >
            <Users size={12} /> Team Member Cockpit
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-jira-border pb-px mb-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'overview' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
          >
            <LayoutDashboard size={14} className="inline mr-1.5 -mt-0.5" /> Operations Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'projects' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
          >
            <Layers size={14} className="inline mr-1.5 -mt-0.5" /> Project Progress & Timelines
          </button>

          {(selectedRole === 'SYSTEM_ADMIN' || selectedRole === 'MANAGER') && (
            <button 
              onClick={() => setActiveTab('team')}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'team' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
            >
              <Users size={14} className="inline mr-1.5 -mt-0.5" /> Team Workload & Productivity
            </button>
          )}

          {(selectedRole === 'SYSTEM_ADMIN' || selectedRole === 'MANAGER') && (
            <button 
              onClick={() => setActiveTab('forecasting')}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'forecasting' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
            >
              <TrendingUp size={14} className="inline mr-1.5 -mt-0.5" /> Forecasts & Utilization
            </button>
          )}

          <button 
            onClick={() => setActiveTab('eod')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'eod' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
          >
            <FileSpreadsheet size={14} className="inline mr-1.5 -mt-0.5" /> EOD Operations Hub
          </button>

          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 transition-all ${activeTab === 'pipeline' ? 'border-jira-blue text-jira-blue-bold' : 'border-transparent text-jira-text-subtle hover:text-jira-text'}`}
          >
            <Filter size={14} className="inline mr-1.5 -mt-0.5" /> Global Task Pipeline
          </button>
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <h2 className="text-xl font-medium text-jira-text">Centralized Operations Overview</h2>
              <p className="text-sm text-jira-text-subtle mt-0.5">High-level operational stats and workload breakout across all active running pipelines.</p>
            </div>

            {/* Premium Stat Widgets Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">Active Projects</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-white">{data?.totalProjects || 0}</span>
                  <span className="text-xs text-jira-blue px-2 py-0.5 rounded bg-jira-blue-bg font-semibold">Live</span>
                </div>
              </div>

              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">Total Pipeline Tasks</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-white">{data?.totalIssues || 0}</span>
                  <span className="text-xs text-jira-text-subtle font-medium">tasks</span>
                </div>
              </div>

              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all border-l-4 border-l-red-500">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">Blocked Tasks</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-red-400">{data?.blockedCount || 0}</span>
                  <span className="text-xs text-red-400 px-2 py-0.5 rounded bg-red-500/10 font-semibold">Critical</span>
                </div>
              </div>

              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all border-l-4 border-l-yellow-500">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">Pending Tasks</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-yellow-400">{data?.todoCount + data?.pendingCount || 0}</span>
                  <span className="text-xs text-yellow-400 px-2 py-0.5 rounded bg-yellow-500/10 font-semibold">Backlog</span>
                </div>
              </div>

              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all border-l-4 border-l-purple-500">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">In Progress</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-purple-400">{data?.inProgressCount || 0}</span>
                  <span className="text-xs text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 font-semibold">Active</span>
                </div>
              </div>

              <div className="rounded-lg border border-jira-border bg-jira-elevated p-4 hover:border-jira-border-hover transition-all border-l-4 border-l-green-500">
                <span className="text-xs font-semibold text-jira-text-disabled uppercase">Completed</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight text-green-400">{data?.doneCount || 0}</span>
                  <span className="text-xs text-green-400 px-2 py-0.5 rounded bg-green-500/10 font-semibold">Shipped</span>
                </div>
              </div>
            </div>

            {/* Core analytics blocks */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Pie Chart Widget */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Status Distribution</h3>
                  <p className="text-xs text-jira-text-subtle">Visual task allocation breakdown across all active sprints.</p>
                </div>
                
                <div className="h-44 w-full flex items-center justify-center my-3">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#282E33', border: '1px solid #454F59', borderRadius: '4px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs text-jira-text-disabled">No data available</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span className="text-jira-text-subtle">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings and delays cockpit block */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 text-red-400">
                    <AlertTriangle size={15} /> Delay and Bottleneck Risk Warnings
                  </h3>
                  <p className="text-xs text-jira-text-subtle mb-4">Accountability insights and proactive risk assessments compiled from pipeline deadlines.</p>
                </div>

                <div className="flex-1 space-y-3 max-h-56 overflow-y-auto pr-1">
                  {data?.forecasting?.potentialDelays?.length === 0 && data?.forecasting?.potentialBottlenecks?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6">
                      <CheckCircle2 className="h-10 w-10 text-green-400 mb-2" />
                      <span className="text-sm font-medium text-white">Pipeline operations running flawlessly!</span>
                      <span className="text-xs text-jira-text-subtle">No bottlenecks or delays detected.</span>
                    </div>
                  ) : (
                    <>
                      {/* Potential Delays */}
                      {data?.forecasting?.potentialDelays?.map((delay, index) => (
                        <div key={`delay-${index}`} className="flex items-start gap-3 rounded bg-red-950/20 border border-red-900/30 p-3">
                          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-white block">Timeline Delay Warning</span>
                            <span className="text-xs text-red-300/90 mt-0.5 block">{delay}</span>
                          </div>
                        </div>
                      ))}

                      {/* Potential Bottlenecks */}
                      {data?.forecasting?.potentialBottlenecks?.map((bottleneck, index) => (
                        <div key={`bottle-${index}`} className="flex items-start gap-3 rounded bg-yellow-950/20 border border-yellow-900/30 p-3">
                          <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-white block">Team Capacity Bottleneck</span>
                            <span className="text-xs text-yellow-300/90 mt-0.5 block">{bottleneck}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-jira-border text-[11px] text-jira-text-subtle">
                  Proactive analysis updated every 24 hours based on average team velocities.
                </div>
              </div>
            </div>

            {/* Overdue Task Panel */}
            <div className="rounded-lg border border-jira-border bg-jira-elevated p-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 text-orange-400">
                <Clock size={15} /> Deadline Tracking & Overdue Sprints ({data?.overdueCount || 0})
              </h3>
              <p className="text-xs text-jira-text-subtle mb-4">Crucial overdue pipeline tasks that require immediate manager/admin priority tagging.</p>
              
              {data?.overdueIssues && data.overdueIssues.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-jira-border text-jira-text-disabled uppercase font-semibold">
                        <th className="py-2 px-3">Key</th>
                        <th className="py-2 px-3">Title</th>
                        <th className="py-2 px-3">Project</th>
                        <th className="py-2 px-3">Assignee</th>
                        <th className="py-2 px-3 text-red-400">Due Date</th>
                        <th className="py-2 px-3 text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.overdueIssues.map((issue) => (
                        <tr key={issue.id} className="border-b border-jira-border hover:bg-jira-overlay transition-colors">
                          <td className="py-2.5 px-3 font-bold text-jira-blue-bold">{issue.issueKey}</td>
                          <td className="py-2.5 px-3 font-medium text-white truncate max-w-xs">{issue.title}</td>
                          <td className="py-2.5 px-3 text-jira-text-subtle">{issue.projectName}</td>
                          <td className="py-2.5 px-3">
                            {issue.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={issue.assignee.name} size={18} color={issue.assignee.avatarColor} />
                                <span>{issue.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-jira-text-disabled">Unassigned</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-red-400 font-semibold flex items-center gap-1"><Calendar size={12}/> {issue.dueDate}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              issue.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                              issue.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {issue.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-jira-text-disabled">
                  No overdue tasks detected in current sprints. Excellent tracking!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PROJECTS ==================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-white">Active Projects & Running Sprints</h2>
              <p className="text-sm text-jira-text-subtle mt-0.5">Real-time linear tracking, task quantities, and regression completion deadlines.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {data?.activeProjects && data.activeProjects.length > 0 ? (
                data.activeProjects.map((project) => (
                  <div key={project.projectId} className="rounded-lg border border-jira-border bg-jira-elevated p-5 hover:border-jira-border-hover transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span 
                            className="h-3 w-3 rounded-full shrink-0" 
                            style={{ backgroundColor: project.avatarColor || '#0C66E4' }}
                          ></span>
                          <h3 className="font-semibold text-white text-base">{project.name}</h3>
                          <span className="text-xs bg-jira-bg text-jira-text-subtle px-1.5 py-0.5 rounded font-mono uppercase">{project.keyCode}</span>
                        </div>
                        {project.delayed ? (
                          <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase animate-pulse">Delayed</span>
                        ) : (
                          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">Healthy</span>
                        )}
                      </div>

                      <p className="text-xs text-jira-text-subtle mb-4">
                        Progress compiled from status distribution. {project.blockerCount} active blockers reported.
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-jira-text-subtle">Completion rate</span>
                          <span className="text-white">{project.progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 rounded bg-jira-bg overflow-hidden">
                          <div 
                            className={`h-full rounded transition-all duration-500 ${
                              project.delayed ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-jira-blue to-green-500'
                            }`}
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-jira-border/60 text-xs">
                      <div>
                        <span className="text-jira-text-disabled block uppercase tracking-wider text-[10px]">Tasks (Comp / Total)</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{project.completedTasks} / {project.totalTasks}</span>
                      </div>
                      <div>
                        <span className="text-jira-text-disabled block uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Sparkles size={10} className="text-jira-blue" /> Projected Deadline
                        </span>
                        <span className={`text-sm font-bold mt-0.5 block ${project.delayed ? 'text-red-400' : 'text-green-400'}`}>
                          {project.predictedCompletionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 rounded-lg border border-dashed border-jira-border flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-jira-text-subtle">No active projects available to track.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: TEAM WORKLOAD ==================== */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-white">Team Member Workload & Task Allocations</h2>
              <p className="text-sm text-jira-text-subtle mt-0.5">Manager cockpit for monitoring developer loads, assignment bottlenecks, and productivity ratios.</p>
            </div>

            <div className="rounded-lg border border-jira-border bg-jira-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-jira-border text-jira-text-disabled uppercase font-semibold bg-jira-bg/30">
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4 text-center">Todo / Pending</th>
                      <th className="py-3 px-4 text-center">In Progress</th>
                      <th className="py-3 px-4 text-center text-red-400">Blocked</th>
                      <th className="py-3 px-4 text-center text-green-400">Completed</th>
                      <th className="py-3 px-4 text-center">Total Assigned</th>
                      <th className="py-3 px-4 text-right">Productivity Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.teamWorkloads && data.teamWorkloads.length > 0 ? (
                      data.teamWorkloads.map((workload) => {
                        const totalActive = workload.todoCount + workload.inProgressCount + workload.blockedCount + workload.pendingCount
                        const isOverloaded = totalActive > 5
                        
                        return (
                          <tr key={workload.userId} className="border-b border-jira-border hover:bg-jira-overlay transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={workload.userName} size={28} color={workload.avatarColor} />
                                <div>
                                  <span className="text-sm font-medium text-white block">{workload.userName}</span>
                                  <span className="text-[10px] text-jira-text-disabled block mt-0.5">{workload.email}</span>
                                </div>
                              </div>
                            </td>
                            
                            <td className="py-3.5 px-4 text-center font-medium text-yellow-400/90 text-sm">
                              {workload.todoCount + workload.pendingCount}
                            </td>
                            
                            <td className="py-3.5 px-4 text-center font-medium text-purple-400/90 text-sm">
                              {workload.inProgressCount}
                            </td>
                            
                            <td className={`py-3.5 px-4 text-center font-semibold text-sm ${workload.blockedCount > 0 ? 'text-red-400' : 'text-jira-text-disabled'}`}>
                              {workload.blockedCount}
                            </td>
                            
                            <td className="py-3.5 px-4 text-center font-medium text-green-400 text-sm">
                              {workload.completedCount}
                            </td>
                            
                            <td className="py-3.5 px-4 text-center font-semibold text-white text-sm">
                              <div className="flex items-center justify-center gap-1.5">
                                <span>{workload.totalAssigned}</span>
                                {isOverloaded && (
                                  <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1 font-extrabold animate-pulse uppercase">Loaded</span>
                                )}
                              </div>
                            </td>
                            
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="font-bold text-white text-sm">{(workload.productivityRatio * 100).toFixed(0)}%</span>
                                <div className="w-16 h-1 rounded bg-jira-bg overflow-hidden">
                                  <div 
                                    className={`h-full rounded ${
                                      workload.productivityRatio >= 0.7 ? 'bg-green-500' :
                                      workload.productivityRatio >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${workload.productivityRatio * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-jira-text-subtle">
                          No team members found in the current project workspaces.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: FORECASTING & CAPACITIES ==================== */}
        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-white">Capacity Forecasting & Resource Utilization</h2>
              <p className="text-sm text-jira-text-subtle mt-0.5">Admin-only simulation metrics predicting pipeline delivery success and team capability.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Global pipeline timeline */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-jira-blue/10 flex items-center justify-center text-jira-blue">
                    <TrendingUp size={16} />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Estimated Global Pipeline</h3>
                </div>
                <div className="my-4">
                  <span className="text-xs text-jira-text-disabled uppercase font-semibold">Timeline Estimate</span>
                  <span className="text-xl font-bold text-white mt-1 block truncate">
                    {data?.forecasting?.estimatedGlobalTimeline || 'Not enough velocity'}
                  </span>
                </div>
                <p className="text-[11px] text-jira-text-subtle">
                  Linear extrapolated prediction computed from the sum velocity of all running projects.
                </p>
              </div>

              {/* Card 2: Team Capacity Available */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <UserCheck size={16} />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Team capacity index</h3>
                </div>
                <div className="my-4">
                  <span className="text-xs text-jira-text-disabled uppercase font-semibold">Available Bandwidth</span>
                  <span className="text-3xl font-extrabold text-yellow-400 mt-1 block">
                    {data?.forecasting?.teamCapacityPercentage?.toFixed(0) || 100}%
                  </span>
                </div>
                <p className="text-[11px] text-jira-text-subtle">
                  Percentage of workforce with sub-threshold queue quantities (under 5 concurrent tasks).
                </p>
              </div>

              {/* Card 3: Resource Utilization Rate */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <Users size={16} />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Resource Utilization</h3>
                </div>
                <div className="my-4">
                  <span className="text-xs text-jira-text-disabled uppercase font-semibold">Active workload utilization</span>
                  <span className="text-3xl font-extrabold text-green-400 mt-1 block">
                    {data?.forecasting?.resourceUtilizationRate?.toFixed(0) || 0}%
                  </span>
                </div>
                <p className="text-[11px] text-jira-text-subtle">
                  Proportion of members with at least one active, non-shipped task assignment.
                </p>
              </div>
            </div>

            {/* Explanatory notes on metrics */}
            <div className="rounded-lg border border-jira-border bg-jira-elevated/40 p-4 text-xs text-jira-text-subtle leading-relaxed">
              <span className="font-semibold text-white block mb-1">💡 Advanced Forecasting Methodology Notes:</span>
              - **Estimated Sprints**: Uses the average task completion speeds (velocity = tasks / days elapsed) over the past month.
              - **Overload Buffer**: Calculates if team members are bottlenecked by more than 5 in-progress cards.
              - **Resource Rates**: Proactively alerts managers if key assets are idle or sitting on blocked task dependency trees.
            </div>
          </div>
        )}

        {/* ==================== TAB 5: EOD REPORT HUB ==================== */}
        {activeTab === 'eod' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-medium text-white">End-of-Day (EOD) Operations Hub</h2>
                <p className="text-sm text-jira-text-subtle mt-0.5">Automated reports compilation, completed/blocker breakdowns, and member log submission.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={copyEodToClipboard} className="flex items-center gap-1.5">
                  <Clipboard size={14} /> Copy Report
                </Button>
                <Button size="sm" onClick={downloadEodReport} className="flex items-center gap-1.5 bg-jira-blue hover:bg-jira-blue-bold">
                  <Download size={14} /> Download EOD (.md)
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left column: Submit EOD Status (Team Member Portal) */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 text-jira-blue-bold">
                    <Users size={15} /> Team Member EOD Submitter
                  </h3>
                  <p className="text-xs text-jira-text-subtle mb-4">Easily report achievements, pending tasks, and active blockers directly to the manager.</p>
                </div>
                
                <form onSubmit={handleEodSubmit} className="space-y-4 flex-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-jira-text-disabled">What did you complete today?</label>
                    <textarea 
                      value={eodToday}
                      onChange={(e) => setEodToday(e.target.value)}
                      placeholder="e.g. Completed authorization page refactoring"
                      rows="2"
                      className="w-full rounded border border-jira-border bg-jira-bg px-3 py-2 text-xs text-jira-text outline-none focus:border-jira-blue resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-jira-text-disabled">What is pending / in progress?</label>
                    <textarea 
                      value={eodPending}
                      onChange={(e) => setEodPending(e.target.value)}
                      placeholder="e.g. Continuing dashboard backend integrations"
                      rows="2"
                      className="w-full rounded border border-jira-border bg-jira-bg px-3 py-2 text-xs text-jira-text outline-none focus:border-jira-blue resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-jira-text-disabled">Any blockers or constraints?</label>
                    <textarea 
                      value={eodBlockers}
                      onChange={(e) => setEodBlockers(e.target.value)}
                      placeholder="e.g. Waiting on API specifications update"
                      rows="2"
                      className="w-full rounded border border-jira-border bg-jira-bg px-3 py-2 text-xs text-jira-text outline-none focus:border-jira-blue resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full" loading={isSubmittingEod}>
                    Compile & Submit EOD Log
                  </Button>
                </form>
              </div>

              {/* Right Columns: Compiled Automated Markdown Report */}
              <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 text-green-400">
                    <FileSpreadsheet size={15} /> Auto-Compiled Operations Log
                  </h3>
                  <p className="text-xs text-jira-text-subtle mb-4">Real-time Markdown report ready for Slack/email/teams broadcast.</p>
                </div>

                <div className="flex-1 rounded border border-jira-border bg-jira-bg p-4 font-mono text-xs text-jira-text overflow-y-auto max-h-96 whitespace-pre-wrap select-all leading-relaxed">
                  {data?.eodReport?.markdownSummary || 'No reports generated yet.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: TASK PIPELINE ==================== */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-white">Centralized Task Pipeline</h2>
              <p className="text-sm text-jira-text-subtle mt-0.5">Cross-project task management with active status tagging, searching, and deadline tracking.</p>
            </div>

            {/* Filter controls */}
            <div className="grid gap-3 sm:grid-cols-3 rounded-lg border border-jira-border bg-jira-elevated p-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-jira-text-disabled" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search key or title..."
                  className="w-full rounded border border-jira-border bg-jira-bg pl-9 pr-3 py-1.5 text-xs text-jira-text outline-none focus:border-jira-blue"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded border border-jira-border bg-jira-bg px-3 py-1.5 text-xs text-jira-text outline-none focus:border-jira-blue"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending (Todo)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DONE">Completed (Done)</option>
                  <option value="OVERDUE">🚨 Overdue Deadlines</option>
                </select>
              </div>

              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full rounded border border-jira-border bg-jira-bg px-3 py-1.5 text-xs text-jira-text outline-none focus:border-jira-blue"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {/* Pipeline table */}
            <div className="rounded-lg border border-jira-border bg-jira-elevated overflow-hidden">
              {filteredTasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-jira-border text-jira-text-disabled uppercase font-semibold bg-jira-bg/30">
                        <th className="py-2.5 px-3">Key</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Project</th>
                        <th className="py-2.5 px-3">Assignee</th>
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="border-b border-jira-border hover:bg-jira-overlay transition-colors">
                          <td className="py-3 px-3 font-bold text-jira-blue-bold">{task.issueKey}</td>
                          <td className="py-3 px-3 font-medium text-white truncate max-w-xs">
                            <div className="flex flex-col gap-0.5">
                              <span>{task.title}</span>
                              {task.description && (
                                <span className="text-[10px] text-jira-text-disabled truncate max-w-xxs">{task.description}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-jira-text-subtle font-mono text-[10px]">{task.projectName}</td>
                          <td className="py-3 px-3">
                            {task.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={task.assignee.name} size={16} color={task.assignee.avatarColor} />
                                <span className="truncate max-w-[80px]">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-jira-text-disabled">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              task.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 
                              task.priority === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              task.status === 'DONE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              task.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                              task.status === 'IN_PROGRESS' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {task.status === 'DONE' ? 'COMPLETED' : task.status}
                            </span>
                          </td>
                          <td className={`py-3 px-3 text-right font-medium ${task.overdue ? 'text-red-400 font-bold' : 'text-jira-text-subtle'}`}>
                            <div className="flex items-center justify-end gap-1">
                              {task.overdue && <AlertCircle size={10} className="text-red-400" />}
                              <span>{task.dueDate || 'No deadline'}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-jira-text-subtle">
                  No tasks matched your pipeline filter configurations.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
