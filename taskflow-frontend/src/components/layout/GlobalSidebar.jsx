import { motion } from 'framer-motion'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, Users, Settings, LogOut, Compass, Activity, BarChart2, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../common/Avatar'
import Dropdown from '../common/Dropdown'
import { useAuth } from '../../hooks/useAuth'
import { getLastProjectId } from '../../utils/tokenUtils'

export default function GlobalSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState(null)
  const lastProjectId = getLastProjectId()

  const projectBoardPath = lastProjectId ? `/projects/${lastProjectId}/board` : '/projects'
  const projectSettingsPath = lastProjectId ? `/projects/${lastProjectId}/settings` : '/projects'
  const projectDashboardPath = lastProjectId ? `/projects/${lastProjectId}/dashboard` : '/projects'

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Ops Dashboard' },
    { to: '/projects', icon: Home, label: 'Projects' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: projectBoardPath, icon: LayoutGrid, label: 'Board' },
    { to: projectSettingsPath, icon: Users, label: 'Members' },
    { to: projectDashboardPath, icon: BarChart2, label: 'Project Dashboard' },
    { to: '/telemetry', icon: Activity, label: 'Telemetry' }
  ]

  const onAvatarClick = (event) => {
    setRect(event.currentTarget.getBoundingClientRect())
    setOpen((value) => !value)
  }

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-14 flex-col items-center border-r border-jira-border bg-jira-sidebar py-2 md:flex">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link to="/projects" className="flex h-10 w-10 items-center justify-center rounded bg-jira-blue text-lg font-bold text-white shadow-lg shadow-jira-blue/20">T</Link>
      </motion.div>
      <nav className="mt-2 flex flex-col items-center gap-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/projects' && location.pathname.startsWith(to))
          return (
            <motion.div key={label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={to}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded transition-colors ${active ? 'bg-jira-blue-bg text-jira-blue-bold' : 'text-jira-text-subtle hover:bg-jira-sidebar-icon hover:text-jira-text'}`}
              >
                <Icon size={18} />
              </Link>
            </motion.div>
          )
        })}
      </nav>
      <div className="mt-auto pb-2 flex flex-col items-center gap-1">
        <motion.button onClick={onAvatarClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-full shadow-md">
          <Avatar name={user?.name || 'TaskFlow User'} size={32} color={user?.avatarColor || '#0C66E4'} />
        </motion.button>
        <motion.button
          type="button"
          onClick={logout}
          title="Sign out"
          whileHover={{ scale: 1.1, color: '#F87168' }}
          whileTap={{ scale: 0.9 }}
          className="mt-2 flex h-10 w-10 items-center justify-center rounded text-jira-text-subtle hover:bg-jira-sidebar-icon"
        >
          <LogOut size={18} />
        </motion.button>
      </div>
      <Dropdown isOpen={open} onClose={() => setOpen(false)} triggerRect={rect}>
        <Link to="/settings" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-jira-text hover:bg-jira-overlay" onClick={() => setOpen(false)}>
          <Settings size={14} /> User Settings
        </Link>
        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-jira-text hover:bg-jira-overlay" onClick={logout}>
          <LogOut size={14} /> Sign out
        </button>
      </Dropdown>
    </aside>
  )
}
