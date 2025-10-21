import { History, MessageSquare, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { aiChatService } from '@/lib/ai-chat'
import { cn } from '@/lib/utils'

import type { ChatSessionInfo } from '@/lib/ai-chat'

interface ChatHistorySidebarProps {
  onSelectSession: (sessionId: string) => void
  currentSessionId?: string
  onSessionDeleted?: (sessionId: string) => void
}

export function ChatHistorySidebar({
  onSelectSession,
  currentSessionId,
  onSessionDeleted,
}: ChatHistorySidebarProps) {
  const [sessions, setSessions] = useState<Array<ChatSessionInfo>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const history = await aiChatService.getChatHistory()
      setSessions(history)
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await aiChatService.deleteSessionHistory(sessionId)
      // Remove from local state
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))
      setDeleteSessionId(null)
      
      // Notify parent if this was the current session
      if (sessionId === currentSessionId) {
        onSessionDeleted?.(sessionId)
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      // Re-load history to ensure consistency
      loadHistory()
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Chat History</h2>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading history...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No chat history yet</p>
            <p className="text-xs mt-1">Start a conversation!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={cn(
                  'group relative p-3 rounded-lg cursor-pointer transition-colors',
                  'hover:bg-accent',
                  currentSessionId === session.session_id && 'bg-accent',
                )}
                onClick={() => onSelectSession(session.session_id)}
              >
                {/* Session Content */}
                <div className="pr-8">
                  <h3 className="font-medium text-sm line-clamp-1 mb-1">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{session.message_count} messages</span>
                    <span>•</span>
                    <span>{formatDate(session.updated_at)}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteSessionId(session.session_id)
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteSessionId !== null}
        onOpenChange={(open) => !open && setDeleteSessionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat session and all its
              messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteSessionId && handleDeleteSession(deleteSessionId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
