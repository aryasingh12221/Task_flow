import ProjectRow from './ProjectRow'
import SkeletonRow from '../common/SkeletonRow'
import EmptyState from '../common/EmptyState'
import { FolderOpen } from 'lucide-react'

export default function ProjectsTable({ projects = [], loading = false, onCreate, canCreate = true }) {
  if (loading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)}</div>
  if (!projects.length) return <EmptyState icon={FolderOpen} title="No projects yet" description={canCreate ? "Create a project to start tracking issues." : "Ask an administrator or manager to add you to a project."} actionLabel={canCreate ? "Create project" : null} onAction={canCreate ? onCreate : null} />

  return (
    <div className="overflow-hidden rounded border border-jira-border">
      <table className="w-full border-collapse">
        <thead className="bg-jira-sidebar text-left text-[11px] uppercase tracking-[0.04em] text-jira-text-subtle">
          <tr>
            {['Name', 'Key', 'Lead', 'Members', 'Progress', 'Last updated'].map((heading) => <th key={heading} className="border-b border-jira-border px-3 py-2 font-semibold">{heading}</th>)}
          </tr>
        </thead>
        <tbody>{projects.map((project, i) => <ProjectRow key={project.id} project={project} index={i} />)}</tbody>
      </table>
    </div>
  )
}
