import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useApprovePost,
  useApproveTopic,
  usePendingTopics,
  useRejectPost,
  useRejectTopic,
} from '@/hooks/use-forum'
import { useAuth } from '@/lib/auth-context'

interface ApprovalDashboardProps {
  className?: string
}

type ContentType = 'topics' | 'posts'
type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export function ApprovalDashboard({ className = '' }: ApprovalDashboardProps) {
  const { user, token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [contentType, setContentType] = useState<ContentType>('topics')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending')
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [viewDialog, setViewDialog] = useState<{
    open: boolean
    item: any
    type: ContentType
  }>({
    open: false,
    item: null,
    type: 'topics',
  })
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean
    item: any
    type: ContentType
  }>({
    open: false,
    item: null,
    type: 'topics',
  })

  // Check if user has approval permissions
  const canApprove = user?.role === 'instructor' || user?.role === 'admin'

  // Fetch pending content
  const {
    data: pendingTopicsData,
    isLoading: isLoadingTopics,
    refetch: refetchTopics,
  } = usePendingTopics(token || '')
  const pendingTopics = pendingTopicsData?.topics || []

  // Mutations for topic approval
  const approveTopicMutation = useApproveTopic()
  const rejectTopicMutation = useRejectTopic()

  // Mutations for post approval
  const approvePostMutation = useApprovePost()
  const rejectPostMutation = useRejectPost()

  const pendingTopicsCount = pendingTopics.length

  const handleBulkApprove = async () => {
    if (!token || selectedItems.length === 0) return

    try {
      if (contentType === 'topics') {
        await Promise.all(
          selectedItems.map((topicId) =>
            approveTopicMutation.mutateAsync({ topicId, authToken: token }),
          ),
        )
        toast.success(`${selectedItems.length} topics approved successfully`)
      }
      setSelectedItems([])
    } catch (error) {
      toast.error('Failed to approve some items')
    }
  }

  const handleApprove = async (item: any, type: ContentType) => {
    if (!token) return

    try {
      if (type === 'topics') {
        await approveTopicMutation.mutateAsync({
          topicId: item.id,
          authToken: token,
        })
        toast.success('Topic approved successfully')
      } else {
        await approvePostMutation.mutateAsync({
          postId: item.id,
          authToken: token,
        })
        toast.success('Post approved successfully')
      }
    } catch (error) {
      toast.error('Failed to approve item')
    }
  }

  const handleReject = async (
    item: any,
    type: ContentType,
    _reason?: string,
  ) => {
    if (!token) return

    try {
      if (type === 'topics') {
        await rejectTopicMutation.mutateAsync({
          topicId: item.id,
          authToken: token,
        })
        toast.success('Topic rejected successfully')
      } else {
        await rejectPostMutation.mutateAsync({
          postId: item.id,
          authToken: token,
        })
        toast.success('Post rejected successfully')
      }
      setRejectDialog({ open: false, item: null, type: 'topics' })
    } catch (error) {
      toast.error('Failed to reject item')
    }
  }

  const handleRefresh = async () => {
    if (contentType === 'topics') {
      await refetchTopics()
    }
  }

  const filteredTopics = pendingTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || topic.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (!canApprove) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground">
          You don't have permission to access the approval dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Content Approval</h2>
          <p className="text-muted-foreground">
            Review and approve pending forum content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {selectedItems.length > 0 && (
            <Button onClick={handleBulkApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Selected ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{pendingTopicsCount}</div>
            <p className="text-xs text-muted-foreground">Pending Topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pending Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{pendingTopicsCount + 0}</div>
            <p className="text-xs text-muted-foreground">Total Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Priority Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pending content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={contentType}
          onValueChange={(value) => setContentType(value as ContentType)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="topics">Topics</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(value: FilterStatus) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Tabs */}
      <Tabs
        value={contentType}
        onValueChange={(value) => setContentType(value as ContentType)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topics" className="flex items-center gap-2">
            Topics
            {pendingTopicsCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingTopicsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            Posts
            <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              0
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-4">
          {isLoadingTopics ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading pending topics...</p>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No pending topics to review at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Topic content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                              {topic.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                              <span>By: {topic.author?.name || 'Unknown'}</span>
                              <span>•</span>
                              <span>Category: {topic.category}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  topic.created_at || topic.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {topic.description && (
                              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {topic.description.replace(/<[^>]*>/g, '')}
                              </p>
                            )}
                            {topic.tags && topic.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {topic.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-muted rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setViewDialog({
                              open: true,
                              item: topic,
                              type: 'topics',
                            })
                          }
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(topic, 'topics')}
                          disabled={approveTopicMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setRejectDialog({
                              open: true,
                              item: topic,
                              type: 'topics',
                            })
                          }
                          disabled={rejectTopicMutation.isPending}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Posts</h3>
            <p className="text-muted-foreground">
              There are no pending posts to review at the moment.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Review {contentType === 'topics' ? 'Topic' : 'Post'}
            </DialogTitle>
            <DialogDescription>
              Review the content before approving or rejecting
            </DialogDescription>
          </DialogHeader>
          {viewDialog.item && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {viewDialog.item.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span>By: {viewDialog.item.author?.name || 'Unknown'}</span>
                  <span>•</span>
                  <span>
                    {new Date(
                      viewDialog.item.created_at || viewDialog.item.createdAt,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    viewDialog.item.description || viewDialog.item.content,
                }}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setViewDialog({ open: false, item: null, type: 'topics' })
              }
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewDialog({ open: false, item: null, type: 'topics' })
                setRejectDialog({
                  open: true,
                  item: viewDialog.item,
                  type: viewDialog.type,
                })
              }}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                handleApprove(viewDialog.item, viewDialog.type)
                setViewDialog({ open: false, item: null, type: 'topics' })
              }}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {contentType === 'topics' ? 'Topic' : 'Post'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this content? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {rejectDialog.item && (
            <div className="space-y-4">
              <p className="text-sm">
                <strong>Title:</strong> {rejectDialog.item.title}
              </p>
              <p className="text-sm">
                <strong>Author:</strong>{' '}
                {rejectDialog.item.author?.name || 'Unknown'}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog({ open: false, item: null, type: 'topics' })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReject(rejectDialog.item, rejectDialog.type)}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
