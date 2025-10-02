import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Download,
  Globe,
  Heart,
  Loader2,
  Lock,
  MessageSquare,
  Play,
  PlusCircle,
  Share2,
  Star,
  Target,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { CreateTopicDialog } from '@/components/forum/create-topic-dialog'
import { TopicList } from '@/components/forum/TopicList'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateTopic, useTopics } from '@/hooks/use-forum'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/courses/$courseId')({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const { token, user } = useAuth()
  const qc = useQueryClient()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [createTopicOpen, setCreateTopicOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => (await api.getCourse(courseId)).data!,
  })

  const lecturesQuery = useQuery({
    queryKey: ['lectures', courseId],
    queryFn: async () => (await api.listLectures(courseId)).data!,
    enabled: !!courseId,
  })

  // Check enrollment status
  const { data: enrollmentData } = useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: async () => {
      if (!token) return null
      try {
        const res = await api.getMyEnrolledCourses(token)
        const enrolledCourse = res.data?.courses?.find(
          (course) => course.id === courseId,
        )
        return enrolledCourse?.enrollment
      } catch {
        return null
      }
    },
    enabled: !!user && !!token,
  })

  const isUserEnrolled = useMemo(() => {
    return !!enrollmentData
  }, [enrollmentData])

  // Forum topics for this course
  const { data: forumTopicsData, isLoading: isLoadingTopics } = useTopics({
    courseId,
  })

  const createTopicMutation = useCreateTopic()

  const forumTopics = forumTopicsData?.topics || []

  const handleCreateTopic = async (data: any) => {
    try {
      if (!token) {
        throw new Error('You must be logged in to create topics')
      }
      await createTopicMutation.mutateAsync({
        data: { ...data, courseId },
        authToken: token,
      })
      alert('Topic created and sent for approval!')
      setCreateTopicOpen(false)
    } catch (error) {
      throw new Error('Failed to create topic. Please try again.')
    }
  }

  // For free courses only - paid courses must go through payment flow
  const enrollFree = async () => {
    if (!token) return alert('Please login first')
    if (course?.price && course.price > 0) {
      alert('This is a paid course. Please use the payment option.')
      return
    }

    try {
      await api.enroll(token, courseId)
      await qc.invalidateQueries({ queryKey: ['enrollment', courseId] })
      alert('Successfully enrolled!')
    } catch (error) {
      alert('Enrollment failed. Please try again.')
    }
  }

  // Handle successful payment - this will enroll the user
  const handlePaymentSuccess = async () => {
    try {
      // After successful payment, enroll the user
      if (token) {
        await api.enroll(token, courseId)
        await qc.invalidateQueries({ queryKey: ['enrollment', courseId] })
      }
    } catch (error) {
      console.error('Post-payment enrollment failed:', error)
      // Payment succeeded but enrollment failed - this should be handled by backend
      alert(
        'Payment successful! Please contact support if you cannot access the course.',
      )
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading course...</span>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Course not found</h2>
        <p className="text-muted-foreground mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </Button>
      </div>
    )
  }

  const lectures = lecturesQuery.data?.lectures ?? []
  const totalDuration = lectures.reduce(
    (sum, lecture) => sum + (lecture.duration_minutes || 0),
    0,
  )
  const completedLectures = lectures.filter(
    (l) => l.is_free || isUserEnrolled,
  ).length
  const progressPercentage =
    lectures.length > 0 ? (completedLectures / lectures.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              to="/courses"
              className="hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">
              {course.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {course.level && (
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full border',
                          course.level === 'beginner' &&
                            'course-level-beginner',
                          course.level === 'intermediate' &&
                            'course-level-intermediate',
                          course.level === 'advanced' &&
                            'course-level-advanced',
                          course.level === 'expert' && 'course-level-expert',
                        )}
                      >
                        {course.level}
                      </span>
                    )}
                    {course.category && (
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        {course.category}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold font-academic text-foreground mb-3">
                    {course.title}
                  </h1>

                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {course.instructor_name && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>by {course.instructor_name}</span>
                      </div>
                    )}
                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-warning" />
                        <span>{course.rating}</span>
                        {course.rating_count && (
                          <span>({course.rating_count.toLocaleString()})</span>
                        )}
                      </div>
                    )}
                    {course.enrollment_count && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {course.enrollment_count.toLocaleString()} students
                        </span>
                      </div>
                    )}
                    {totalDuration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(totalDuration)}</span>
                      </div>
                    )}
                    {course.language && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{course.language}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress for enrolled students */}
                  {isUserEnrolled && (
                    <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Your Progress
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progressPercentage)}% Complete
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="discussions">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussions
                </TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* What you'll learn */}
                {course.learning_outcomes &&
                  course.learning_outcomes.length > 0 && (
                    <div className="academic-card p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        What you'll learn
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {course.learning_outcomes.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Course Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="academic-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course Description */}
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    About this course
                  </h3>
                  <div className="max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {showFullDescription ? (
                        course.description
                      ) : (
                        <>
                          {course.description?.slice(0, 300)}
                          {(course.description?.length || 0) > 300 && '...'}
                        </>
                      )}
                    </p>
                    {(course.description?.length || 0) > 300 && (
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {showFullDescription ? 'Show less' : 'Show more'}
                        {showFullDescription ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <div className="academic-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Course Content</h3>
                    <div className="text-sm text-muted-foreground">
                      {lectures.length} lectures •{' '}
                      {formatDuration(totalDuration)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {lectures.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          No lectures available yet.
                        </p>
                      </div>
                    ) : (
                      lectures.map((lecture, index) => (
                        <div
                          key={lecture.id}
                          className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium">
                                {lecture.order_number || index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">
                                  {lecture.title}
                                </h4>
                                {lecture.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {lecture.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {lecture.duration_minutes && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(lecture.duration_minutes)}
                                </span>
                              )}
                              {lecture.is_free || isUserEnrolled ? (
                                <Button size="sm" variant="outline" asChild>
                                  <Link
                                    to="/learn/$courseId/$lectureId"
                                    params={{ courseId, lectureId: lecture.id }}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    {lecture.is_free ? 'Preview' : 'Watch'}
                                  </Link>
                                </Button>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Lock className="h-3 w-3" />
                                  Locked
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="discussions" className="space-y-6">
                <div className="academic-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Course Discussions
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ask questions and discuss course content with other
                        students
                      </p>
                    </div>
                    {isUserEnrolled && (
                      <Button onClick={() => setCreateTopicOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Discussion
                      </Button>
                    )}
                  </div>

                  {!isUserEnrolled ? (
                    <div className="text-center py-12">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">
                        Enroll to join discussions
                      </p>
                      <p className="text-muted-foreground">
                        Purchase or enroll in this course to participate in
                        discussions
                      </p>
                    </div>
                  ) : (
                    <TopicList
                      topics={forumTopics}
                      isLoading={isLoadingTopics}
                      onTopicSelect={setSelectedTopicId}
                      selectedTopicId={selectedTopicId || undefined}
                      emptyMessage="No discussions yet. Be the first to start a discussion!"
                      showSearch={true}
                      showFilters={true}
                      showViewToggle={false}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="instructor">
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    About the Instructor
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-semibold">
                      {course.instructor_name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {course.instructor_name}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Expert Instructor
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        An experienced professional with years of industry
                        expertise, dedicated to helping students achieve their
                        learning goals through practical, hands-on instruction.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="academic-card p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Student Reviews
                  </h3>
                  <div className="space-y-4">
                    {course.rating && course.rating > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="h-5 w-5 fill-current text-yellow-400" />
                              <span className="text-2xl font-bold ml-2">
                                {course.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              ({course.rating_count} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-center py-8">
                          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            Individual reviews will be shown here in a future
                            update.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          Reviews will appear here once students start rating
                          this course.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Preview Card */}
            <div className="academic-card overflow-hidden sticky top-8">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Button size="lg" className="bg-background/90 backdrop-blur-sm">
                  <Play className="h-5 w-5 mr-2" />
                  Course Preview
                </Button>
              </div>

              <div className="p-6">
                <div className="text-3xl font-bold text-primary mb-4">
                  {formatPrice(course.price || 0, course.currency)}
                  {course.price && course.price > 0 && (
                    <span className="text-lg text-muted-foreground line-through ml-2">
                      ${Math.round((course.price || 0) * 1.5)}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {!isUserEnrolled ? (
                    <>
                      {course.price && course.price > 0 ? (
                        <div className="space-y-3">
                          <PaymentModal
                            type="course"
                            courseData={{
                              id: courseId,
                              title: course.title,
                              price: course.price,
                              currency: course.currency || 'USD',
                            }}
                            onSuccess={handlePaymentSuccess}
                            onCancel={() => console.log('Payment cancelled')}
                          >
                            <Button className="w-full h-11" disabled={!user}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              {user
                                ? `Purchase for ${formatPrice(course.price, course.currency)}`
                                : 'Login to Purchase'}
                            </Button>
                          </PaymentModal>

                          {/* Secondary action - could be wishlist or preview */}
                          <Button
                            variant="outline"
                            className="w-full h-11"
                            disabled={!user}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Add to Wishlist
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full h-11"
                          onClick={enrollFree}
                          disabled={!user}
                        >
                          {user ? 'Enroll for Free' : 'Login to Enroll'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Enrolled</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          // Navigate to first lecture or course overview
                          const firstLecture = lectures[0]
                          if (firstLecture) {
                            window.location.href = `/learn/${courseId}/${firstLecture.id}`
                          } else {
                            // Fallback to course overview if no lectures
                            window.location.href = `/courses/${courseId}`
                          }
                        }}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Includes:</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDuration(totalDuration)} on-demand video
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>Downloadable resources</span>
                      </li>
                      {course.certificate_available && (
                        <li className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>Certificate of completion</span>
                        </li>
                      )}
                      {course.lifetime_access && (
                        <li className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Lifetime access</span>
                        </li>
                      )}
                      {course.mobile_access && (
                        <li className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>Mobile access</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="academic-card p-6">
              <h3 className="font-semibold mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Skill Level
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {course.level || 'All Levels'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Students
                  </span>
                  <span className="text-sm font-medium">
                    {course.enrollment_count?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Lectures
                  </span>
                  <span className="text-sm font-medium">{lectures.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-medium">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Topic Dialog */}
      <CreateTopicDialog
        open={createTopicOpen}
        onOpenChange={setCreateTopicOpen}
        onSubmit={handleCreateTopic}
        courseId={courseId}
      />
    </div>
  )
}
