import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProjectsPage from './pages/ProjectsPage'
import BoardPage from './pages/BoardPage'
import DashboardPage from './pages/DashboardPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'
import UserSettingsPage from './pages/UserSettingsPage'
import ExploreProjectsPage from './pages/ExploreProjectsPage'
import TelemetryPage from './pages/TelemetryPage'
import NotFound from './pages/NotFound'
import LandingPage from './pages/LandingPage'
import AppShell from './components/layout/AppShell'
import { BrowserRouter } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-jira-bg text-jira-text">Loading...</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/projects" replace /> : <Outlet />
}

function ShellRoute() {
  return <AppShell />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#282E33', color: '#B6C2CF', border: '1px solid #2C333A', borderRadius: '4px', fontSize: '14px' }, success: { iconTheme: { primary: '#4BCE97', secondary: '#282E33' } }, error: { iconTheme: { primary: '#F87168', secondary: '#282E33' } } }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<ShellRoute />}>
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/explore" element={<ExploreProjectsPage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="/telemetry" element={<TelemetryPage />} />
              <Route path="/projects/:id/board" element={<BoardPage />} />
              <Route path="/projects/:id/dashboard" element={<DashboardPage />} />
              <Route path="/projects/:id/settings" element={<ProjectSettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
