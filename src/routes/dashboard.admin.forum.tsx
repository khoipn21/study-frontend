import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  MessageSquare,
  Shield,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useApproveTopic,
  usePendingTopics,
  useRejectTopic,
  useTopics,
} from '@/hooks/use-forum'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/dashboard/admin/forum')({
  component: AdminForumApproval,
})

function AdminForumApproval() {
  const { token } = useAuth()
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null,
  )
  const [filterType, setFilterType] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('pending')

  // Fetch pending topics
  const {
    data: pendingTopicsData,
    isLoading: pendingLoading,
    error: pendingError,
  } = usePendingTopics(token ?? undefined)

  // Fetch all topics with filter
  const {
    data: allTopicsData,
    isLoading: allLoading,
    error: allError,
  } = useTopics({
    status: filterType === 'all' ? undefined : filterType,
  })

  const approveTopicMutation = useApproveTopic()
  const rejectTopicMutation = useRejectTopic()

  const pendingTopics = pendingTopicsData?.topics || []
  const allTopics = allTopicsData?.topics || []

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const TopicsTable = ({
    topics,
    showActions = false,
  }: {
    topics: Array<any>
    showActions?: boolean
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {topics.map((topic) => (
          <TableRow key={topic.id}>
            <TableCell>
              <div className="max-w-md">
                <p className="font-medium line-clamp-1">{topic.title}</p>
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
                  {topic.created_by?.username?.charAt(0)?.toUpperCase() ||
                    topic.author?.name?.charAt(0) ||
                    topic.created_by_id?.substring(0, 2).toUpperCase() ||
                    'U'}
                </div>
                <span className="text-sm">
                  {topic.created_by?.username ||
                    topic.author?.name ||
                    `User ${topic.created_by_id?.substring(0, 8)}...`}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(topic.created_at || topic.createdAt)}
            </TableCell>
            <TableCell>{getStatusBadge(topic.status)}</TableCell>
            {showActions && (
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      window.open(`/forum/topics/${topic.id}`, '_blank')
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {topic.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
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
                    </>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (pendingLoading || allLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (pendingError || allError) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Error loading topics</p>
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
          <Shield className="h-8 w-8" />
          Forum Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage all forum topics across the platform
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approval ({pendingTopics.length})
          </TabsTrigger>
          <TabsTrigger value="all">All Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Topics</CardTitle>
                  <CardDescription>
                    Topics waiting for admin approval
                  </CardDescription>
                </div>
                <Badge variant="destructive">
                  {pendingTopics.length} pending
                </Badge>
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
                <TopicsTable topics={pendingTopics} showActions={true} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Forum Topics</CardTitle>
                  <CardDescription>
                    Manage all topics across the platform
                  </CardDescription>
                </div>
                <Select
                  value={filterType}
                  onValueChange={(value: any) => setFilterType(value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {allTopics.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No topics found</p>
                  <p className="text-muted-foreground">
                    {filterType !== 'all'
                      ? `No ${filterType} topics`
                      : 'No topics have been created yet'}
                  </p>
                </div>
              ) : (
                <TopicsTable topics={allTopics} showActions={true} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
