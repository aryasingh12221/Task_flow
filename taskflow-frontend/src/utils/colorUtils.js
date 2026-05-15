const COLORS = ['#0C66E4', '#6E5DC6', '#1F845A', '#CA3521', '#F1A10D', '#0055CC', '#943D73', '#0868AC']

export const getAvatarInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

const hash = (input = '') => input.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)

export const getProjectColor = (keyOrName = '') => COLORS[Math.abs(hash(keyOrName)) % COLORS.length]
