import { Link, createFileRoute } from '@tanstack/react-router'
import { Award, BookOpen, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container py-24 sm:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Nền tảng học tập trực tuyến{' '}
            <span className="text-primary">hàng đầu</span>
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Khám phá hàng nghìn khóa học chất lượng cao với giảng viên chuyên
            nghiệp. Học mọi lúc, mọi nơi với các khóa học từ cơ bản đến nâng
            cao.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link to="/courses">Khám phá khóa học</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/register">Đăng ký ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <p className="text-muted-foreground">Học viên</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <p className="text-muted-foreground">Khóa học</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <p className="text-muted-foreground">Giảng viên</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <p className="text-muted-foreground">Hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Tại sao chọn chúng tôi?</h2>
          <p className="text-muted-foreground mt-2">
            Những tính năng nổi bật của nền tảng học tập
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary" />
              <CardTitle>Khóa học đa dạng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hàng trăm khóa học từ công nghệ, kinh doanh đến nghệ thuật
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle>Cộng đồng học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Kết nối và học hỏi cùng cộng đồng học viên tích cực
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary" />
              <CardTitle>Chứng chỉ uy tín</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Nhận chứng chỉ hoàn thành được công nhận rộng rãi
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle>Theo dõi tiến độ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Theo dõi và quản lý tiến độ học tập một cách dễ dàng
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Bắt đầu hành trình học tập ngay hôm nay
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học viên đã thành công với nền tảng của
            chúng tôi
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth/register">Đăng ký miễn phí</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
