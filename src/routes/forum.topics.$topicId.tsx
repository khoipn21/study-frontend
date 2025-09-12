import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/forum/topics/$topicId')({
  component: TopicPage,
})

function TopicPage() {
  const { topicId } = Route.useParams()
  const { token, user } = useAuth()
  const qc = useQueryClient()

  const topic = useQuery({
    queryKey: ['forum', 'topic', topicId],
    queryFn: async () => await api.getTopic(topicId),
  })
  const posts = useQuery({
    queryKey: ['forum', 'topic', topicId, 'posts'],
    queryFn: async () => await api.listTopicPosts(topicId, { page: 1, limit: 50 }),
  })

  const createPost = useMutation({
    mutationFn: async (content: string) =>
      api.createPost(token || '', { topic_id: topicId, content }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forum', 'topic', topicId, 'posts'] }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const content = String(fd.get('content') || '')
    createPost.mutate(content)
    e.currentTarget.reset()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{topic.data?.title ?? 'Topic'}</h1>
      <p className="text-gray-700 mb-4">{topic.data?.description}</p>
      <ul className="divide-y bg-white border rounded">
        {posts.data?.posts?.map((p: any) => (
          <li key={p.id} className="p-3">
            <div className="text-sm">{p.content}</div>
            <div className="text-xs text-gray-500">by {p.user_id} at {new Date(p.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {user && (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
          <textarea name="content" placeholder="Write a reply..." className="border p-2 rounded" required />
          <button className="px-3 py-2 bg-blue-600 text-white rounded self-start" disabled={createPost.isPending}>
            {createPost.isPending ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
    </div>
  )
}
