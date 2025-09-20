import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/mcp-todos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/mcp-todos&quot;!</div>
}
