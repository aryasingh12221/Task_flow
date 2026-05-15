import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'

export default function Dropdown({ isOpen, onClose, triggerRect, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose?.()
    }
    if (isOpen) document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [isOpen, onClose])

  if (!isOpen || !triggerRect) return null

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 min-w-40 rounded-lg border border-jira-border bg-jira-elevated py-1 shadow-xl"
      style={{ top: triggerRect.bottom + 8, left: triggerRect.left }}
    >
      {children}
    </div>,
    document.body
  )
}
