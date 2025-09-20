import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mcp')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/mcp&quot;!</div>
}
