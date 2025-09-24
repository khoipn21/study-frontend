import { createFileRoute } from '@tanstack/react-router'
import { PaymentSuccessPage } from '@/components/payment/StripePaymentSuccess'

export const Route = createFileRoute('/payment-success' as any)({
  component: PaymentSuccessRouteComponent,
})

function PaymentSuccessRouteComponent() {
  return (
    <div className="container mx-auto py-8">
      <PaymentSuccessPage />
    </div>
  )
}
