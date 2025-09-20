import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/start/server-funcs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/start/server-funcs&quot;!</div>
}
