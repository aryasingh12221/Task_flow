import { motion } from 'framer-motion'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LayoutDashboard, BarChart2, Settings, ChevronRight } from 'lucide-react'
import MembersPanel from '../members/MembersPanel'

export default function ProjectSidebar({ project, members = [], currentUserRole = 'ADMIN', onAddMember, onRemoveMember }) {
  const location = useLocation()
  const { id } = useParams()

  if (!project) return null

  const nav = [
    { to: `/projects/${id}/board`, label: 'Board', icon: LayoutDashboard },
    { to: `/projects/${id}/dashboard`, label: 'Dashboard', icon: BarChart2 },
    ...(currentUserRole === 'ADMIN' ? [{ to: `/projects/${id}/settings`, label: 'Project settings', icon: Settings }] : [])
  ]

  return (
    <aside className="fixed left-14 top-0 z-40 hidden h-screen w-60 flex-col overflow-y-auto border-r border-jira-border bg-jira-sidebar py-3 md:flex">
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex h-6 w-6 items-center justify-center rounded bg-jira-blue text-[12px] font-bold text-white shadow-sm"
          >
            {project.keyCode?.[0] || project.name?.[0] || 'T'}
          </motion.div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-jira-text">{project.name}</div>
            <div className="text-[11px] text-jira-text-subtle">Software project</div>
          </div>
        </div>
      </div>

      <div className="border-t border-jira-border px-2 py-2">
        <div className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Navigation</div>
        {nav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <motion.div key={label} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={to}
                className={`mx-2 my-0.5 flex h-8 items-center gap-2 rounded px-2 text-sm transition-colors ${active ? 'bg-jira-blue-bg text-jira-blue-bold shadow-sm' : 'text-jira-text-subtle hover:bg-jira-sidebar-icon hover:text-jira-text'}`}
              >
                <Icon size={16} />
                <span>{label}</span>
                {label === 'Board' && <ChevronRight size={12} className={`ml-auto transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-2 border-t border-jira-border px-0 py-3">
        <div className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-jira-text-subtle">Members</div>
        <MembersPanel members={members} canEdit={currentUserRole === 'ADMIN'} onAddMember={onAddMember} onRemoveMember={onRemoveMember} />
      </div>
    </aside>
  )
}
