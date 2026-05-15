import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Button from '../common/Button'

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create project">
      <div className="space-y-3">
        <Input label="Project name" value={name} onChange={(event) => setName(event.target.value)} />
        <Textarea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onCreate?.({ name, description })}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}
