import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
})

export default function Signup() {
  const { login } = useAuth()
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async ({ confirmPassword, ...data }) => {
    try {
      const response = await api.post('/auth/signup', data)
      login(response.data.token, response.data.user)
      toast.success('Account created!')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-jira-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-jira-border bg-jira-elevated p-10">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-jira-blue text-lg font-bold text-white">T</div>
          <div className="text-xl font-bold text-jira-text">TaskFlow</div>
        </div>
        <div className="mb-6 text-sm text-jira-text-subtle">Create your account</div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <div className="relative">
            <Input label="Password" type={visible ? 'text' : 'password'} {...register('password')} error={errors.password?.message} />
            <button type="button" className="absolute right-3 top-8 text-jira-text-subtle" onClick={() => setVisible((value) => !value)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <Input label="Confirm password" type={visible ? 'text' : 'password'} {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          <Button className="w-full" loading={isSubmitting}>Sign up</Button>
        </form>
        <div className="mt-6 text-sm text-jira-text-subtle">Already have an account? <Link to="/login" className="text-jira-blue-bold hover:underline">Log in</Link></div>
      </div>
    </div>
  )
}
