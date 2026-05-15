import { motion } from 'framer-motion'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-jira-blue text-white hover:bg-jira-blue-hover',
  secondary: 'bg-transparent border border-jira-border-bold text-jira-text hover:bg-jira-overlay',
  subtle: 'bg-transparent text-jira-text hover:bg-jira-sidebar-icon',
  danger: 'bg-jira-red text-white hover:opacity-90'
}

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm'
}

export default function Button({ variant = 'primary', size = 'md', loading = false, icon, disabled, children, ...props }) {
  return (
    <motion.button
      {...props}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </motion.button>
  )
}
