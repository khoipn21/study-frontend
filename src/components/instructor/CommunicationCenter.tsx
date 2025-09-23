import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Archive,
  CheckCircle,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Star,
  Trash2,
  Users,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import type {
  InstructorMessage,
  MessageThread,
} from '@/lib/instructor-dashboard'

interface ThreadListProps {
  threads: Array<MessageThread>
  selectedThreadId: string | null
  onSelectThread: (threadId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ThreadListProps) {
  const formatLastMessage = (thread: MessageThread) => {
    const { lastMessage } = thread
    const timeDiff =
      new Date().getTime() - new Date(lastMessage.sentAt).getTime()
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    let timeStr = ''
    if (days > 0) {
      timeStr = `${days}d`
    } else if (hours > 0) {
      timeStr = `${hours}h`
    } else {
      timeStr = 'now'
    }

    return {
      ...lastMessage,
      timeStr,
    }
  }

  const getPriorityColor = (priority: MessageThread['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getStatusBadge = (status: MessageThread['status']) => {
    const variants = {
      open: { variant: 'default' as const, label: 'Open' },
      resolved: { variant: 'secondary' as const, label: 'Resolved' },
      closed: { variant: 'outline' as const, label: 'Closed' },
    }
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredThreads = threads.filter((thread) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !thread.subject.toLowerCase().includes(query) &&
        !thread.lastMessage.content.toLowerCase().includes(query) &&
        !thread.participants.some((p) => p.name.toLowerCase().includes(query))
      ) {
        return false
      }
    }

    if (statusFilter !== 'all' && thread.status !== statusFilter) {
      return false
    }

    return true
  })

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Messages</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Start a new conversation with students or staff
                </DialogDescription>
              </DialogHeader>
              {/* New message form would go here */}
              <DialogFooter>
                <Button>Send Message</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conversations</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="divide-y">
            {filteredThreads.map((thread) => {
              const lastMsg = formatLastMessage(thread)
              const isSelected = thread.id === selectedThreadId

              return (
                <div
                  key={thread.id}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-muted/50 transition-colors ${getPriorityColor(
                    thread.priority,
                  )} ${isSelected ? 'bg-muted' : ''}`}
                  onClick={() => onSelectThread(thread.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {thread.subject}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{thread.participants.length} participants</span>
                          {thread.courseTitle && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <span className="truncate">
                                {thread.courseTitle}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {thread.unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="px-2 py-1 text-xs"
                          >
                            {thread.unreadCount}
                          </Badge>
                        )}
                        {getStatusBadge(thread.status)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        <span className="font-medium">
                          {lastMsg.senderName}:
                        </span>{' '}
                        {lastMsg.content}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {lastMsg.timeStr}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface MessageBubbleProps {
  message: InstructorMessage
  isOwn: boolean
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex items-start gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}
      >
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.senderAvatar} alt={message.senderName} />
            <AvatarFallback>
              {message.senderName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
        >
          {!isOwn && (
            <span className="text-sm font-medium text-muted-foreground">
              {message.senderName}
            </span>
          )}
          <div
            className={`rounded-lg px-3 py-2 ${
              isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 rounded bg-background/20"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="text-xs">{attachment.filename}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.sentAt)}
            {message.isRead && isOwn && (
              <CheckCircle className="inline h-3 w-3 ml-1 text-green-600" />
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

interface MessageComposeProps {
  onSendMessage: (content: string, attachments?: Array<File>) => void
  disabled?: boolean
}

function MessageCompose({ onSendMessage, disabled }: MessageComposeProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<Array<File>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), attachments)
      setMessage('')
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t p-4 space-y-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Paperclip className="h-3 w-3" />
              {file.name}
              <button
                onClick={() => removeAttachment(index)}
                className="ml-1 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

interface ConversationViewProps {
  thread: MessageThread | null
  messages: Array<InstructorMessage>
  onSendMessage: (content: string, attachments?: Array<File>) => void
  onUpdateThread: (threadId: string, updates: Partial<MessageThread>) => void
}

function ConversationView({
  thread,
  messages,
  onSendMessage,
  onUpdateThread,
}: ConversationViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  if (!thread) {
    return (
      <Card className="h-full">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No conversation selected
            </h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{thread.subject}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{thread.participants.length} participants</span>
              {thread.courseTitle && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{thread.courseTitle}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={thread.status}
              onValueChange={(status) =>
                onUpdateThread(thread.id, { status: status as any })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Star Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No messages in this conversation yet.</p>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderName === 'Dr. Sarah Wilson'} // Note: This should be dynamic
                />
              ))}
            </div>
          )}
        </ScrollArea>
        <MessageCompose
          onSendMessage={onSendMessage}
          disabled={thread.status === 'closed'}
        />
      </CardContent>
    </Card>
  )
}

export default function CommunicationCenter() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Local state
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch message threads
  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ['instructor', 'messages', 'threads', { status: statusFilter }],
    queryFn: () =>
      instructorDashboardService.getMessageThreads({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50,
      }),
  })

  // Fetch messages for selected thread
  const { data: messagesData } = useQuery({
    queryKey: ['instructor', 'messages', selectedThreadId],
    queryFn: async () => {
      if (!selectedThreadId) return { messages: [], total: 0 }
      return instructorDashboardService.getMessages(selectedThreadId)
    },
    enabled: !!selectedThreadId,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({
      threadId,
      content,
      attachments,
    }: {
      threadId: string
      content: string
      attachments?: Array<File>
    }) =>
      instructorDashboardService.sendMessage(threadId, content, attachments),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'messages', selectedThreadId],
      })
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'messages', 'threads'],
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    },
  })

  // Update thread mutation
  const updateThreadMutation = useMutation({
    mutationFn: ({
      updates: _updates,
    }: {
      threadId: string
      updates: Partial<MessageThread>
    }) => {
      // Note: Implement update thread functionality in the service
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'messages', 'threads'],
      })
      toast({
        title: 'Success',
        description: 'Conversation updated.',
      })
    },
  })

  const threads = threadsData?.threads || []
  const messages = messagesData?.messages || []
  const selectedThread = threads.find((t) => t.id === selectedThreadId) || null

  const handleSendMessage = (content: string, attachments?: Array<File>) => {
    if (!selectedThreadId) return

    sendMessageMutation.mutate({
      threadId: selectedThreadId,
      content,
      attachments,
    })
  }

  const handleUpdateThread = (
    threadId: string,
    updates: Partial<MessageThread>,
  ) => {
    updateThreadMutation.mutate({ threadId, updates })
  }

  if (threadsLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 h-[600px]">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 h-full flex items-center justify-center">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-[700px]">
      <ThreadList
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={setSelectedThreadId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <ConversationView
        thread={selectedThread}
        messages={messages}
        onSendMessage={handleSendMessage}
        onUpdateThread={handleUpdateThread}
      />
    </div>
  )
}
