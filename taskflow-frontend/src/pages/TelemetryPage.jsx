import { useEffect, useState, useRef } from 'react'
import { Activity, Cpu, Database, HardDrive, Terminal, ShieldCheck, RefreshCw } from 'lucide-react'
import TopBar from '../components/layout/TopBar'

export default function TelemetryPage() {
  const [metrics, setMetrics] = useState({
    cpu: 12.4,
    memory: 44.8,
    latency: 18,
    dbPool: 4,
    uptime: '14d 6h 32m',
    status: 'HEALTHY'
  })
  
  const [cpuHistory, setCpuHistory] = useState([12, 15, 10, 14, 18, 11, 13, 16, 12, 14])
  const [latencyHistory, setLatencyHistory] = useState([20, 18, 22, 15, 19, 16, 17, 18, 19, 18])
  
  const [logs, setLogs] = useState([
    { time: '14:20:10', type: 'SYSTEM', message: 'Heartbeat check passed (OK)' },
    { time: '14:20:15', type: 'AGENT', message: 'Autonomous task manager synchronized board states' },
    { time: '14:20:30', type: 'DB', message: 'HikariPool-1 - Connection status: active=4, idle=6, max=10' },
    { time: '14:21:00', type: 'SECURITY', message: 'JWT blacklist cleanup cycle finished successfully' },
    { time: '14:21:05', type: 'AI', message: 'Preloaded NLP intent classifiers for issue descriptions' },
    { time: '14:21:12', type: 'SYSTEM', message: 'Garbage collection completed (reclaimed 42MB)' }
  ])

  const terminalEndRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate changing metrics
      const newCpu = Math.max(2, Math.min(99, +(metrics.cpu + (Math.random() * 6 - 3)).toFixed(1)))
      const newMem = Math.max(10, Math.min(95, +(metrics.memory + (Math.random() * 2 - 1)).toFixed(1)))
      const newLatency = Math.max(5, Math.min(150, Math.round(metrics.latency + (Math.random() * 10 - 5))))
      const newDb = Math.max(1, Math.min(10, metrics.dbPool + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))

      setMetrics(prev => ({
        ...prev,
        cpu: newCpu,
        memory: newMem,
        latency: newLatency,
        dbPool: newDb
      }))

      // Push history
      setCpuHistory(prev => [...prev.slice(1), newCpu])
      setLatencyHistory(prev => [...prev.slice(1), newLatency])

      // Push logs
      const logTypes = ['SYSTEM', 'AGENT', 'DB', 'AI', 'SECURITY']
      const logMessages = {
        SYSTEM: ['CPU load check stable', 'Heartbeat status check: OK', 'Temp files cleanup run completed'],
        AGENT: ['Autonomous agent scanned project lists', 'Scheduled sprint board state refresh executed', 'Archival policies evaluated'],
        DB: [`HikariPool-1 status: active=${newDb}, idle=${10 - newDb}, max=10`, 'Index health check passed', 'Optimized query execution paths'],
        AI: ['AI agent response latency stable', 'Synthesized context payload for issue priority recommendation', 'NLP models warm state confirmed'],
        SECURITY: ['Session token validations: successful', 'Rotated cryptography salts', 'No anomalies detected in telemetry metrics']
      }

      const randomType = logTypes[Math.floor(Math.random() * logTypes.length)]
      const messages = logMessages[randomType]
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]

      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

      setLogs(prev => [...prev, { time: timeStr, type: randomType, message: randomMsg }].slice(-50))
    }, 3000)

    return () => clearInterval(timer)
  }, [metrics])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Helpers for plotting lines in SVG
  const getSvgPath = (history, maxVal = 100) => {
    if (history.length === 0) return ''
    const width = 120
    const height = 40
    const step = width / (history.length - 1)
    
    return history.map((val, idx) => {
      const x = idx * step
      const y = height - (val / maxVal) * height
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  return (
    <div className="min-h-screen bg-jira-bg text-jira-text">
      <TopBar breadcrumb={[{ label: 'Home', to: '/projects' }, { label: 'System Telemetry' }]} />
      
      <div className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">System Telemetry</h1>
            <p className="text-sm text-jira-text-subtle">Real-time infrastructure health and autonomous operation logging feed</p>
          </div>

          <div className="flex items-center gap-2 rounded bg-jira-blue-bg/40 px-3 py-1.5 text-xs text-jira-blue-bold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-jira-blue-bold"></span>
            Live Connection Established
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Card 1: CPU */}
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">CPU Utilization</span>
                <span className="text-2xl font-bold text-jira-text mt-1 block">{metrics.cpu}%</span>
              </div>
              <div className="rounded bg-orange-950/40 p-2.5 text-orange-400">
                <Cpu size={20} />
              </div>
            </div>
            <div>
              <svg className="w-full h-10 text-orange-500 stroke-current fill-none stroke-[2]" viewBox="0 0 120 40">
                <path d={getSvgPath(cpuHistory, 100)} />
              </svg>
            </div>
          </div>

          {/* Card 2: Memory */}
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">Memory Allocation</span>
                <span className="text-2xl font-bold text-jira-text mt-1 block">{metrics.memory}%</span>
              </div>
              <div className="rounded bg-blue-950/40 p-2.5 text-blue-400">
                <HardDrive size={20} />
              </div>
            </div>
            <div className="w-full bg-jira-bg rounded-full h-2 mt-2">
              <div 
                className="bg-jira-blue h-2 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>

          {/* Card 3: API Latency */}
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">API Latency (Avg)</span>
                <span className="text-2xl font-bold text-jira-text mt-1 block">{metrics.latency} ms</span>
              </div>
              <div className="rounded bg-emerald-950/40 p-2.5 text-emerald-400">
                <Activity size={20} />
              </div>
            </div>
            <div>
              <svg className="w-full h-10 text-emerald-500 stroke-current fill-none stroke-[2]" viewBox="0 0 120 40">
                <path d={getSvgPath(latencyHistory, 150)} />
              </svg>
            </div>
          </div>

          {/* Card 4: Database Connection Pool */}
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">DB HikariPool</span>
                <span className="text-2xl font-bold text-jira-text mt-1 block">{metrics.dbPool} / 10 active</span>
              </div>
              <div className="rounded bg-purple-950/40 p-2.5 text-purple-400">
                <Database size={20} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-4 flex-1 rounded-sm ${i < metrics.dbPool ? 'bg-purple-500' : 'bg-jira-bg'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* System Uptime and Health */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex items-center gap-4">
            <div className="rounded bg-teal-950/40 p-3 text-teal-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">Uptime</span>
              <span className="text-lg font-bold text-jira-text">{metrics.uptime}</span>
            </div>
          </div>

          <div className="rounded-lg border border-jira-border bg-jira-elevated p-5 flex items-center gap-4">
            <div className="rounded bg-emerald-950/40 p-3 text-emerald-400">
              <RefreshCw className="animate-spin" size={24} />
            </div>
            <div>
              <span className="text-xs text-jira-text-subtle font-medium block uppercase tracking-wider">Health Assessment</span>
              <span className="text-lg font-bold text-emerald-400">OPERATIONAL (100% HEALTHY)</span>
            </div>
          </div>
        </div>

        {/* Live Logs Terminal console */}
        <div className="rounded-lg border border-jira-border bg-black/40 shadow-inner">
          <div className="flex items-center gap-2 border-b border-jira-border bg-jira-elevated px-4 py-2 text-xs font-semibold text-jira-text-subtle">
            <Terminal size={14} />
            <span>Automated Operations Live Logs</span>
            <span className="ml-auto text-[10px] text-jira-text-disabled">UTF-8 • WS LOG STREAM</span>
          </div>

          <div className="h-96 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-jira-text bg-black/60 selection:bg-jira-blue/30 scrollbar-thin scrollbar-thumb-jira-border">
            <div className="space-y-1">
              {logs.map((log, index) => {
                let color = 'text-gray-400'
                if (log.type === 'AGENT') color = 'text-sky-400'
                if (log.type === 'DB') color = 'text-purple-400'
                if (log.type === 'AI') color = 'text-pink-400'
                if (log.type === 'SECURITY') color = 'text-red-400'
                if (log.type === 'SYSTEM') color = 'text-yellow-500'

                return (
                  <div key={index} className="flex gap-2 hover:bg-white/5 px-1 py-0.5 rounded transition-colors">
                    <span className="text-jira-text-disabled select-none">[{log.time}]</span>
                    <span className={`font-bold select-none min-w-[70px] inline-block ${color}`}>[{log.type}]</span>
                    <span className="text-jira-text">{log.message}</span>
                  </div>
                )
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
