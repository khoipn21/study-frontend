import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/billing/transactions')({
  component: TransactionsPage,
})

function TransactionsPage() {
  const { token } = useAuth()
  const tx = useQuery({
    queryKey: ['billing', 'transactions'],
    queryFn: async () => (await api.listTransactions(token || '', { limit: 50, offset: 0 }))?.transactions ?? [],
    enabled: !!token,
  })

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      <ul className="divide-y bg-white border rounded">
        {tx.data?.map((t: any) => (
          <li key={t.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{t.status} • {t.amount} {t.currency}</p>
              <p className="text-xs text-gray-600">{new Date(t.created_at).toLocaleString()}</p>
            </div>
            <div className="text-xs text-gray-500">{t.transaction_reference}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

