import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/billing/subscriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/billing/subscriptions&quot;!</div>
}
