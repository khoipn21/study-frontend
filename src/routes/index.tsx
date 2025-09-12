import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Trophy, 
  Star,
  Play,
  Clock,
  Award,
  TrendingUp,
  MessageSquare,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of real-world experience'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with peers in discussions, forums, and collaborative projects'
    },
    {
      icon: Trophy,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with industry-recognized certificates'
    },
    {
      icon: Zap,
      title: 'AI-Powered Tutoring',
      description: 'Get personalized help with our intelligent AI tutor available 24/7'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '15,000+' },
    { label: 'Expert Instructors', value: '250+' },
    { label: 'Course Hours', value: '1,000+' },
    { label: 'Completion Rate', value: '95%' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'The courses here transformed my career. The practical approach and expert guidance made all the difference.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      content: 'Outstanding platform with high-quality content. The AI tutor helped me whenever I was stuck.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      content: 'I love the interactive discussions and the supportive community. Learned so much from both instructors and peers.',
      rating: 5
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              <span className="font-academic">Unlock Your</span>{' '}
              <span className="text-primary">Potential</span>
              <br />
              <span className="font-academic">Through Learning</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners advancing their careers with our comprehensive courses, 
              expert instruction, and cutting-edge AI tutoring system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="h-12 px-8">
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="h-12 px-8">
                    <Link to="/auth/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-8">
                    <Link to="/courses">
                      Browse Courses
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm lg:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine academic excellence with modern technology to create 
              the ultimate learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="academic-card p-6 text-center group">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4">
              Popular Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses taught by industry experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="academic-card overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary/80" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>12 hours</span>
                    <span>•</span>
                    <Star className="h-4 w-4 fill-current text-warning" />
                    <span>4.9</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    Advanced React Development
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Master React with hooks, context, and modern patterns
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">$99</span>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners who transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="academic-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold font-academic mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already advancing their careers. 
            Start with a free account and explore our course catalog.
          </p>
          {user ? (
            <Button size="lg" variant="secondary" asChild className="h-12 px-8">
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="h-12 px-8">
                <Link to="/auth/register">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
