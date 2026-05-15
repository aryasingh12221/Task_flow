import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function SlidePanel({ isOpen, onClose, children }) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40" 
            onClick={onClose} 
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-jira-border bg-jira-elevated sm:w-[70vw] sm:min-w-[600px]"
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
