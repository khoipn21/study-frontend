import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/course/$courseId/progress')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/me/course/$courseId/progress&quot;!</div>
}
