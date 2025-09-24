import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  AlertCircle,
  Archive,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  XCircle,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { instructorDashboardService } from '@/lib/instructor-dashboard'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { InstructorCourse } from '@/lib/instructor-dashboard'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

// Status badge variants
const getStatusBadge = (status: InstructorCourse['status']) => {
  const variants = {
    published: {
      variant: 'default' as const,
      icon: CheckCircle,
      label: 'Published',
    },
    draft: { variant: 'secondary' as const, icon: Clock, label: 'Draft' },
    under_review: {
      variant: 'outline' as const,
      icon: AlertCircle,
      label: 'Under Review',
    },
    archived: {
      variant: 'destructive' as const,
      icon: XCircle,
      label: 'Archived',
    },
  }

  const config = variants[status] || variants.draft
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// Course data table columns
function createColumns(
  onEdit: (course: InstructorCourse) => void,
  onDelete: (course: InstructorCourse) => void,
): Array<ColumnDef<InstructorCourse>> {
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
      accessorKey: 'title',
      header: 'Course',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={row.original.thumbnail}
              alt={row.original.title}
            />
            <AvatarFallback>
              <BookOpen className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">{row.getValue('title')}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.category} • {row.original.level}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      accessorKey: 'enrollmentCount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Students
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const enrollmentCount = row.getValue('enrollmentCount')
        return (
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            {(enrollmentCount as number) || 0}
          </div>
        )
      },
    },
    {
      accessorKey: 'revenue',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Revenue
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const revenue = row.getValue('revenue')
        return (
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />$
            {revenue && typeof revenue === 'number'
              ? revenue.toLocaleString()
              : '0'}
          </div>
        )
      },
    },
    {
      accessorKey: 'averageRating',
      header: 'Rating',
      cell: ({ row }) => {
        const averageRating = row.getValue('averageRating')
        const totalReviews = row.original.totalReviews
        return (
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>
              {averageRating && typeof averageRating === 'number'
                ? averageRating.toFixed(1)
                : '0.0'}
            </span>
            <span className="text-muted-foreground ml-1">
              ({totalReviews || 0})
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {new Date(row.getValue('updatedAt')).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original

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
              <DropdownMenuItem onClick={() => onEdit(course)}>
                <div className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Content
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {course.status === 'draft' && (
                <DropdownMenuItem>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Publish Course
                </DropdownMenuItem>
              )}
              {course.status === 'published' && (
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Course
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(course)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

interface BulkActionsBarProps {
  selectedRows: Array<any>
  onBulkAction: (action: string, courseIds: Array<string>) => void
}

function BulkActionsBar({ selectedRows, onBulkAction }: BulkActionsBarProps) {
  if (selectedRows.length === 0) return null

  const courseIds = selectedRows.map(
    (row) => (row as { original: { id: string } }).original.id,
  )

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedRows.length} course{selectedRows.length > 1 ? 's' : ''}{' '}
          selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('publish', courseIds)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Publish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('archive', courseIds)}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('delete', courseIds)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}

interface CoursesDataTableProps {
  initialFilters?: {
    status?: string
    category?: string
    search?: string
  }
}

export default function CoursesDataTable({
  initialFilters,
}: CoursesDataTableProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const router = useRouter()

  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Filter state
  const [globalFilter, setGlobalFilter] = useState(initialFilters?.search || '')
  const [statusFilter, setStatusFilter] = useState(
    initialFilters?.status || 'all',
  )
  const [categoryFilter, setCategoryFilter] = useState(
    initialFilters?.category || 'all',
  )

  // Delete confirmation state
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean
    courseId: string
    courseTitle: string
  }>({
    isOpen: false,
    courseId: '',
    courseTitle: '',
  })

  // Fetch courses data
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'instructor',
      'courses',
      {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      },
    ],
    queryFn: () =>
      instructorDashboardService.getCourses(
        {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          sortBy: sorting[0]?.id,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        },
        token || undefined,
      ),
    enabled: !!token,
  })

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!token) throw new Error('Authentication required')
      return instructorDashboardService.deleteCourse(courseId, token)
    },
    onSuccess: () => {
      toast({
        title: 'Course deleted',
        description:
          'The course has been successfully deleted (soft delete). It is now hidden from students but data is preserved.',
      })
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'courses'],
      })
      setDeleteConfirmDialog({ isOpen: false, courseId: '', courseTitle: '' })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete course',
        variant: 'destructive',
      })
    },
  })

  // Bulk operations mutation
  const bulkOperationMutation = useMutation({
    mutationFn: ({
      type,
      courseIds,
    }: {
      type: string
      courseIds: Array<string>
    }) =>
      instructorDashboardService.bulkOperations(
        {
          type: type as any,
          courseIds,
        },
        token || undefined,
      ),
    onSuccess: () => {
      toast({
        title: 'Bulk operation completed',
        description: 'The selected courses have been updated successfully.',
      })
      queryClient.invalidateQueries({
        queryKey: ['instructor', 'courses'],
      })
      setRowSelection({})
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to complete the bulk operation. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const handleBulkAction = (action: string, courseIds: Array<string>) => {
    bulkOperationMutation.mutate({ type: action, courseIds })
  }

  const handleEditCourse = useCallback(
    (course: InstructorCourse) => {
      // Navigate to course edit page with course data
      router.navigate({
        to: '/dashboard/instructor/courses/$courseId/edit',
        params: { courseId: course.id },
      })
    },
    [router],
  )

  const handleDeleteCourse = useCallback((course: InstructorCourse) => {
    setDeleteConfirmDialog({
      isOpen: true,
      courseId: course.id,
      courseTitle: course.title,
    })
  }, [])

  const columns = useMemo(
    () => createColumns(handleEditCourse, handleDeleteCourse),
    [handleEditCourse, handleDeleteCourse],
  )

  const table = useReactTable({
    data:
      (coursesData as { courses?: Array<any>; totalPages?: number })?.courses ||
      [],
    columns,
    pageCount:
      (coursesData as { courses?: Array<any>; totalPages?: number })
        ?.totalPages || 0,
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

  const confirmDelete = () => {
    if (deleteConfirmDialog.courseId) {
      deleteMutation.mutate(deleteConfirmDialog.courseId)
    }
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Courses</h3>
            <p className="text-muted-foreground">
              Failed to load courses data. Please try again.
            </p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ['instructor', 'courses'],
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
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
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

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar
        selectedRows={selectedRows}
        onBulkAction={handleBulkAction}
      />

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
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows.length} of {table.getFilteredRowModel().rows.length}{' '}
          row(s) selected.
          {coursesData &&
            (coursesData as { courses?: Array<any>; total?: number })
              ?.courses && (
              <span className="ml-2">
                Showing{' '}
                {
                  (coursesData as { courses?: Array<any>; total?: number })
                    .courses!.length
                }{' '}
                of{' '}
                {
                  (coursesData as { courses?: Array<any>; total?: number })
                    .total
                }{' '}
                total courses.
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.isOpen}
        onOpenChange={(open: boolean) =>
          setDeleteConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmDialog.courseTitle}
              "? This will soft delete the course, which means it will be hidden
              from students and marked as deleted, but all data including
              enrollments and billing information will be preserved for
              administrative purposes. This action can be reversed by restoring
              the course later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
