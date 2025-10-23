import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMicrocopy } from '@/components/ui/microcopy-provider'
import { AvatarUpload } from './AvatarUpload'
import { toast } from 'sonner'

export function ProfileSettings() {
  const { user, token, login } = useAuth()
  const { text } = useMicrocopy()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    // Update user context with new avatar
    if (user && token) {
      const updatedUser = {
        ...user,
        avatar_url: newAvatarUrl,
      }
      login(updatedUser, token)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Not authenticated')
      return
    }

    // Check if at least one field has changed
    if (
      formData.username === user?.username &&
      formData.email === user?.email
    ) {
      toast.info('No changes to save')
      return
    }

    setLoading(true)

    try {
      const payload: Record<string, string> = {}
      if (formData.username !== user?.username) payload.username = formData.username
      if (formData.email !== user?.email) payload.email = formData.email

      const response = await api.updateProfile(token, payload)
      
      // Update user in context by calling login with updated data
      if (response.data && token) {
        const updatedUser = {
          ...user!,
          username: response.data.username,
          email: response.data.email,
          avatar_url: response.data.avatar_url,
        }
        login(updatedUser, token)
      }

      toast.success(text.auth.settings.updateSuccess)
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || text.auth.settings.updateError)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Avatar Upload Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {text.auth.settings.avatar}
        </h3>
        <AvatarUpload 
          currentAvatarUrl={user?.avatar_url}
          onAvatarUpdate={handleAvatarUpdate}
        />
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {text.auth.settings.personalInfo}
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">{text.auth.settings.username}</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">{text.auth.settings.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? text.auth.settings.saving : text.auth.settings.saveChanges}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            {text.auth.settings.cancel}
          </Button>
        </div>
      </form>
    </div>
  )
}
