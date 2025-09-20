import { Link, createFileRoute } from '@tanstack/react-router'
import { Download, Plus, Upload } from 'lucide-react'
import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import CoursesDataTable from '@/components/instructor/CoursesDataTable'
import { Button } from '@/components/ui/button'
import { requireInstructorRole } from '@/lib/auth-guards'

export const Route = createFileRoute('/dashboard/instructor/courses/')({
  beforeLoad: ({ location }) => {
    requireInstructorRole(location)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <InstructorDashboardLayout
      title="Course Management"
      description="Manage your courses, track performance, and engage with students"
      headerContent={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button asChild>
            <Link to="/dashboard/instructor/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>
      }
    >
      <CoursesDataTable />
    </InstructorDashboardLayout>
  )
}
