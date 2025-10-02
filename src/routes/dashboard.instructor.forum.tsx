import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useApproveTopic,
  usePendingTopics,
  useRejectTopic,
} from '@/hooks/use-forum'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/dashboard/instructor/forum')({
  component: InstructorForumApproval,
})

function InstructorForumApproval() {
  const { token, user } = useAuth()
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null,
  )

  const {
    data: pendingTopicsData,
    isLoading,
    error,
  } = usePendingTopics(token ?? undefined)
  const approveTopicMutation = useApproveTopic()
  const rejectTopicMutation = useRejectTopic()

  // Filter topics that belong to instructor's courses or are course-related
  const pendingTopics =
    pendingTopicsData?.topics?.filter((topic: any) => {
      // If admin, can see all topics
      if (user?.role === 'admin') {
        return true
      }

      // For instructors, only show course-related topics or their own topics
      return (
        topic.category === 'course' ||
        topic.courseId ||
        topic.created_by?.id === user?.id ||
        topic.author?.id === user?.id
      )
    }) || []

  const handleApprove = async (topicId: string) => {
    if (!token) return
    try {
      await approveTopicMutation.mutateAsync({ topicId, authToken: token })
      setSelectedTopic(null)
      setActionType(null)
    } catch (error) {
      alert('Failed to approve topic')
    }
  }

  const handleReject = async (topicId: string) => {
    if (!token) return
    try {
      await rejectTopicMutation.mutateAsync({ topicId, authToken: token })
      setSelectedTopic(null)
      setActionType(null)
    } catch (error) {
      alert('Failed to reject topic')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">
              Error loading pending topics
            </p>
            <p className="text-muted-foreground">Please try again later</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Course Forum Moderation
        </h1>
        <p className="text-muted-foreground">
          Review and approve pending topics for your courses and course-related
          discussions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Topics</CardTitle>
              <CardDescription>Topics waiting for approval</CardDescription>
            </div>
            <Badge variant="secondary">{pendingTopics.length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingTopics.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">All caught up!</p>
              <p className="text-muted-foreground">
                No pending topics to review
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTopics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium line-clamp-1">
                          {topic.title}
                        </p>
                        {(topic.description || topic.content) && (
                          <p
                            className="text-sm text-muted-foreground line-clamp-2 mt-1"
                            dangerouslySetInnerHTML={{
                              __html: topic.description || topic.content || '',
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{topic.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs">
                          {(topic as any).created_by?.username
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            topic.author?.name?.charAt(0) ||
                            topic.created_by_id
                              ?.substring(0, 2)
                              .toUpperCase() ||
                            'U'}
                        </div>
                        <span className="text-sm">
                          {(topic as any).created_by?.username ||
                            topic.author?.name ||
                            `User ${topic.created_by_id?.substring(0, 8)}...`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(topic.created_at || topic.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // View topic detail
                            window.open(`/forum/topics/${topic.id}`, '_blank')
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-success hover:bg-success/90"
                          onClick={() => {
                            setSelectedTopic(topic)
                            setActionType('approve')
                          }}
                          disabled={
                            approveTopicMutation.isPending ||
                            rejectTopicMutation.isPending
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedTopic(topic)
                            setActionType('reject')
                          }}
                          disabled={
                            approveTopicMutation.isPending ||
                            rejectTopicMutation.isPending
                          }
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!selectedTopic && !!actionType}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTopic(null)
            setActionType(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve Topic?' : 'Reject Topic?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' ? (
                <>
                  Are you sure you want to approve "
                  <strong>{selectedTopic?.title}</strong>"? This topic will be
                  visible to all users.
                </>
              ) : (
                <>
                  Are you sure you want to reject "
                  <strong>{selectedTopic?.title}</strong>"? The author will be
                  notified.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedTopic && actionType === 'approve') {
                  handleApprove(selectedTopic.id)
                } else if (selectedTopic && actionType === 'reject') {
                  handleReject(selectedTopic.id)
                }
              }}
              className={
                actionType === 'reject'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : ''
              }
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
