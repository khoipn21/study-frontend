import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { Protected } from '@/components/Protected'

export const Route = createFileRoute('/me/enrollments')({
  component: EnrollmentsPage,
})

function EnrollmentsPage() {
  const { token } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await api.listEnrollments(token || '')
      return (
        res.data ?? {
          enrollments: [],
          total: 0,
          page: 1,
          page_size: 10,
          total_pages: 1,
        }
      )
    },
    enabled: !!token,
  })

  return (
    <Protected>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">My Enrollments</h1>
        {isLoading && <div>Loading...</div>}
        <ul className="divide-y">
          {data?.enrollments.map((e) => (
            <li key={e.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Course: {e.course_id}</p>
                  <p className="text-sm text-gray-600">
                    Progress: {Math.round(e.progress_percentage || 0)}%
                  </p>
                </div>
                <Link
                  to="/courses/$courseId"
                  params={{ courseId: e.course_id }}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Protected>
  )
}
