import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/mcp-todos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/api/mcp-todos&quot;!</div>
}
