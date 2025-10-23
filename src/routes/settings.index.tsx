import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { useMicrocopy } from '@/components/ui/microcopy-provider'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { text } = useMicrocopy()
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{text.auth.settings.title}</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <SettingsLayout />
      </div>
    </div>
  )
}
