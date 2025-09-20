import React, { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  Upload,
  User,
  Users,
  Video,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  InstructorRealTimeProvider,
  useRealTimeNotifications,
} from '@/lib/instructor-realtime-context'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { instructorDashboardService } from '@/lib/instructor-dashboard'

// Navigation items for the instructor dashboard
const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard/instructor',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Courses',
    icon: BookOpen,
    items: [
      {
        title: 'All Courses',
        url: '/dashboard/instructor/courses',
      },
      {
        title: 'Create Course',
        url: '/dashboard/instructor/courses/new',
      },
      {
        title: 'Bulk Operations',
        url: '/dashboard/instructor/courses/bulk',
      },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      {
        title: 'Revenue',
        url: '/dashboard/instructor/analytics/revenue',
      },
      {
        title: 'Student Engagement',
        url: '/dashboard/instructor/analytics/engagement',
      },
      {
        title: 'Course Performance',
        url: '/dashboard/instructor/analytics/courses',
      },
    ],
  },
  {
    title: 'Students',
    url: '/dashboard/instructor/students',
    icon: Users,
  },
  {
    title: 'Communications',
    icon: MessageSquare,
    items: [
      {
        title: 'Messages',
        url: '/dashboard/instructor/messages',
      },
      {
        title: 'Announcements',
        url: '/dashboard/instructor/announcements',
      },
      {
        title: 'Q&A',
        url: '/dashboard/instructor/qa',
      },
    ],
  },
  {
    title: 'Content',
    icon: Video,
    items: [
      {
        title: 'Video Library',
        url: '/dashboard/instructor/videos',
      },
      {
        title: 'Upload Video',
        url: '/dashboard/instructor/upload',
      },
      {
        title: 'Resources',
        url: '/dashboard/instructor/resources',
      },
    ],
  },
]

const toolsItems = [
  {
    title: 'Reports',
    url: '/dashboard/instructor/reports',
    icon: FileText,
  },
  {
    title: 'Calendar',
    url: '/dashboard/instructor/calendar',
    icon: Calendar,
  },
  {
    title: 'Help Center',
    url: '/dashboard/instructor/help',
    icon: HelpCircle,
  },
  {
    title: 'Settings',
    url: '/dashboard/instructor/settings',
    icon: Settings,
  },
]

interface InstructorSidebarProps {
  children?: React.ReactNode
}

function InstructorSidebar({ children }: InstructorSidebarProps) {
  const location = useLocation()

  // Fetch notifications for unread count
  const { data: notificationsData } = useQuery({
    queryKey: ['instructor', 'notifications'],
    queryFn: () => instructorDashboardService.getNotifications({ limit: 1 }),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const unreadNotifications = notificationsData?.unreadCount || 0

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Instructor Dashboard</span>
            <span className="truncate text-xs text-muted-foreground">
              Manage your courses
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                if (item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <div className="flex items-center">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto size-4" />
                        </div>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={subItem.url}
                                className="w-full"
                                activeProps={{
                                  className:
                                    'bg-primary text-primary-foreground',
                                }}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2"
                        activeProps={{
                          className: 'bg-primary text-primary-foreground',
                        }}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.title === 'Messages' &&
                          unreadNotifications > 0 && (
                            <Badge
                              variant="destructive"
                              className="ml-auto size-5 flex items-center justify-center text-xs"
                            >
                              {unreadNotifications > 99
                                ? '99+'
                                : unreadNotifications}
                            </Badge>
                          )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="flex items-center gap-2"
                      activeProps={{
                        className: 'bg-primary text-primary-foreground',
                      }}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt="Instructor"
                    />
                    <AvatarFallback className="rounded-lg">IN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Dr. Sarah Wilson
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      sarah@example.com
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder-avatar.jpg"
                        alt="Instructor"
                      />
                      <AvatarFallback className="rounded-lg">IN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Dr. Sarah Wilson
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        sarah@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

interface InstructorDashboardHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

function InstructorDashboardHeader({
  title,
  description,
  children,
}: InstructorDashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Use real-time notifications if available, otherwise fallback to API
  const realTimeNotifications = useRealTimeNotifications()

  // Fetch notifications for the notification center (fallback)
  const { data: notificationsData } = useQuery({
    queryKey: ['instructor', 'notifications'],
    queryFn: () => instructorDashboardService.getNotifications({ limit: 5 }),
    refetchInterval: 30000,
    enabled: realTimeNotifications.notifications.length === 0,
  })

  const unreadNotifications =
    realTimeNotifications.unreadCount || notificationsData?.unreadCount || 0
  const recentNotifications =
    realTimeNotifications.notifications.length > 0
      ? realTimeNotifications.notifications.slice(0, 5)
      : notificationsData?.notifications || []

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex items-center gap-2 flex-1">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses, students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Notifications */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 size-5 flex items-center justify-center text-xs p-0"
                >
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                Stay updated with your latest course activities
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-full">
              <div className="space-y-4 mt-4">
                {recentNotifications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bell className="h-8 w-8 mx-auto mb-2" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        !notification.isRead
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Instructor" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Dr. Sarah Wilson</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children}
    </header>
  )
}

interface InstructorDashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  headerContent?: React.ReactNode
}

export default function InstructorDashboardLayout({
  children,
  title,
  description,
  headerContent,
}: InstructorDashboardLayoutProps) {
  return (
    <InstructorRealTimeProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-mobile': '18rem',
          } as React.CSSProperties
        }
      >
        <InstructorSidebar />
        <SidebarInset>
          <InstructorDashboardHeader title={title} description={description}>
            {headerContent}
          </InstructorDashboardHeader>
          <div className="flex flex-1 flex-col gap-4 p-4 pb-24">{children}</div>
          {/* Real-time status bar removed per request to stop render loop on analytics */}
        </SidebarInset>
      </SidebarProvider>
    </InstructorRealTimeProvider>
  )
}
