import { createFileRoute } from '@tanstack/react-router'

import { PaymentErrorPage } from '@/components/payment/StripePaymentError'

export const Route = createFileRoute('/payment-error' as any)({
  component: PaymentErrorRouteComponent,
})

function PaymentErrorRouteComponent() {
  return (
    <div className="container mx-auto py-8">
      <PaymentErrorPage />
    </div>
  )
}
