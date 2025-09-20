import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/demo-names')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/api/demo-names&quot;!</div>
}
