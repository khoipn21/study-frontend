import { Bot, Brain, History, Sparkles, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { ChatInterface } from '@/components/chat/ChatInterface'
import { ChatHistorySidebar } from '@/components/chat/ChatHistorySidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth-context'
import { aiChatService } from '@/lib/ai-chat'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const [selectedSessionId, setSelectedSessionId] = useState<
    string | undefined
  >()
  const [showHistory, setShowHistory] = useState(false)
  const [rateLimit, setRateLimit] = useState({ remaining: 10, limit: 10 })

  // Fetch rate limit on mount and periodically
  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const data = await aiChatService.getRateLimit()
        setRateLimit({ remaining: data.remaining, limit: data.limit })
      } catch (error) {
        console.error('Failed to fetch rate limit:', error)
      }
    }

    fetchRateLimit()
    const interval = setInterval(fetchRateLimit, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setShowHistory(false) // Close sidebar on mobile
  }

  const handleSessionDeleted = (sessionId: string) => {
    // If the deleted session was the current one, clear selection
    if (sessionId === selectedSessionId) {
      setSelectedSessionId(undefined)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-[280px_2fr_1fr] gap-6 h-full">
        {/* History Sidebar - Desktop */}
        <div className="hidden lg:block h-full">
          <ChatHistorySidebar
            onSelectSession={handleSelectSession}
            currentSessionId={selectedSessionId}
            onSessionDeleted={handleSessionDeleted}
          />
        </div>

        {/* Main Chat Area */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex items-center gap-3">
            {/* Mobile History Button */}
            <Sheet open={showHistory} onOpenChange={setShowHistory}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <History className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <ChatHistorySidebar
                  onSelectSession={handleSelectSession}
                  currentSessionId={selectedSessionId}
                  onSessionDeleted={handleSessionDeleted}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
              <p className="text-muted-foreground">
                Your personal academic assistant powered by Gemini AI
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ChatInterface
              height="h-full"
              sessionId={selectedSessionId}
              onSessionChange={setSelectedSessionId}
            />
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          {/* User Info */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {user?.username || 'Student'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Capabilities
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Step-by-step problem solving</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>LaTeX math notation support</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Code examples and explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Concept breakdowns</span>
              </li>
            </ul>
          </Card>

          {/* Rate Limit Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              Usage Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Limit:</span>
                <span className="font-medium">{rateLimit.limit} prompts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining:</span>
                <span className={`font-medium ${rateLimit.remaining === 0 ? 'text-destructive' : 'text-green-600'}`}>
                  {rateLimit.remaining} prompts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resets:</span>
                <span className="font-medium">Midnight (daily)</span>
              </div>
              {/* Progress Bar */}
              <div className="pt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${(rateLimit.remaining / rateLimit.limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2 text-sm">
              💡 Tips for Best Results
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Be specific with your questions</li>
              <li>• Include relevant context</li>
              <li>• Ask for step-by-step explanations</li>
              <li>• Request examples when needed</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
