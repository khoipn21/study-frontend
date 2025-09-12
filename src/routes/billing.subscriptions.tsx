import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/billing/subscriptions')({
  component: SubscriptionsPage,
})

function SubscriptionsPage() {
  const { token } = useAuth()
  const qc = useQueryClient()
  const subs = useQuery({
    queryKey: ['billing', 'subscriptions'],
    queryFn: async () => (await api.listSubscriptions(token || ''))?.subscriptions ?? [],
    enabled: !!token,
  })

  const create = useMutation({
    mutationFn: async (payload: any) => api.createSubscription(token || '', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['billing', 'subscriptions'] }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payment_method_id = String(fd.get('payment_method_id') || '')
    const plan_name = String(fd.get('plan_name') || 'pro')
    const billing_period = String(fd.get('billing_period') || 'monthly')
    const price = Number(fd.get('price') || '0')
    create.mutate({ payment_method_id, plan_name, billing_period, price })
    e.currentTarget.reset()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Subscriptions</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 mb-4">
        <input name="payment_method_id" placeholder="Payment Method ID" className="border p-2 rounded" required />
        <div className="flex gap-2">
          <input name="plan_name" placeholder="Plan name" className="border p-2 rounded" defaultValue="pro" />
          <input name="billing_period" placeholder="Billing (monthly/yearly)" className="border p-2 rounded" defaultValue="monthly" />
        </div>
        <input name="price" placeholder="Price" className="border p-2 rounded" defaultValue="9.99" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded self-start" disabled={create.isPending}>
          {create.isPending ? 'Subscribing...' : 'Create Subscription'}
        </button>
      </form>
      <ul className="divide-y bg-white border rounded">
        {subs.data?.map((s: any) => (
          <li key={s.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.plan_name} • {s.status}</p>
              <p className="text-xs text-gray-600">Next: {s.next_billing_date}</p>
            </div>
            <div className="text-xs text-gray-500">{s.billing_period} • {s.price}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

