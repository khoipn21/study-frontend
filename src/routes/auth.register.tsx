import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = React.useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (payload: {
      username: string
      email: string
      password: string
    }) => api.register(payload),
    onSuccess: (res) => {
      const data = res.data!
      login(data.user, data.token)
      navigate({ to: '/courses/' })
    },
    onError: (e: any) => setError(e?.message || 'Registration failed'),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const username = String(fd.get('username') || '')
    const email = String(fd.get('email') || '')
    const password = String(fd.get('password') || '')
    mutation.mutate({ username, email, password })
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="Username"
          className="border rounded p-2"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border rounded p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Register'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <p className="text-sm mt-3">
        Have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </div>
  )
}
