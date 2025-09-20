import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forum/posts/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/forum/posts/$postId&quot;!</div>
}
