import { useMemo, useState } from 'react'

export const useBoard = (issues = []) => {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('ALL')
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [onlyMine, setOnlyMine] = useState(false)

  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const matchesSearch = !search || issue.title.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priority === 'ALL' || issue.priority === priority
    const matchesAssignee = selectedAssignees.length === 0 || (issue.assignee && selectedAssignees.includes(issue.assignee.id))
    const matchesMine = !onlyMine || issue._currentUserIsAssignee
    return matchesSearch && matchesPriority && matchesAssignee && matchesMine
  }), [issues, search, priority, selectedAssignees, onlyMine])

  const toggleAssignee = (id) => setSelectedAssignees((prev) => prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id])

  return {
    search,
    setSearch,
    priority,
    setPriority,
    selectedAssignees,
    toggleAssignee,
    onlyMine,
    setOnlyMine,
    filteredIssues
  }
}
