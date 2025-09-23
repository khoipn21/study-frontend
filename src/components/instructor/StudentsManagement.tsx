import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Send,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import type { InstructorStudent } from '@/lib/instructor-dashboard'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

// Engagement level badge
const getEngagementBadge = (level: InstructorStudent['engagementLevel']) => {
  const variants = {
    high: { variant: 'default' as const, label: 'High', icon: TrendingUp },
    medium: {
      variant: 'secondary' as const,
      label: 'Medium',
      icon: TrendingUp,
    },
    low: { variant: 'destructive' as const, label: 'Low', icon: TrendingDown },
  }

  const config = variants[level]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// Student data table columns
function createColumns(): Array<ColumnDef<InstructorStudent>> {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>
              {row.original.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'coursesEnrolled',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Courses
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue('coursesEnrolled')}</span>
          <span className="text-muted-foreground ml-1">
            ({row.original.coursesCompleted} completed)
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'averageProgress',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{row.getValue('averageProgress')}%</span>
          </div>
          <Progress value={row.getValue('averageProgress')} className="h-2" />
        </div>
      ),
    },
    {
      accessorKey: 'engagementLevel',
      header: 'Engagement',
      cell: ({ row }) => getEngagementBadge(row.getValue('engagementLevel')),
    },
    {
      accessorKey: 'totalWatchTime',
      header: 'Watch Time',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          {Math.round(row.original.totalWatchTime / 60)} hrs
        </div>
      ),
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Active',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {new Date(row.getValue('lastActivity')).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: 'isAtRisk',
      header: 'Status',
      cell: ({ row }) =>
        row.getValue('isAtRisk') ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            At Risk
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                View Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

interface StudentDetailsProps {
  student: InstructorStudent
  onClose: () => void
}

