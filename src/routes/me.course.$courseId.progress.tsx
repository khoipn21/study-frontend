import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/me/course/$courseId/progress')({
  component: CourseProgressPage,
})

function CourseProgressPage() {
  const { courseId } = Route.useParams()
  const { token } = useAuth()
  const qc = useQueryClient()
  const progress = useQuery({
    queryKey: ['progress', courseId],
    queryFn: async () => (await api.getCourseProgress(token || '', courseId)).data,
    enabled: !!token,
  })

  const complete = useMutation({
    mutationFn: async (lectureId: string) =>
      api.completeLecture(token || '', {
        course_id: courseId,
        lecture_id: lectureId,
        watch_time_seconds: 60,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['progress', courseId] }),
  })

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Course Progress</h1>
      <ul className="divide-y bg-white border rounded">
        {progress.data?.lecture_progress?.map((lp: any) => (
          <li key={lp.lecture_id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{lp.order_number}. {lp.title}</p>
              <p className="text-xs text-gray-600">{Math.round(lp.progress_percentage || 0)}% • {lp.watch_time_seconds}s</p>
            </div>
            {!lp.is_completed && (
              <button className="text-blue-600" onClick={() => complete.mutate(lp.lecture_id)}>Mark Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
