import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/tanstack-query&quot;!</div>
}
