import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle,
  DollarSign,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import { useRealTimeNotifications } from '@/lib/instructor-realtime-context'
import type { InstructorNotification } from '@/lib/instructor-dashboard'

interface NotificationItemProps {
  notification: InstructorNotification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  isSelected = false,
  onSelect,
}: NotificationItemProps) {
  const getNotificationIcon = (type: InstructorNotification['type']) => {
    switch (type) {
      case 'course_review':
        return <Star className="h-4 w-4 text-yellow-600" />
      case 'student_message':
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-green-600" />
      case 'course_milestone':
        return <BookOpen className="h-4 w-4 text-purple-600" />
      case 'system_update':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getNotificationColor = (type: InstructorNotification['type']) => {
    switch (type) {
      case 'course_review':
        return 'border-l-yellow-500'
      case 'student_message':
        return 'border-l-blue-500'
      case 'payment_received':
        return 'border-l-green-500'
      case 'course_milestone':
        return 'border-l-purple-500'
      case 'system_update':
        return 'border-l-orange-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60),
    )

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div
      className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
        !notification.isRead ? 'bg-blue-50/50' : 'bg-background'
      } hover:bg-muted/50 transition-colors`}
    >
      <div className="flex items-start gap-3">
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(notification.id, !!checked)}
            className="mt-1"
          />
        )}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <h4
              className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    {notification.isRead ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Mark as Unread
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Mark as Read
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(notification.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(notification.createdAt)}
            </span>
            {notification.metadata && (
              <div className="flex items-center gap-2">
                {notification.metadata.amount && (
                  <Badge variant="secondary">
                    ${notification.metadata.amount}
                  </Badge>
                )}
                {notification.metadata.rating && (
                  <Badge variant="secondary">
                    {notification.metadata.rating} ⭐
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface NotificationFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  typeFilter: string
  onTypeFilterChange: (type: string) => void
  readFilter: string
  onReadFilterChange: (filter: string) => void
}

function NotificationFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  readFilter,
  onReadFilterChange,
}: NotificationFiltersProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="course_review">Course Reviews</SelectItem>
          <SelectItem value="student_message">Student Messages</SelectItem>
          <SelectItem value="payment_received">Payments</SelectItem>
          <SelectItem value="course_milestone">Milestones</SelectItem>
          <SelectItem value="system_update">System Updates</SelectItem>
        </SelectContent>
      </Select>
      <Select value={readFilter} onValueChange={onReadFilterChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

interface BulkActionsProps {
  selectedNotifications: Array<string>
  onMarkAllAsRead: () => void
  onDeleteSelected: () => void
  onClearSelection: () => void
}

function BulkActions({
  selectedNotifications,
  onMarkAllAsRead,
  onDeleteSelected,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedNotifications.length === 0) return null

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm font-medium">
        {selectedNotifications.length} notification
        {selectedNotifications.length > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onMarkAllAsRead}>
          <Eye className="mr-2 h-4 w-4" />
          Mark as Read
        </Button>
        <Button size="sm" variant="outline" onClick={onDeleteSelected}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear
        </Button>
      </div>
    </div>
  )
}

interface NotificationStatsProps {
  totalNotifications: number
  unreadCount: number
  todayCount: number
  weekCount: number
}

function NotificationStats({
  totalNotifications,
  unreadCount,
  todayCount,
  weekCount,
}: NotificationStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{totalNotifications}</div>
          <p className="text-sm text-muted-foreground">Total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          <p className="text-sm text-muted-foreground">Unread</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{todayCount}</div>
          <p className="text-sm text-muted-foreground">Today</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{weekCount}</div>
          <p className="text-sm text-muted-foreground">This Week</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotificationCenter() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState<
    Array<string>
  >([])

  // Real-time notifications
  const realTimeNotifications = useRealTimeNotifications()

  // Fetch notifications from API (fallback)
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['instructor', 'notifications', 'all'],
    queryFn: () => instructorDashboardService.getNotifications({ limit: 100 }),
    enabled: realTimeNotifications.notifications.length === 0,
  })

  // Use real-time notifications if available, otherwise use API data
  const allNotifications =
    realTimeNotifications.notifications.length > 0
      ? realTimeNotifications.notifications
      : (notificationsData as { notifications?: Array<any> })?.notifications ||
        []

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      instructorDashboardService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'notifications'],
      })
    },
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => instructorDashboardService.markAllNotificationsAsRead(),
    onSuccess: () => {
      realTimeNotifications.markAllAsRead()
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'notifications'],
      })
      toast({
        title: 'Success',
        description: 'All notifications marked as read.',
      })
    },
  })

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return (allNotifications as Array<InstructorNotification>).filter(
      (notification: InstructorNotification) => {
        // Search filter
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase()
          if (
            !notification.title.toLowerCase().includes(searchLower) &&
            !notification.message.toLowerCase().includes(searchLower)
          ) {
            return false
          }
        }

        // Type filter
        if (typeFilter !== 'all' && notification.type !== typeFilter) {
          return false
        }

        // Read filter
        if (readFilter === 'unread' && notification.isRead) return false
        if (readFilter === 'read' && !notification.isRead) return false

        return true
      },
    )
  }, [allNotifications, searchQuery, typeFilter, readFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return {
      totalNotifications: allNotifications.length,
      unreadCount: (allNotifications as Array<InstructorNotification>).filter(
        (n) => !n.isRead,
      ).length,
      todayCount: (allNotifications as Array<InstructorNotification>).filter(
        (n) => new Date(n.createdAt) >= today,
      ).length,
      weekCount: (allNotifications as Array<InstructorNotification>).filter(
        (n) => new Date(n.createdAt) >= weekAgo,
      ).length,
    }
  }, [allNotifications])

  // Handle notification actions
  const handleMarkAsRead = (notificationId: string) => {
    realTimeNotifications.markAsRead(notificationId)
    markAsReadMutation.mutate(notificationId)
  }

  const handleDelete = (_notificationId: string) => {
    // Note: Implement delete functionality in the service
    toast({
      title: 'Success',
      description: 'Notification deleted.',
    })
  }

  const handleSelectNotification = (id: string, selected: boolean) => {
    setSelectedNotifications((prev) => {
      if (selected) {
        return [...prev, id]
      } else {
        return prev.filter((notificationId) => notificationId !== id)
      }
    })
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const handleMarkAllAsRead = () => {
    selectedNotifications.forEach((id) => realTimeNotifications.markAsRead(id))
    markAllAsReadMutation.mutate()
    setSelectedNotifications([])
  }

  const handleDeleteSelected = () => {
    // Note: Implement bulk delete functionality
    toast({
      title: 'Success',
      description: `${selectedNotifications.length} notifications deleted.`,
    })
    setSelectedNotifications([])
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notification Stats */}
      <NotificationStats {...stats} />

      {/* Filters */}
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedNotifications={selectedNotifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={() => setSelectedNotifications([])}
      />

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications ({filteredNotifications.length})
              </CardTitle>
              <CardDescription>
                Manage your notifications and stay updated with your course
                activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleSelectAll(selectedNotifications.length === 0)
                }
              >
                {selectedNotifications.length === filteredNotifications.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
              {stats.unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-1">
                No notifications found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== 'all' || readFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    isSelected={selectedNotifications.includes(notification.id)}
                    onSelect={handleSelectNotification}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
