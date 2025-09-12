import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  TrendingUp,
  BookOpen,
  Target,
  Award,
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { LearningProgress } from '@/components/dashboard/LearningProgress'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { StudyGoals } from '@/components/dashboard/StudyGoals'
import {
  dashboardService,
  type DashboardData,
  type StudyGoal,
} from '@/lib/dashboard'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/me/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [weeklyStats, setWeeklyStats] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadDashboardData()
      loadWeeklyStats()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const data = await dashboardService.getDashboardData(user.id)
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadWeeklyStats = async () => {
    if (!user) return
    
    try {
      const stats = await dashboardService.getWeeklyStats(user.id)
      setWeeklyStats(stats)
    } catch (error) {
      console.error('Error loading weekly stats:', error)
    }
  }

  const handleCreateGoal = async (goalData: Omit<StudyGoal, 'id' | 'current' | 'isCompleted' | 'createdAt'>) => {
    try {
      const newGoal = await dashboardService.createStudyGoal(goalData)
      setDashboardData(prev => {
        if (!prev) return null
        return {
          ...prev,
          studyGoals: [newGoal, ...prev.studyGoals]
        }
      })
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const handleUpdateGoal = async (goalId: string, progress: number) => {
    try {
      await dashboardService.updateStudyGoal(goalId, progress)
      setDashboardData(prev => {
        if (!prev) return null
        return {
          ...prev,
          studyGoals: prev.studyGoals.map(goal =>
            goal.id === goalId
              ? { ...goal, current: progress, isCompleted: progress >= goal.target }
              : goal
          )
        }
      })
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="academic-card p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Unable to load dashboard</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your dashboard data.
            </p>
            <Button onClick={loadDashboardData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getWelcomeMessage()}, {user?.username}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your learning progress and achievements
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {dashboardData.stats.streakDays > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {dashboardData.stats.streakDays} day streak!
                  </span>
                </div>
              )}
              
              <Button variant="outline" onClick={loadDashboardData} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={dashboardData.stats} className="mb-8" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Progress */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Continue Learning</h2>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <LearningProgress courses={dashboardData.recentProgress} />
            </section>

            {/* Learning Paths */}
            {dashboardData.learningPaths.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Learning Paths</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {dashboardData.learningPaths.map((path) => (
                    <div key={path.id} className="academic-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {path.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {path.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{path.courses.length} courses</span>
                            <span>{path.estimatedTime}h estimated</span>
                            <span className="capitalize">{path.difficulty}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {path.progress}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Complete
                          </div>
                        </div>
                      </div>

                      {/* Course Progress */}
                      <div className="flex items-center gap-1 mb-3">
                        {path.courses.slice(0, 6).map((course, index) => (
                          <div
                            key={course.id}
                            className={cn(
                              'flex-1 h-2 rounded',
                              course.isCompleted
                                ? 'bg-green-500'
                                : course.isUnlocked
                                  ? 'bg-yellow-300'
                                  : 'bg-muted'
                            )}
                          />
                        ))}
                        {path.courses.length > 6 && (
                          <span className="text-xs text-muted-foreground ml-2">
                            +{path.courses.length - 6}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {path.courses.filter(c => c.isCompleted).length} of {path.courses.length} completed
                        </span>
                        <Button size="sm" variant="outline">
                          Continue Path
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {dashboardData.achievements.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Achievements</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.achievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={cn(
                        'academic-card p-4',
                        achievement.unlockedAt ? 'border-success bg-success/5' : 'opacity-75'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          achievement.unlockedAt 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                        )}>
                          <Award className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-primary">
                              +{achievement.points} points
                            </span>
                            {achievement.progress && (
                              <span className="text-xs text-muted-foreground">
                                {achievement.progress.current}/{achievement.progress.target} {achievement.progress.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Study Goals */}
            <StudyGoals
              goals={dashboardData.studyGoals}
              onCreateGoal={handleCreateGoal}
              onUpdateGoal={handleUpdateGoal}
            />

            {/* Recent Activity */}
            <ActivityFeed activities={dashboardData.recentActivity.slice(0, 5)} />

            {/* Recommendations */}
            {dashboardData.recommendations.length > 0 && (
              <div className="academic-card">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Recommended for You</h3>
                  </div>
                </div>
                
                <div className="divide-y">
                  {dashboardData.recommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-4">
                      <div className="flex gap-3">
                        {rec.thumbnail && (
                          <img
                            src={rec.thumbnail}
                            alt={rec.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {rec.reason}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              <span>{rec.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{rec.studentsCount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t text-center">
                  <Button size="sm" variant="outline" className="gap-1">
                    View All Recommendations
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upcoming Deadlines */}
            {dashboardData.upcomingDeadlines.length > 0 && (
              <div className="academic-card">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <h3 className="font-semibold">Upcoming Deadlines</h3>
                  </div>
                </div>
                
                <div className="divide-y">
                  {dashboardData.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm mb-1">
                            {deadline.title}
                          </h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {deadline.type.replace('_', ' ')}
                          </p>
                        </div>
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded',
                          deadline.priority === 'high' && 'bg-destructive/10 text-destructive',
                          deadline.priority === 'medium' && 'bg-warning/10 text-warning',
                          deadline.priority === 'low' && 'bg-muted text-muted-foreground'
                        )}>
                          {new Date(deadline.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}