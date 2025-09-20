import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/form/simple')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/form/simple&quot;!</div>
}
