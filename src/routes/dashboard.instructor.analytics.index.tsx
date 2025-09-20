import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { Download, RefreshCw, Settings } from 'lucide-react'
import { useEffect } from 'react'
import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import AnalyticsDashboard from '@/components/instructor/AnalyticsDashboard'
import { Button } from '@/components/ui/button'
import { requireInstructorRole } from '@/lib/auth-guards'
import { useAuth } from '@/lib/auth-context'

type SearchParams = {
  token?: string
  user?: string
}

export const Route = createFileRoute('/dashboard/instructor/analytics/')({
  validateSearch: (search): SearchParams => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    user: typeof search.user === 'string' ? search.user : undefined,
  }),
  beforeLoad: ({ location, search }) => {
    // Skip auth check if OAuth parameters are present
    if (search.token != null && search.user != null) {
      return
    }
    requireInstructorRole(location)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const search = useSearch({ from: '/dashboard/instructor/analytics/' })
  const { login } = useAuth()

  // Handle OAuth authentication if parameters are present
  useEffect(() => {
    if (search.token != null && search.user != null) {
      // For OAuth login, we need to get the full user object
      // Since we only have the user ID, we'd typically make an API call
      // For now, create a minimal user object
      const user = {
        id: search.user,
        username: '',
        email: '',
        role: 'instructor' as const,
      }

      login(user, search.token)

      // Clear the OAuth parameters from URL
      void router.navigate({
        to: '/dashboard/instructor/analytics',
        replace: true,
      })
    }
  }, [search.token, search.user, login, router])

  return (
    <InstructorDashboardLayout
      title="Analytics Dashboard"
      description="Comprehensive insights into your course performance and revenue"
      headerContent={
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      }
    >
      <AnalyticsDashboard />
    </InstructorDashboardLayout>
  )
}
