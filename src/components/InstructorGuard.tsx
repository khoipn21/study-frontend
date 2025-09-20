import { useAuth } from '@/lib/auth-context'

export function InstructorGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const allowed = user && (user.role === 'instructor' || user.role === 'admin')
  if (!allowed) {
    return <div className="p-4">Instructor access required.</div>
  }
  return <>{children}</>
}
