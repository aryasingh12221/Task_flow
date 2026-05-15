import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Kanban, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import LightPillar from '../components/LightPillar';


export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200 font-sans selection:bg-jira-blue/30 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
 

  <div className="absolute inset-0 
  bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
</div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-jira-blue/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-jira-purple/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center 
      justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto backdrop-blur-xl bg-black/20 border-white rounded-full border-white/5 shadow-[0_0_50px_rgba(168,85,247,0.45)] ">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-jira-blue to-jira-purple shadow-lg shadow-jira-blue/20">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
        </div>
        <div className="flex items-center gap-10">
          {isAuthenticated ? (
            <Link to="/projects" className="rounded-full bg-jira-blue px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-[0_0_35px_rgba(99,102,241,0.6)]  hover:scale-105 active:scale-95">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-color ">Log in</Link>
              <Link to="/signup" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-200 hover:scale-105 active:scale-95">Get Started</Link>
            </>
          )}
        </div>
        
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-32 text-center md:pt-32">
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-2 rounded-full border border-jira-blue/30 bg-jira-blue/10 px-4 py-1.5 text-sm font-medium text-jira-blue-bold backdrop-blur-sm">
            <Zap className="h-4 w-4" fill="currentColor" />
            <span>The complete workspace for productive teams</span>
          </motion.div>
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full pointer-events-none" />
          <motion.h1 variants={itemVariants} className="mb-6 text-6xl font-black tracking-tight text-white md:text-7xl lg:text-[6rem] leading-[1] tracking-tight text-white md:text-7xl lg:text-[5.5rem] leading-[1.1]">
            Plan work<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">intelligently</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl leading-relaxed">
TaskFlow combines project planning, team collaboration, and issue management into one elegant workspace that helps teams move faster and stay focused.          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {isAuthenticated ? (
              <Link to="/projects" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-jira-blue px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-jira-blue/25 transition-all hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] over:scale-105 active:scale-95">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-jira-blue px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-jira-blue/25 transition-all hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95">
                  Start Planning Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto rounded-full border border-gray-700 bg-gray-800/50 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-gray-700 hover:scale-105 active:scale-95">
                  View Demo Board
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-[#0F131A] border-t border-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Everything you need to ship</h2>
            <p className="mt-4 text-gray-400">Powerful features disguised by a beautifully simple interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div animate={{
    x: [0, 10, 0, -10, 0],
    y: [0, -10, -20, -10, 0],
    rotate: [0, 2, 0, -2, 0]
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  whileHover={{
    y: -10,
    scale: 1.03,
    rotateX: 4,
    rotateY: 2
  }}
  className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jira-blue/10 text-jira-blue-bold">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Agile Boards</h3>
              <p className="text-gray-400 leading-relaxed">Visualize your workflow with drag-and-drop Kanban boards. Track 'To Do' to 'Done' seamlessly.</p>
            </motion.div>

            <motion.div 
  animate={{
    x: [0, 10, 0, -10, 0],
    y: [0, -10, -20, -10, 0],
    rotate: [0, 2, 0, -2, 0]
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  whileHover={{
    y: -10,
    scale: 1.03,
    rotateX: 4,
    rotateY: 2
  }}
  className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jira-purple/10 text-jira-purple-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Team Collaboration</h3>
              <p className="text-gray-400 leading-relaxed">Assign tasks, manage roles, and keep everyone on the same page with real-time updates.</p>
            </motion.div>

            <motion.div animate={{
    x: [0, 10, 0, -10, 0],
    y: [0, -10, -20, -10, 0],
    rotate: [0, 2, 0, -2, 0]
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  whileHover={{
    y: -10,
    scale: 1.03,
    rotateX: 4,
    rotateY: 2
  }}
  className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jira-green/10 text-jira-green-bold">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Issue Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Create detailed issues, set priorities, and track progress with precision and clarity.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