function StudentDetails({ student, onClose: _onClose }: StudentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-muted-foreground">{student.email}</p>
          <div className="flex items-center gap-4 mt-2">
            {getEngagementBadge(student.engagementLevel)}
            {student.isAtRisk && <Badge variant="destructive">At Risk</Badge>}
          </div>
        </div>
      </div>

      {/* Student Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{student.coursesEnrolled}</div>
            <p className="text-sm text-muted-foreground">Courses Enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{student.coursesCompleted}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(student.totalWatchTime / 60)}h
            </div>
            <p className="text-sm text-muted-foreground">Watch Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{student.averageProgress}%</div>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.courses.map((course) => (
              <div key={course.courseId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{course.courseTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last watched:{' '}
                      {new Date(course.lastWatched).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{course.progress}%</div>
                    {course.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {course.rating}
                      </div>
                    )}
                  </div>
                </div>
                <Progress value={course.progress} className="h-2" />
                {course.review && (
                  <p className="text-sm text-muted-foreground italic">
                    "{course.review}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {student.communications.map((comm) => (
              <div
                key={comm.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <h5 className="font-medium">{comm.subject}</h5>
                  <p className="text-sm text-muted-foreground">
                    {comm.type} • {new Date(comm.sentAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={comm.isRead ? 'secondary' : 'default'}>
                  {comm.isRead ? 'Read' : 'Unread'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface BulkMessageDialogProps {
  selectedStudents: Array<InstructorStudent>
  onSend: (subject: string, message: string) => void
  onClose: () => void
}

function BulkMessageDialog({
  selectedStudents,
  onSend,
  onClose,
}: BulkMessageDialogProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (subject.trim() && message.trim()) {
      onSend(subject, message)
      onClose()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Bulk Message</DialogTitle>
          <DialogDescription>
            Send a message to {selectedStudents.length} selected students
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={6}
            />
          </div>
          <div className="rounded-lg border p-3">
            <Label className="text-sm font-medium">
              Recipients ({selectedStudents.length}):
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedStudents.slice(0, 10).map((student) => (
                <Badge key={student.id} variant="secondary">
                  {student.name}
                </Badge>
              ))}
              {selectedStudents.length > 10 && (
                <Badge variant="outline">
                  +{selectedStudents.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!subject.trim() || !message.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface StudentsManagementProps {
  initialFilters?: {
    engagementLevel?: string
    courseId?: string
    search?: string
  }
}

export default function StudentsManagement({
  initialFilters,
}: StudentsManagementProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Component state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  // Filter state
  const [globalFilter, setGlobalFilter] = useState(initialFilters?.search || '')
  const [engagementFilter, setEngagementFilter] = useState(
    initialFilters?.engagementLevel || 'all',
  )
  const [courseFilter, setCourseFilter] = useState(
    initialFilters?.courseId || 'all',
  )
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false)

  // Dialog state
  const [selectedStudent, setSelectedStudent] =
    useState<InstructorStudent | null>(null)
  const [showBulkMessage, setShowBulkMessage] = useState(false)

  // Fetch students data
  const {
    data: studentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'instructor',
      'students',
      {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        engagementLevel:
          engagementFilter !== 'all' ? engagementFilter : undefined,
        courseId: courseFilter !== 'all' ? courseFilter : undefined,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    ],
    queryFn: () =>
      instructorDashboardService.getStudents({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter || undefined,
        engagementLevel:
          engagementFilter !== 'all' ? engagementFilter : undefined,
        courseId: courseFilter !== 'all' ? courseFilter : undefined,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      }),
  })

  // Fetch at-risk students
  const { data: atRiskStudents } = useQuery({
    queryKey: ['instructor', 'students', 'at-risk'],
    queryFn: () => instructorDashboardService.getAtRiskStudents(),
  })

  // Fetch courses for filtering
  const { data: coursesData } = useQuery({
    queryKey: ['instructor', 'courses', 'list'],
    queryFn: () => instructorDashboardService.getCourses({ limit: 100 }),
  })

  // Bulk message mutation
  const bulkMessageMutation = useMutation({
    mutationFn: ({
      subject,
      content,
      recipients,
    }: {
      subject: string
      content: string
      recipients: Array<{ type: 'student'; id: string }>
    }) =>
      instructorDashboardService.sendBulkMessage({
        subject,
        content,
        recipients,
      }),
    onSuccess: () => {
      toast({
        title: 'Messages sent',
        description: 'Your message has been sent to all selected students.',
      })
      setRowSelection({})
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send messages. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const columns = useMemo(() => createColumns(), [])

  const filteredStudents = useMemo(() => {
    let students = studentsData?.students || []

    if (showAtRiskOnly) {
      students = students.filter((student) => student.isAtRisk)
    }

    return students
  }, [studentsData?.students, showAtRiskOnly])

  const table = useReactTable({
    data: filteredStudents,
    columns,
    pageCount: studentsData?.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  })

  const selectedStudents = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)

  const handleBulkMessage = (subject: string, message: string) => {
    const recipients = selectedStudents.map((student) => ({
      type: 'student' as const,
      id: student.id,
    }))

    bulkMessageMutation.mutate({
      subject,
      content: message,
      recipients,
    })
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Students</h3>
            <p className="text-muted-foreground">
              Failed to load student data. Please try again.
            </p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['instructor', 'students'],
                })
              }
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              At-Risk Students
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {atRiskStudents?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.students
                ? Math.round(
                    studentsData.students.reduce(
                      (acc, student) => acc + student.averageProgress,
                      0,
                    ) / studentsData.students.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Watch Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsData?.students
                ? Math.round(
                    studentsData.students.reduce(
                      (acc, student) => acc + student.totalWatchTime,
                      0,
                    ) /
                      studentsData.students.length /
                      60,
                  )
                : 0}
              h
            </div>
            <p className="text-xs text-muted-foreground">Per student</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={engagementFilter} onValueChange={setEngagementFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Engagement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Engagement</SelectItem>
              <SelectItem value="medium">Medium Engagement</SelectItem>
              <SelectItem value="low">Low Engagement</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {coursesData?.courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="at-risk"
              checked={showAtRiskOnly}
              onCheckedChange={(checked) => setShowAtRiskOnly(checked === true)}
            />
            <Label htmlFor="at-risk" className="text-sm">
              At-risk only
            </Label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedStudents.length > 0 && (
            <Button onClick={() => setShowBulkMessage(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message ({selectedStudents.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {[...Array(pagination.pageSize)].map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-6 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                  onClick={() => setSelectedStudent(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedStudents.length} of {table.getFilteredRowModel().rows.length}{' '}
          row(s) selected.
          {studentsData && (
            <span className="ml-2">
              Showing {studentsData.students.length} of {studentsData.total}{' '}
              total students.
            </span>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>

      {/* Student Details Sheet */}
      {selectedStudent && (
        <Sheet open onOpenChange={() => setSelectedStudent(null)}>
          <SheetContent className="w-[600px] sm:max-w-none">
            <SheetHeader>
              <SheetTitle>Student Details</SheetTitle>
              <SheetDescription>
                Detailed view of {selectedStudent.name}'s progress and activity
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-full">
              <StudentDetails
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}

      {/* Bulk Message Dialog */}
      {showBulkMessage && (
        <BulkMessageDialog
          selectedStudents={selectedStudents}
          onSend={handleBulkMessage}
          onClose={() => setShowBulkMessage(false)}
        />
      )}
    </div>
  )
}
