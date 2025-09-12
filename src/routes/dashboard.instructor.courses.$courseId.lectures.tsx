import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { InstructorGuard } from '@/components/InstructorGuard'

export const Route = createFileRoute('/dashboard/instructor/courses/$courseId/lectures')({
  component: ManageLectures,
})

function ManageLectures() {
  const { courseId } = Route.useParams()
  const { token } = useAuth()
  const qc = useQueryClient()
  const lectures = useQuery({
    queryKey: ['lectures', courseId],
    queryFn: async () => (await api.listLectures(courseId, { page: 1, page_size: 100 })).data!,
  })
  const create = useMutation({
    mutationFn: async (payload: any) => api.createLecture(token || '', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lectures', courseId] }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      course_id: courseId,
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      order_number: Number(fd.get('order_number') || '1'),
      duration_minutes: Number(fd.get('duration_minutes') || '0'),
      is_free: String(fd.get('is_free') || '') === 'true',
      video_id: String(fd.get('video_id') || ''),
    }
    create.mutate(payload)
    e.currentTarget.reset()
  }

  return (
    <InstructorGuard>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Manage Lectures</h1>
        <form className="flex flex-col gap-2 mb-4" onSubmit={onSubmit}>
          <input name="title" placeholder="Lecture title" className="border p-2 rounded" required />
          <textarea name="description" placeholder="Description" className="border p-2 rounded" />
          <div className="flex gap-2">
            <input name="order_number" type="number" placeholder="Order" className="border p-2 rounded" defaultValue={ ((lectures.data?.lectures ?? []).length) + 1 } />
            <input name="duration_minutes" type="number" placeholder="Duration (min)" className="border p-2 rounded" />
            <input name="video_id" placeholder="Video ID (optional)" className="border p-2 rounded" />
          </div>
          <label className="text-sm"><input type="checkbox" name="is_free" value="true" /> Free preview</label>
          <button className="px-3 py-1 bg-blue-600 text-white rounded self-start" disabled={create.isPending}>
            {create.isPending ? 'Adding...' : 'Add Lecture'}
          </button>
        </form>
        <ul className="divide-y bg-white border rounded">
          {(lectures.data?.lectures ?? []).map((l) => (
            <li key={l.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{l.order_number}. {l.title}</p>
                <p className="text-xs text-gray-600">{l.duration_minutes} min • video: {l.video_id || '—'}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </InstructorGuard>
  )
}
