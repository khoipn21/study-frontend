import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { InstructorGuard } from '@/components/InstructorGuard'

export const Route = createFileRoute('/dashboard/instructor/courses/$courseId/edit')({
  component: EditCourse,
})

function EditCourse() {
  const { courseId } = Route.useParams()
  const { token } = useAuth()
  const course = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => (await api.getCourse(courseId)).data!,
  })
  const update = useMutation({
    mutationFn: async (payload: any) => api.updateCourse(token || '', courseId, payload),
    onSuccess: () => course.refetch(),
  })

  if (!course.data) return <div className="p-4">Loading...</div>

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: any = {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      category: String(fd.get('category') || ''),
      level: String(fd.get('level') || ''),
      price: Number(fd.get('price') || '0'),
      currency: 'USD',
      thumbnail_url: String(fd.get('thumbnail_url') || ''),
      status: String(fd.get('status') || 'draft'),
    }
    update.mutate(payload)
  }

  return (
    <InstructorGuard>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Course</h1>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <input name="title" defaultValue={course.data.title} className="border p-2 rounded" />
          <textarea name="description" defaultValue={course.data.description} className="border p-2 rounded" />
          <input name="category" defaultValue={course.data.category} className="border p-2 rounded" />
          <select name="level" defaultValue={course.data.level} className="border p-2 rounded">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input name="price" type="number" step="0.01" defaultValue={course.data.price} className="border p-2 rounded" />
          <input name="thumbnail_url" defaultValue={course.data.thumbnail_url} className="border p-2 rounded" />
          <select name="status" defaultValue={course.data.status} className="border p-2 rounded">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded self-start" disabled={update.isPending}>
            {update.isPending ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </InstructorGuard>
  )
}

