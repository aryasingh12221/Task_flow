import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TopBar from '../components/layout/TopBar'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  password: yup.string().transform((curr, orig) => orig === '' ? null : curr).nullable().min(8, 'Password must be at least 8 characters'),
  openaiApiKey: yup.string().nullable()
})

export default function UserSettingsPage() {
  const { user, login, logout } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      password: '',
      openaiApiKey: user?.openaiApiKey || ''
    }
  })

  const onSubmit = async (data) => {
    try {
      const response = await api.put('/users/settings', {
        name: data.name,
        password: data.password || null,
        openaiApiKey: data.openaiApiKey || ''
      })
      // Update local context user data
      login(localStorage.getItem('ttm_token'), response.data)
      toast.success('Settings updated successfully!')
      reset({
        name: response.data.name,
        password: '',
        openaiApiKey: response.data.openaiApiKey || ''
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update settings')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      'WARNING: Are you absolutely sure you want to delete your account? This will permanently delete your profile, any projects you created/lead, and all associated issues. This action CANNOT be undone.'
    )
    if (!confirmation) return

    try {
      setIsDeleting(true)
      await api.delete('/users/me')
      toast.success('Account permanently deleted.')
      logout()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-jira-bg text-jira-text">
      <TopBar breadcrumb={[{ label: 'Home', to: '/projects' }, { label: 'User Settings' }]} />
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">User Settings</h1>
          <p className="text-sm text-jira-text-subtle">Manage your profile, credentials, and configuration</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-lg border border-jira-border bg-jira-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-jira-text">Account Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
              />
              
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email address cannot be changed."
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Leave blank to keep current password"
                {...register('password')}
                error={errors.password?.message}
              />

              <Input
                label="OpenAI API Key"
                type="password"
                placeholder="sk-..."
                {...register('openaiApiKey')}
                error={errors.openaiApiKey?.message}
                helperText="Pre-configured key for future AI operations and autonomous task agents."
              />

              <div className="pt-2">
                <Button type="submit" loading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-950 bg-red-950/20 p-6">
            <h2 className="mb-2 text-lg font-medium text-red-400">Danger Zone</h2>
            <p className="mb-4 text-sm text-jira-text-subtle">
              Permanently delete your account and all associated data, including workspaces, memberships, and assigned tasks.
            </p>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              onClick={handleDeleteAccount}
              loading={isDeleting}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
