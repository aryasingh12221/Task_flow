import {
  format,
  formatDistanceToNow,
  isBefore,
  parseISO,
  addDays,
  isToday
} from 'date-fns'

const normalizeDate = (dateValue) => {
  if (!dateValue) return null

  if (dateValue instanceof Date) return dateValue

  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue
    return new Date(year, month - 1, day)
  }

  if (typeof dateValue === 'string') {
    return parseISO(dateValue)
  }

  return null
}

export const formatDueDate = (dateValue, status) => {
  const date = normalizeDate(dateValue)

  if (!date) return 'No due date'

  if (isToday(date)) return 'Today'

  const tomorrow = addDays(new Date(), 1)

  if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
    return 'Tomorrow'
  }

  if (isBefore(date, new Date()) && status !== 'DONE') {
    return `${formatDistanceToNow(date, { addSuffix: false })} overdue`
  }

  return format(date, 'MMM d')
}

export const isOverdue = (dateValue, status) => {
  const date = normalizeDate(dateValue)

  if (!date) return false

  return isBefore(date, new Date()) && status !== 'DONE'
}

export const formatDateTime = (dateValue) => {
  const date = normalizeDate(dateValue)

  if (!date) return '—'

  return format(date, 'MMM d, yyyy · h:mm a')
}