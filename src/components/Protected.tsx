import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'

export function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="p-4">
        <p className="mb-2">You must be logged in to view this page.</p>
        <Link to="/auth/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    )
  }
  return <>{children}</>
}
