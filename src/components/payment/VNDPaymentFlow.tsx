import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  Clock,
  CreditCard,
  Download,
  Globe,
  Loader2,
  Lock,
  Receipt,
  RefreshCw,
  Shield,
  Smartphone,
  Star,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api-client'
import { formatVND, usdToVND } from '@/lib/currency'
import { formatVietnameseDate } from '@/lib/vietnamese-locale'
import { cn } from '@/lib/utils'
import type { Course, User } from '@/lib/types'

interface VNDPaymentFlowProps {
  course: Course
  user: User
  onSuccess?: (enrollmentId: string) => void
  onCancel?: () => void
  onError?: (error: string) => void
}

type PaymentStep = 'review' | 'payment' | 'processing' | 'success' | 'error'

interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'bank' | 'ewallet'
  logo?: string
  description: string
  processingTime: string
  fees?: {
    fixed?: number
    percentage?: number
  }
  available: boolean
}

interface OrderSummary {
  coursePrice: number
  originalPriceUSD?: number
  discount?: {
    amount: number
    percentage: number
  }
  fees: {
    platform: number
    payment: number
  }
  total: number
  currency: 'VND'
  exchangeRate?: number
}

const VIETNAMESE_PAYMENT_METHODS: Array<PaymentMethod> = [
  {
    id: 'vnpay',
    name: 'VNPay',
    type: 'bank',
    description: 'Thẻ ATM nội địa, QR Pay',
    processingTime: 'Tức thì',
    fees: { percentage: 1.5 },
    available: true,
  },
  {
    id: 'momo',
    name: 'MoMo',
    type: 'ewallet',
    description: 'Ví điện tử MoMo',
    processingTime: 'Tức thì',
    fees: { percentage: 2.0 },
    available: true,
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    type: 'ewallet',
    description: 'Ví điện tử ZaloPay',
    processingTime: 'Tức thì',
    fees: { percentage: 1.8 },
    available: true,
  },
  {
    id: 'viettelpay',
    name: 'ViettelPay',
    type: 'ewallet',
    description: 'Ví điện tử ViettelPay',
    processingTime: 'Tức thì',
    fees: { percentage: 2.0 },
    available: true,
  },
  {
    id: 'international_card',
    name: 'Thẻ quốc tế',
    type: 'card',
    description: 'Visa, Mastercard, JCB',
    processingTime: '1-3 phút',
    fees: { percentage: 2.5 },
    available: true,
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    type: 'bank',
    description: 'Chuyển khoản trực tiếp',
    processingTime: '1-24 giờ',
    fees: { fixed: 0 },
    available: true,
  },
]

