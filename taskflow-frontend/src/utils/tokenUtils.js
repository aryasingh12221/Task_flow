const TOKEN_KEY = 'taskflow_token'
const USER_KEY = 'taskflow_user'
const LAST_PROJECT_KEY = 'taskflow_last_project_id'

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const getUser = () => {
  const value = localStorage.getItem(USER_KEY)
  return value ? JSON.parse(value) : null
}
export const removeUser = () => localStorage.removeItem(USER_KEY)
export const clearAuth = () => {
  removeToken()
  removeUser()
  localStorage.removeItem(LAST_PROJECT_KEY)
}

export const saveLastProjectId = (projectId) => {
  if (projectId) localStorage.setItem(LAST_PROJECT_KEY, String(projectId))
}

export const getLastProjectId = () => localStorage.getItem(LAST_PROJECT_KEY)
