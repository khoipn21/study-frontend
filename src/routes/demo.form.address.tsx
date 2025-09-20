import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/form/address')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/demo/form/address&quot;!</div>
}
