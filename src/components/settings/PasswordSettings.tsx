import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMicrocopy } from '@/components/ui/microcopy-provider'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export function PasswordSettings() {
  const { token } = useAuth()
  const { text } = useMicrocopy()
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Not authenticated')
      return
    }

    // Validate new password
    if (formData.newPassword.length < 8) {
      toast.error(text.auth.settings.passwordRequirements)
      return
    }

    // Validate password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(text.auth.settings.passwordMismatch)
      return
    }

    setLoading(true)

    try {
      await api.changePassword(token, {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      })

      toast.success(text.auth.settings.passwordSuccess)
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      console.error('Password change error:', error)
      
      if (error.message?.includes('incorrect')) {
        toast.error(text.auth.settings.invalidCurrentPassword)
      } else {
        toast.error(error.message || text.auth.settings.passwordError)
      }
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null
    if (password.length < 8) return { strength: 'weak', color: 'bg-red-500', label: 'Weak' }
    if (password.length < 12) return { strength: 'medium', color: 'bg-yellow-500', label: 'Medium' }
    return { strength: 'strong', color: 'bg-green-500', label: 'Strong' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          {text.auth.settings.passwordManagement}
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">
              {text.auth.settings.currentPassword}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">
              {text.auth.settings.newPassword}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: passwordStrength.strength === 'weak' ? '33%' : passwordStrength.strength === 'medium' ? '66%' : '100%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{passwordStrength.label}</span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-1">
              {text.auth.settings.passwordRequirements}
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              {text.auth.settings.confirmPassword}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? text.auth.settings.saving : text.auth.settings.saveChanges}
        </Button>
      </div>
    </form>
  )
}
