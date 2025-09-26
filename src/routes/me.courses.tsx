import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/courses')({
  component: CourseDashboardRedirect,
})

function CourseDashboardRedirect() {
  // Redirect to the enhanced enrollments page which now serves as the course dashboard
  return <Navigate to="/me/enrollments" replace />
}
