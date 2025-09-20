import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forum/topics/$topicId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/forum/topics/$topicId&quot;!</div>
}
