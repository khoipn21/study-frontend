import { createFileRoute } from '@tanstack/react-router'
import {
  Archive,
  Bell,
  Filter,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Users,
} from 'lucide-react'
import InstructorDashboardLayout from '@/components/instructor/InstructorDashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CommunicationCenter from '@/components/instructor/CommunicationCenter'
import NotificationCenter from '@/components/instructor/NotificationCenter'

export const Route = createFileRoute('/dashboard/instructor/messages/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Mock data for message stats
  const messageStats = {
    unreadMessages: 12,
    openConversations: 8,
    totalConversations: 45,
    unreadNotifications: 5,
  }

  return (
    <InstructorDashboardLayout
      title="Communication Center"
      description="Manage student messages, notifications, and announcements"
      headerContent={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Communication Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unread Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messageStats.unreadMessages}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires your attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Open Conversations
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messageStats.openConversations}
              </div>
              <p className="text-xs text-muted-foreground">
                Active discussions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messageStats.totalConversations}
              </div>
              <p className="text-xs text-muted-foreground">
                All time conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messageStats.unreadNotifications}
              </div>
              <p className="text-xs text-muted-foreground">
                Unread notifications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Communication Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {messageStats.unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {messageStats.unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {messageStats.unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {messageStats.unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <CommunicationCenter />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </InstructorDashboardLayout>
  )
}
