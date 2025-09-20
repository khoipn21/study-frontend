import { createFileRoute } from '@tanstack/react-router'
import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import DashboardOverview from '@/components/instructor/DashboardOverview'
import { requireInstructorRole } from '@/lib/auth-guards'

export const Route = createFileRoute('/dashboard/instructor/')({
  beforeLoad: ({ location }) => {
    requireInstructorRole(location)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <InstructorDashboardLayout
      title="Dashboard Overview"
      description="Monitor your course performance and student engagement"
    >
      <DashboardOverview />
    </InstructorDashboardLayout>
  )
}
