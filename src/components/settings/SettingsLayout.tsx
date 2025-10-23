import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from './ProfileSettings'
import { PasswordSettings } from './PasswordSettings'
import { useMicrocopy } from '@/components/ui/microcopy-provider'
import { User, Lock } from 'lucide-react'

export function SettingsLayout() {
  const { text } = useMicrocopy()

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User size={16} />
          {text.auth.settings.profile}
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock size={16} />
          {text.auth.settings.security}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-6">
        <ProfileSettings />
      </TabsContent>
      
      <TabsContent value="security" className="mt-6">
        <PasswordSettings />
      </TabsContent>
    </Tabs>
  )
}
