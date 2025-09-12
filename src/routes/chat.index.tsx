import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  MessageSquare,
  Bot,
  Trash2,
  Edit3,
  MoreVertical,
  BookOpen,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChatInterface } from '@/components/chat/ChatInterface'
import {
  aiChatService,
  type ChatSession,
  type ChatContext,
} from '@/lib/ai-chat'
import { formatDistanceToNow, cn } from '@/lib/utils'

export const Route = createFileRoute('/chat/')({
  component: ChatPage,
})

function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const sessionsData = await aiChatService.getSessions()
      setSessions(sessionsData)
      
      if (sessionsData.length > 0 && !currentSessionId) {
        setCurrentSessionId(sessionsData[0].id)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewSession = async () => {
    try {
      const newSession = await aiChatService.createSession()
      setSessions(prev => [newSession, ...prev])
      setCurrentSessionId(newSession.id)
    } catch (error) {
      console.error('Error creating new session:', error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await aiChatService.deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId)
        setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null)
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const handleUpdateSessionTitle = async (sessionId: string, title: string) => {
    try {
      await aiChatService.updateSessionTitle(sessionId, title)
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title } : s
      ))
    } catch (error) {
      console.error('Error updating session title:', error)
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentSession = sessions.find(s => s.id === currentSessionId)

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        'w-80 border-r bg-card flex flex-col transition-all duration-300',
        !isSidebarOpen && 'w-0 overflow-hidden'
      )}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">AI Tutor</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleCreateNewSession}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredSessions.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    'group flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors',
                    currentSessionId === session.id && 'bg-muted'
                  )}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div className="flex-shrink-0">
                    {session.courseId ? (
                      <BookOpen className="h-4 w-4 text-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {session.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(session.updatedAt))}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          const newTitle = prompt('Enter new title:', session.title)
                          if (newTitle && newTitle !== session.title) {
                            handleUpdateSessionTitle(session.id, newTitle)
                          }
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Are you sure you want to delete this conversation?')) {
                            handleDeleteSession(session.id)
                          }
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No conversations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? 'No conversations match your search'
                  : 'Start a new conversation with your AI tutor'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateNewSession} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>AI responses are generated and may contain errors.</p>
            <p>Always verify important information.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold truncate">
            {currentSession?.title || 'Select a conversation'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNewSession}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {currentSessionId && currentSession ? (
          <div className="flex-1">
            <ChatInterface
              context={{
                courseId: currentSession.courseId,
                lectureId: currentSession.lectureId,
              }}
              height="h-full"
              className="h-full border-0 rounded-none"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center space-y-4 max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Welcome to AI Tutor</h2>
              <p className="text-muted-foreground">
                Your personal AI assistant for learning. Ask questions, get explanations, 
                and receive help with your studies anytime.
              </p>
              <Button onClick={handleCreateNewSession} className="gap-2">
                <Plus className="h-4 w-4" />
                Start Your First Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
