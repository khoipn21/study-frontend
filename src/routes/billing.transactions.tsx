import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/billing/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/billing/transactions&quot;!</div>
}
