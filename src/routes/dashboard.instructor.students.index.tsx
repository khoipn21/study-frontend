import { createFileRoute } from '@tanstack/react-router'
import { Download, Filter, MessageSquare } from 'lucide-react'
import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import StudentsManagement from '@/components/instructor/StudentsManagement'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/instructor/students/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <InstructorDashboardLayout
      title="Student Management"
      description="Monitor student progress, engagement, and manage communications"
      headerContent={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Students
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Bulk Message
          </Button>
        </div>
      }
    >
      <StudentsManagement />
    </InstructorDashboardLayout>
  )
}
