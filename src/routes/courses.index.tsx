import React, { useState, useMemo } from 'react'
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { 
  Grid3X3, 
  List, 
  Loader2,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Star,
  Filter
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { CourseCard } from '@/components/CourseCard'
import { CourseFilters, type CourseFilters as CourseFiltersType } from '@/components/CourseFilters'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Search = { 
  page?: number
  q?: string
  category?: string
  level?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: string
  view?: 'grid' | 'list'
}

export const Route = createFileRoute('/courses/')({
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      page: Number(search.page) || 1,
      q: typeof search.q === 'string' ? search.q : '',
      category: typeof search.category === 'string' ? search.category : 'All Categories',
      level: typeof search.level === 'string' ? search.level : 'All Levels',
      minPrice: Number(search.minPrice) || 0,
      maxPrice: Number(search.maxPrice) || 1000,
      minRating: Number(search.minRating) || 0,
      sortBy: typeof search.sortBy === 'string' ? search.sortBy : 'relevance',
      view: (search.view === 'list' || search.view === 'grid') ? search.view : 'grid',
    }
  },
  component: CoursesPage,
})

function CoursesPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/courses/' })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(searchParams.view || 'grid')

  const filters: CourseFiltersType = useMemo(() => ({
    search: searchParams.q || '',
    category: searchParams.category || 'All Categories',
    level: searchParams.level || 'All Levels',
    minPrice: searchParams.minPrice || 0,
    maxPrice: searchParams.maxPrice || 1000,
    minRating: searchParams.minRating || 0,
    duration: 'Any Duration',
    status: '',
    instructor: '',
    isFree: false,
    hasVideos: false,
    hasCertificate: false,
    sortBy: searchParams.sortBy || 'relevance',
    sortOrder: 'desc' as const,
  }), [searchParams])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses', searchParams],
    queryFn: async () => {
      const res = await api.listCourses({
        page: searchParams.page || 1,
        q: searchParams.q || '',
        category: searchParams.category !== 'All Categories' ? searchParams.category : undefined,
        level: searchParams.level !== 'All Levels' ? searchParams.level : undefined,
        min_price: searchParams.minPrice,
        max_price: searchParams.maxPrice,
        min_rating: searchParams.minRating,
        sort_by: searchParams.sortBy,
      })
      return res.data!
    },
  })

  const handleFiltersChange = (newFilters: CourseFiltersType) => {
    const searchParams: Search = {
      page: 1,
      q: newFilters.search || undefined,
      category: newFilters.category !== 'All Categories' ? newFilters.category : undefined,
      level: newFilters.level !== 'All Levels' ? newFilters.level : undefined,
      minPrice: newFilters.minPrice > 0 ? newFilters.minPrice : undefined,
      maxPrice: newFilters.maxPrice < 1000 ? newFilters.maxPrice : undefined,
      minRating: newFilters.minRating > 0 ? newFilters.minRating : undefined,
      sortBy: newFilters.sortBy !== 'relevance' ? newFilters.sortBy : undefined,
      view: viewMode,
    }

    navigate({ 
      to: '/courses/', 
      search: searchParams,
      replace: true
    })
  }

  const handleResetFilters = () => {
    navigate({ 
      to: '/courses/', 
      search: { page: 1, view: viewMode },
      replace: true
    })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    navigate({ 
      to: '/courses/', 
      search: { ...searchParams, view: mode },
      replace: true
    })
  }

  const handlePageChange = (page: number) => {
    navigate({ 
      to: '/courses/', 
      search: { ...searchParams, page },
      replace: true
    })
  }

  // Featured courses for empty state or top of page
  const featuredCourses = data?.courses?.slice(0, 3) || []

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load courses</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'Something went wrong while fetching courses'}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4">
              Explore Our Course Catalog
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover thousands of courses from expert instructors in technology, 
              business, design, and more.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-semibold">{data?.total || 0}</span> courses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Updated weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Expert instructors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CourseFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        isLoading={isLoading}
        totalResults={data?.total || 0}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  {data?.total || 0} course{(data?.total || 0) !== 1 ? 's' : ''}
                  {filters.search && ` for "${filters.search}"`}
                </>
              )}
            </h2>
            {data?.page && data?.total_pages && data.total_pages > 1 && (
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.total_pages}
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="bg-muted p-1 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading courses...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data && data.courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={handleResetFilters} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          </div>
        )}

        {/* Course Grid/List */}
        {!isLoading && data && data.courses.length > 0 && (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {data.courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                variant={viewMode === 'list' ? 'compact' : index < 3 ? 'featured' : 'default'}
                showInstructor={true}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && data && data.total_pages && data.total_pages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
