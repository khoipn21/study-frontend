import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { InstructorGuard } from '@/components/InstructorGuard'

export const Route = createFileRoute('/dashboard/instructor/courses/new')({
  component: NewCourse,
})

function NewCourse() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const create = useMutation({
    mutationFn: async (payload: any) => api.createCourse(token || '', payload),
    onSuccess: (res) => navigate({ to: '/dashboard/instructor/courses/$courseId/edit', params: { courseId: res.data?.id || '' } }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      instructor_id: user?.id || '',
      category: String(fd.get('category') || 'general'),
      level: String(fd.get('level') || 'beginner'),
      price: Number(fd.get('price') || '0'),
      currency: 'USD',
      thumbnail_url: String(fd.get('thumbnail_url') || ''),
    }
    create.mutate(payload)
  }

  return (
    <InstructorGuard>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Create New Course</h1>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <input name="title" placeholder="Title" className="border p-2 rounded" required />
          <textarea name="description" placeholder="Description" className="border p-2 rounded" />
          <input name="category" placeholder="Category" className="border p-2 rounded" />
          <select name="level" className="border p-2 rounded">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input name="price" type="number" step="0.01" placeholder="Price" className="border p-2 rounded" />
          <input name="thumbnail_url" placeholder="Thumbnail URL" className="border p-2 rounded" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded self-start" disabled={create.isPending}>
            {create.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </InstructorGuard>
  )
}