export function VNDPaymentFlow({
  course,
  user,
  onSuccess: _onSuccess,
  onCancel,
  onError,
}: VNDPaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('review')
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('vnpay')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [enrollmentId, _setEnrollmentId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useQueryClient()

  // Calculate order summary
  const orderSummary: OrderSummary = React.useMemo(() => {
    const originalPriceUSD = course.price || 0
    const vndPrice =
      course.currency === 'VND' ? originalPriceUSD : usdToVND(originalPriceUSD)

    const discount =
      course.discount_percentage && course.price
        ? {
            amount: Math.round(vndPrice * (course.discount_percentage / 100)),
            percentage: course.discount_percentage,
          }
        : undefined

    const discountedPrice = discount ? vndPrice - discount.amount : vndPrice

    const selectedMethod = VIETNAMESE_PAYMENT_METHODS.find(
      (m) => m.id === selectedPaymentMethod,
    )
    const paymentFee = selectedMethod?.fees
      ? (selectedMethod.fees.fixed || 0) +
        (discountedPrice * (selectedMethod.fees.percentage || 0)) / 100
      : 0

    const platformFee = Math.round(discountedPrice * 0.05) // 5% platform fee
    const total = discountedPrice + platformFee + paymentFee

    return {
      coursePrice: vndPrice,
      originalPriceUSD:
        course.currency !== 'VND' ? originalPriceUSD : undefined,
      discount,
      fees: {
        platform: platformFee,
        payment: Math.round(paymentFee),
      },
      total: Math.round(total),
      currency: 'VND' as const,
      exchangeRate: course.currency !== 'VND' ? 24000 : undefined, // Mock exchange rate
    }
  }, [course, selectedPaymentMethod])

  // Create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async () => {
      // For VND payments, we'll use the backend payment endpoint
      const response = await api.purchaseCourse(
        'user-token', // This should come from auth context
        course.id,
        {
          payment_method_id: selectedPaymentMethod,
          amount: orderSummary.total,
        },
      )

      return response
    },
    onSuccess: (data) => {
      if (data.transaction) {
        // For VND payments, transaction is created directly
        setCheckoutUrl('/payment/success') // Set a success URL
        setCurrentStep('success')
      } else {
        setErrorMessage('Không thể tạo phiên thanh toán')
        setCurrentStep('error')
      }
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : 'Lỗi thanh toán')
      setCurrentStep('error')
      onError?.(errorMessage || 'Payment failed')
    },
  })

  const handlePayment = () => {
    if (!acceptedTerms) {
      setErrorMessage('Vui lòng đồng ý với điều khoản sử dụng')
      return
    }

    setCurrentStep('processing')
    setProcessingProgress(0)
    createCheckoutMutation.mutate()
  }

  const selectedMethod = VIETNAMESE_PAYMENT_METHODS.find(
    (m) => m.id === selectedPaymentMethod,
  )

  const renderReviewStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Course Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Thông tin khóa học
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-24 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-warning" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                )}
                {course.enrollment_count && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {course.enrollment_count.toLocaleString()} học viên
                    </span>
                  </div>
                )}
                {course.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.round(course.duration_minutes / 60)} giờ</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3"
              >
                {VIETNAMESE_PAYMENT_METHODS.filter(
                  (method) => method.available,
                ).map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={cn(
                      'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                      selectedPaymentMethod === method.id &&
                        'border-primary bg-primary/5',
                    )}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{method.name}</span>
                        {method.fees?.percentage && (
                          <Badge variant="outline" className="text-xs">
                            +{method.fees.percentage}% phí
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Thời gian xử lý: {method.processingTime}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) =>
                    setAcceptedTerms(checked === true)
                  }
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  Tôi đồng ý với{' '}
                  <button className="text-primary underline">
                    Điều khoản sử dụng
                  </button>{' '}
                  và{' '}
                  <button className="text-primary underline">
                    Chính sách bảo mật
                  </button>{' '}
                  của nền tảng. Tôi hiểu rằng việc mua khóa học này sẽ cấp cho
                  tôi quyền truy cập trọn đời vào nội dung khóa học.
                </Label>
              </div>

              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Đảm bảo hoàn tiền 30 ngày:</strong> Nếu không hài lòng
                  với khóa học, bạn có thể yêu cầu hoàn tiền trong vòng 30 ngày
                  đầu.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Price */}
              <div className="flex justify-between">
                <span>Giá khóa học:</span>
                <div className="text-right">
                  {orderSummary.discount ? (
                    <>
                      <div className="line-through text-muted-foreground text-sm">
                        {formatVND(orderSummary.coursePrice)}
                      </div>
                      <div className="font-medium">
                        {formatVND(
                          orderSummary.coursePrice -
                            orderSummary.discount.amount,
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="font-medium">
                      {formatVND(orderSummary.coursePrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Discount */}
              {orderSummary.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({orderSummary.discount.percentage}%):</span>
                  <span>-{formatVND(orderSummary.discount.amount)}</span>
                </div>
              )}

              {/* Exchange Rate Info */}
              {orderSummary.originalPriceUSD && orderSummary.exchangeRate && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  <div className="flex justify-between">
                    <span>Giá gốc:</span>
                    <span>${orderSummary.originalPriceUSD}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỷ giá:</span>
                    <span>
                      1 USD = {orderSummary.exchangeRate.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Fees */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Phí nền tảng:</span>
                  <span>{formatVND(orderSummary.fees.platform)}</span>
                </div>
                {orderSummary.fees.payment > 0 && (
                  <div className="flex justify-between">
                    <span>Phí thanh toán ({selectedMethod?.name}):</span>
                    <span>{formatVND(orderSummary.fees.payment)}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {formatVND(orderSummary.total)}
                </span>
              </div>

              {/* Course Features Reminder */}
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-3 w-3" />
                  <span>Chứng chỉ hoàn thành</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3 w-3" />
                  <span>Truy cập trên mọi thiết bị</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Truy cập trọn đời</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-3 w-3" />
                  <span>Tài liệu có thể tải xuống</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePayment}
                  disabled={!acceptedTerms || createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tạo thanh toán...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Thanh toán an toàn
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={onCancel}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </div>

              {/* Security Note */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Thanh toán được bảo mật</span>
                </div>
                <p className="text-green-700 text-xs mt-1">
                  Thông tin của bạn được mã hóa và bảo vệ theo chuẩn quốc tế
                  SSL.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderProcessingStep = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Đang xử lý thanh toán</h2>
        <p className="text-muted-foreground">
          Vui lòng không đóng trang này. Chúng tôi đang xử lý thanh toán của
          bạn...
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={processingProgress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {processingProgress < 30 && 'Khởi tạo thanh toán...'}
          {processingProgress >= 30 &&
            processingProgress < 60 &&
            'Xác thực thông tin...'}
          {processingProgress >= 60 &&
            processingProgress < 90 &&
            'Xử lý giao dịch...'}
          {processingProgress >= 90 && 'Hoàn tất thanh toán...'}
        </p>
      </div>

      {checkoutUrl && (
        <div className="mt-6">
          <Button
            size="lg"
            onClick={() => window.open(checkoutUrl, '_blank')}
            className="w-full"
          >
            <Globe className="h-4 w-4 mr-2" />
            Mở trang thanh toán
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Trang thanh toán sẽ mở trong tab mới
          </p>
        </div>
      )}
    </div>
  )

  const renderSuccessStep = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-muted-foreground">
          Chúc mừng! Bạn đã đăng ký thành công khóa học{' '}
          <strong>{course.title}</strong>.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Khóa học:</span>
              <span className="font-medium">{course.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Số tiền:</span>
              <span className="font-medium">
                {formatVND(orderSummary.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức:</span>
              <span className="font-medium">{selectedMethod?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian:</span>
              <span className="font-medium">
                {formatVietnameseDate(new Date(), 'short')}
              </span>
            </div>
            {enrollmentId && (
              <div className="flex justify-between">
                <span>Mã đăng ký:</span>
                <span className="font-medium text-xs">{enrollmentId}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => (window.location.href = `/courses/${course.id}`)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Bắt đầu học ngay
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => (window.location.href = '/dashboard')}
        >
          Về trang cá nhân
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Hóa đơn điện tử đã được gửi đến email <strong>{user.email}</strong>.
          Bạn có thể tải xuống trong phần quản lý tài khoản.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderErrorStep = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Thanh toán thất bại
        </h2>
        <p className="text-muted-foreground mb-4">
          {errorMessage ||
            'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.'}
        </p>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Không có khoản tiền nào được trừ từ tài khoản của bạn. Bạn có thể
            thử lại hoặc liên hệ hỗ trợ khách hàng.
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            setCurrentStep('review')
            setErrorMessage(null)
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại khóa học
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Cần hỗ trợ? Liên hệ:</p>
        <p>Email: support@studyplatform.vn</p>
        <p>Hotline: 1900-1234</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Thanh toán khóa học</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div
              className={cn(
                'flex items-center gap-2',
                currentStep === 'review' && 'text-primary font-medium',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs',
                  currentStep === 'review'
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground',
                )}
              >
                1
              </div>
              Xem lại
            </div>
            <div className="w-8 h-px bg-muted-foreground"></div>
            <div
              className={cn(
                'flex items-center gap-2',
                ['payment', 'processing'].includes(currentStep) &&
                  'text-primary font-medium',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs',
                  ['payment', 'processing'].includes(currentStep)
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground',
                )}
              >
                2
              </div>
              Thanh toán
            </div>
            <div className="w-8 h-px bg-muted-foreground"></div>
            <div
              className={cn(
                'flex items-center gap-2',
                ['success', 'error'].includes(currentStep) &&
                  'text-primary font-medium',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs',
                  ['success', 'error'].includes(currentStep)
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground',
                )}
              >
                3
              </div>
              Hoàn thành
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'review' && renderReviewStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'success' && renderSuccessStep()}
        {currentStep === 'error' && renderErrorStep()}
      </div>
    </div>
  )
}
