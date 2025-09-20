import { createFileRoute } from '@tanstack/react-router'
import { CourseCreationWizard } from '@/components/course/CourseCreationWizard'

export const Route = createFileRoute('/dashboard/instructor/courses/new')({
  component: CourseCreationPage,
})

function CourseCreationPage() {
  return <CourseCreationWizard />
}
