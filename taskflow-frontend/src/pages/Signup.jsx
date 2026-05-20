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
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  role: yup.string().required('Role is required'),
  adminAccessKey: yup.string().nullable()
})

export default function Signup() {
  const { login } = useAuth()
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'MEMBER', adminAccessKey: '' }
  })

  const selectedRole = watch('role')

  const onSubmit = async ({ confirmPassword, ...data }) => {
    try {
      const payload = {
        ...data,
        adminAccessKey: data.role === 'SYSTEM_ADMIN' ? data.adminAccessKey : null
      }
      const response = await api.post('/auth/signup', payload)
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
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-jira-text-subtle">Global Role</label>
            <select
              {...register('role')}
              className="w-full rounded border border-jira-border bg-jira-elevated px-3 py-2 text-sm text-jira-text outline-none focus:border-jira-blue"
            >
              <option value="MEMBER">Member (Standard User)</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
            {errors.role?.message && <span className="text-xs text-red-500">{errors.role.message}</span>}
          </div>

          {selectedRole === 'SYSTEM_ADMIN' && (
            <Input
              label="Admin Access Key"
              type="password"
              placeholder="Enter Admin123 to verify"
              {...register('adminAccessKey')}
              error={errors.adminAccessKey?.message}
            />
          )}

          <Button className="w-full" loading={isSubmitting}>Sign up</Button>
        </form>
        <div className="mt-6 text-sm text-jira-text-subtle">Already have an account? <Link to="/login" className="text-jira-blue-bold hover:underline">Log in</Link></div>
      </div>
    </div>
  )
}
