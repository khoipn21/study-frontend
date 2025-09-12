import React from 'react'
import {
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Award,
  MessageSquare,
  Bot,
  TrendingUp,
} from 'lucide-react'
import { DashboardStats } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  stats: DashboardStats
  className?: string
}

export function StatsCards({ stats, className }: StatsCardsProps) {
  const formatWatchTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const statsData = [
    {
      title: 'Courses Enrolled',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'blue',
      trend: null,
    },
    {
      title: 'Completed Courses',
      value: stats.completedCourses,
      icon: CheckCircle,
      color: 'green',
      trend: stats.completedCourses > 0 ? '+1 this month' : null,
    },
    {
      title: 'Learning Time',
      value: formatWatchTime(stats.totalWatchTime),
      icon: Clock,
      color: 'purple',
      trend: '+2.5h this week',
    },
    {
      title: 'Study Streak',
      value: `${stats.streakDays} days`,
      icon: Flame,
      color: 'orange',
      trend: stats.streakDays > 7 ? 'Personal best!' : null,
    },
    {
      title: 'Certificates',
      value: stats.certificatesEarned,
      icon: Award,
      color: 'yellow',
      trend: null,
    },
    {
      title: 'Forum Posts',
      value: stats.forumPosts,
      icon: MessageSquare,
      color: 'indigo',
      trend: stats.forumPosts > 10 ? 'Active contributor' : null,
    },
    {
      title: 'AI Chats',
      value: stats.chatSessions,
      icon: Bot,
      color: 'pink',
      trend: '+5 this week',
    },
    {
      title: 'In Progress',
      value: stats.inProgressCourses,
      icon: TrendingUp,
      color: 'teal',
      trend: 'Keep going!',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 border-blue-100',
      green: 'text-green-600 bg-green-50 border-green-100',
      purple: 'text-purple-600 bg-purple-50 border-purple-100',
      orange: 'text-orange-600 bg-orange-50 border-orange-100',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-100',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      pink: 'text-pink-600 bg-pink-50 border-pink-100',
      teal: 'text-teal-600 bg-teal-50 border-teal-100',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        const colorClasses = getColorClasses(stat.color)
        
        return (
          <div
            key={index}
            className="academic-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                'p-3 rounded-lg border',
                colorClasses
              )}>
                <Icon className="h-6 w-6" />
              </div>
              
              {stat.trend && (
                <div className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
                  {stat.trend}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.title}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}