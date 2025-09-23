import { Link } from '@tanstack/react-router'
import {
  Award,
  BookOpen,
  Bot,
  CheckCircle,
  Clock,
  MessageSquare,
  Play,
  TrendingUp,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'
import type { RecentActivity } from '@/lib/dashboard'

interface ActivityFeedProps {
  activities: Array<RecentActivity>
  className?: string
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_started':
        return BookOpen
      case 'lecture_completed':
        return CheckCircle
      case 'certificate_earned':
        return Award
      case 'forum_post':
        return MessageSquare
      case 'chat_session':
        return Bot
      case 'achievement_unlocked':
        return Award
      default:
        return Play
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course_started':
        return 'text-blue-600 bg-blue-50'
      case 'lecture_completed':
        return 'text-green-600 bg-green-50'
      case 'certificate_earned':
        return 'text-yellow-600 bg-yellow-50'
      case 'forum_post':
        return 'text-purple-600 bg-purple-50'
      case 'chat_session':
        return 'text-pink-600 bg-pink-50'
      case 'achievement_unlocked':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatActivityTitle = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'course_started':
        return `Started: ${activity.title.replace('Started: ', '')}`
      case 'lecture_completed':
        return `Completed: ${activity.title.replace('Completed: ', '')}`
      case 'certificate_earned':
        return `Certificate Earned: ${activity.title.replace('Certificate Earned: ', '')}`
      case 'forum_post':
        return activity.title
      case 'chat_session':
        return `AI Chat: ${activity.title.replace('AI Chat: ', '')}`
      case 'achievement_unlocked':
        return activity.title
      default:
        return activity.title
    }
  }

  if (activities.length === 0) {
    return (
      <div className="academic-card p-8 text-center">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
        <p className="text-muted-foreground">
          Start learning to see your progress here!
        </p>
      </div>
    )
  }

  return (
    <div className="academic-card">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>

      <div className="divide-y">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClasses = getActivityColor(activity.type)

          return (
            <div
              key={activity.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex gap-3">
                {/* Activity Icon */}
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm">
                        {formatActivityTitle(activity)}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activity.description}
                      </p>

                      {/* Activity Metadata */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(activity.timestamp))}
                          </span>
                        </div>

                        {activity.metadata?.duration && (
                          <div className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            <span>{activity.metadata.duration}min</span>
                          </div>
                        )}

                        {activity.metadata?.progress && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{activity.metadata.progress}% complete</span>
                          </div>
                        )}

                        {activity.metadata?.points && (
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            <span>+{activity.metadata.points} points</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Link */}
                    {(activity.courseId || activity.lectureId) && (
                      <div className="ml-3">
                        {activity.lectureId ? (
                          <Link
                            to="/learn/$courseId/$lectureId"
                            params={{
                              courseId: activity.courseId!,
                              lectureId: activity.lectureId,
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            View
                          </Link>
                        ) : activity.courseId ? (
                          <Link
                            to="/courses/$courseId"
                            params={{ courseId: activity.courseId }}
                            className="text-xs text-primary hover:underline"
                          >
                            View Course
                          </Link>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* View All Link */}
      {activities.length > 5 && (
        <div className="p-4 border-t text-center">
          <button className="text-sm text-primary hover:underline font-medium">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}
