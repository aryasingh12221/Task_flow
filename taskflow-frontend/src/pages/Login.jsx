import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data)
      login(response.data.token, response.data.user)
      toast.success('Logged in successfully')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-jira-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-jira-border bg-jira-elevated p-10">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-jira-blue text-lg font-bold text-white">T</div>
          <div className="text-xl font-bold text-jira-text">TaskFlow</div>
        </div>
        <div className="mb-6 text-sm text-jira-text-subtle">Log in to continue</div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" placeholder="you@company.com" {...register('email')} error={errors.email?.message} />
          <div className="relative">
            <Input label="Password" type={visible ? 'text' : 'password'} placeholder="••••••••" {...register('password')} error={errors.password?.message} />
            <button type="button" className="absolute right-3 top-8 text-jira-text-subtle" onClick={() => setVisible((value) => !value)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <Button className="w-full" loading={isSubmitting}>Log in</Button>
        </form>
        <div className="mt-6 text-sm text-jira-text-subtle">Don&apos;t have an account? <Link to="/signup" className="text-jira-blue-bold hover:underline">Sign up</Link></div>
      </div>
    </div>
  )
}
