import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Search,
  Settings,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

// Navigation items for the admin dashboard
const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard/admin',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Forum Management',
    icon: Shield,
    items: [
      {
        title: 'Forum Approval',
        url: '/dashboard/admin/forum',
      },
      {
        title: 'All Topics',
        url: '/dashboard/admin/forum/topics',
      },
      {
        title: 'Reported Content',
        url: '/dashboard/admin/forum/reports',
      },
    ],
  },
  {
    title: 'User Management',
    icon: Users,
    items: [
      {
        title: 'All Users',
        url: '/dashboard/admin/users',
      },
      {
        title: 'Instructors',
        url: '/dashboard/admin/instructors',
      },
      {
        title: 'Students',
        url: '/dashboard/admin/students',
      },
    ],
  },
  {
    title: 'Courses',
    icon: BookOpen,
    items: [
      {
        title: 'All Courses',
        url: '/dashboard/admin/courses',
      },
      {
        title: 'Course Approval',
        url: '/dashboard/admin/courses/pending',
      },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      {
        title: 'Platform Stats',
        url: '/dashboard/admin/analytics',
      },
      {
        title: 'Revenue',
        url: '/dashboard/admin/revenue',
      },
      {
        title: 'User Activity',
        url: '/dashboard/admin/activity',
      },
    ],
  },
]

const toolsItems = [
  {
    title: 'System Logs',
    url: '/dashboard/admin/logs',
    icon: FileText,
  },
  {
    title: 'Settings',
    url: '/dashboard/admin/settings',
    icon: Settings,
  },
  {
    title: 'Help Center',
    url: '/dashboard/admin/help',
    icon: HelpCircle,
  },
]

function AdminSidebar() {
  const { setOpenMobile, setOpen } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Admin Dashboard</span>
              <span className="truncate text-xs text-muted-foreground">
                Platform management
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setOpenMobile(false)
              setOpen(false)
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
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
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs text-muted-foreground">
                      admin@studyplatform.com
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
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin User</span>
                      <span className="truncate text-xs text-muted-foreground">
                        admin@studyplatform.com
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

interface AdminDashboardHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

function AdminDashboardHeader({
  title,
  description,
  children,
}: AdminDashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

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
            placeholder="Search users, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin User</DropdownMenuLabel>
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

interface AdminDashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  headerContent?: React.ReactNode
}

export default function AdminDashboardLayout({
  children,
  title,
  description,
  headerContent,
}: AdminDashboardLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen={false}
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-mobile': '18rem',
          } as React.CSSProperties
        }
      >
        <div data-dashboard="true" className="flex h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <AdminDashboardHeader title={title} description={description}>
              {headerContent}
            </AdminDashboardHeader>
            <div className="flex flex-1 flex-col gap-4 p-4 pb-24 overflow-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
