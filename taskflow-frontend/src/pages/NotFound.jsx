import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-jira-bg px-4 text-center">
      <div>
        <div className="text-[96px] font-bold leading-none text-jira-blue-bg">404</div>
        <div className="mt-2 text-xl text-jira-text-subtle">Page not found</div>
        <Link to="/projects"><Button variant="secondary" className="mt-6">Back to Projects</Button></Link>
      </div>
    </div>
  )
}
