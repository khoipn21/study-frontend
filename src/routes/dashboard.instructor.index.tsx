import React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { InstructorGuard } from '@/components/InstructorGuard'

export const Route = createFileRoute('/dashboard/instructor/')({
  component: InstructorDashboard,
})

function InstructorDashboard() {
  const { user, token } = useAuth()
  const courses = useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: async () => (await api.listCourses({ page: 1, page_size: 50, q: undefined })).data!,
    enabled: !!user,
  })

  const mine = (courses.data?.courses || []).filter((c) => c.instructor_id === user?.id)

  return (
    <InstructorGuard>
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Instructor Dashboard</h1>
          <Link to="/dashboard/instructor/courses/new" className="px-3 py-1 bg-blue-600 text-white rounded">New Course</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mine.map((c) => (
            <div key={c.id} className="border rounded p-4 bg-white">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <Link to="/dashboard/instructor/courses/$courseId/edit" params={{ courseId: c.id }} className="text-blue-600">Edit</Link>
                <Link to="/dashboard/instructor/courses/$courseId/lectures" params={{ courseId: c.id }} className="text-blue-600">Lectures</Link>
                <Link to="/courses/$courseId" params={{ courseId: c.id }} className="text-blue-600">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InstructorGuard>
  )
}

