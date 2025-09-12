import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/billing/methods')({
  component: PaymentMethodsPage,
})

function PaymentMethodsPage() {
  const { token } = useAuth()
  const qc = useQueryClient()
  const methods = useQuery({
    queryKey: ['billing', 'methods'],
    queryFn: async () => (await api.listPaymentMethods(token || '')).payment_methods ?? [],
    enabled: !!token,
  })

  const create = useMutation({
    mutationFn: async (payload: any) => api.createPaymentMethod(token || '', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'methods'] }),
  })
  const del = useMutation({
    mutationFn: async (id: string) => api.deletePaymentMethod(token || '', id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'methods'] }),
  })
  const setDefault = useMutation({
    mutationFn: async (id: string) => api.setDefaultPaymentMethod(token || '', id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'methods'] }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const provider = String(fd.get('provider') || 'stripe')
    const tokenVal = String(fd.get('token') || '')
    const last4 = String(fd.get('last4') || '')
    const expiry = String(fd.get('expiry') || '')
    create.mutate({ provider, token: tokenVal, card_last_four: last4, card_expiry: expiry })
    e.currentTarget.reset()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Payment Methods</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 mb-4">
        <input name="provider" placeholder="Provider (e.g., stripe)" className="border p-2 rounded" defaultValue="stripe" />
        <input name="token" placeholder="Provider token" className="border p-2 rounded" required />
        <div className="flex gap-2">
          <input name="last4" placeholder="Card last 4" className="border p-2 rounded" />
          <input name="expiry" placeholder="MM/YYYY" className="border p-2 rounded" />
        </div>
        <button className="px-3 py-2 bg-blue-600 text-white rounded self-start" disabled={create.isPending}>
          {create.isPending ? 'Adding...' : 'Add Method'}
        </button>
      </form>
      <ul className="divide-y bg-white border rounded">
        {methods.data?.map((m: any) => (
          <li key={m.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{m.provider} ••••{m.card_last_four}</p>
              <p className="text-xs text-gray-600">{m.card_expiry}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-blue-600" onClick={() => setDefault.mutate(m.id)}>Make default</button>
              <button className="text-red-600" onClick={() => del.mutate(m.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
