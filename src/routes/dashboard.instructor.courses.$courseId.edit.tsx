import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/instructor/courses/$courseId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello &quot;/dashboard/instructor/courses/$courseId/edit&quot;!</div>
  )
}
