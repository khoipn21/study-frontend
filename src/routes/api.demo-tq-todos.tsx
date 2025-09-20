import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/demo-tq-todos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/api/demo-tq-todos&quot;!</div>
}
