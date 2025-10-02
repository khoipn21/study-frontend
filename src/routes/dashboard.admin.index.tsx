import { createFileRoute } from '@tanstack/react-router'

import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import { requireAdminRole } from '@/lib/auth-guards'

export const Route = createFileRoute('/dashboard/admin/')({
  beforeLoad: ({ location }) => {
    requireAdminRole(location)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminDashboardLayout
      title="Admin Dashboard"
      description="Manage platform-wide settings and oversee all activities"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Quick stats cards would go here */}
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
            <p className="text-muted-foreground">
              Manage the entire platform from this central dashboard
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Forum Management</h3>
            <p className="text-muted-foreground mb-4">
              Approve topics and manage forum content across all courses
            </p>
            <a
              href="/dashboard/admin/forum"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Manage Forums
            </a>
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-muted-foreground mb-4">
              Oversee all users, instructors, and their permissions
            </p>
            <a
              href="/dashboard/admin/users"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Manage Users
            </a>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
