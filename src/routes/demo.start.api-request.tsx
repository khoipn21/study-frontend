import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/start/api-request')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/start/api-request&quot;!</div>
}
