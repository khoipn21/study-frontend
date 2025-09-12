import React, { useState } from 'react'
import { 
  Filter, 
  Search, 
  X,
  ChevronDown,
  SlidersHorizontal,
  BookOpen,
  Clock,
  Star,
  DollarSign,
  Users,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export interface CourseFilters {
  search: string
  category: string
  level: string
  minPrice: number
  maxPrice: number
  minRating: number
  duration: string
  status: string
  instructor: string
  isFree: boolean
  hasVideos: boolean
  hasCertificate: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface CourseFiltersProps {
  filters: CourseFilters
  onFiltersChange: (filters: CourseFilters) => void
  onReset: () => void
  isLoading?: boolean
  totalResults?: number
  className?: string
}

const categories = [
  'All Categories',
  'Programming',
  'Data Science', 
  'Design',
  'Business',
  'Marketing',
  'Music',
  'Photography',
  'Health & Fitness',
  'Language',
  'Personal Development',
  'Technology'
]

const levels = [
  'All Levels',
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
]

const durations = [
  'Any Duration',
  '0-2 hours',
  '2-6 hours',
  '6-12 hours',
  '12+ hours'
]

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' }
]

export function CourseFilters({
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
  totalResults = 0,
  className
}: CourseFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilter = (key: keyof CourseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value !== ''
    if (key === 'category') return value !== 'All Categories'
    if (key === 'level') return value !== 'All Levels'
    if (key === 'duration') return value !== 'Any Duration'
    if (key === 'status') return value !== ''
    if (key === 'instructor') return value !== ''
    if (key === 'minPrice') return value > 0
    if (key === 'maxPrice') return value < 1000
    if (key === 'minRating') return value > 0
    if (key === 'isFree' || key === 'hasVideos' || key === 'hasCertificate') return value === true
    return false
  })

  const FilterSection = ({ children, title, icon: Icon }: { 
    children: React.ReactNode, 
    title: string, 
    icon: any 
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </Label>
      {children}
    </div>
  )

  return (
    <div className={cn("bg-card border-b", className)}>
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar and Basic Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for courses, instructors, or topics..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 pr-4 h-11"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap lg:flex-nowrap gap-2">
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.level}
              onValueChange={(value) => updateFilter('level', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>

            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  <ChevronDown className="h-4 w-4 ml-2" />
                  {hasActiveFilters && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>
            {isLoading ? (
              'Searching...'
            ) : (
              <>
                {totalResults.toLocaleString()} course{totalResults !== 1 ? 's' : ''} found
                {filters.search && ` for "${filters.search}"`}
              </>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span>Filters active</span>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>

        {/* Advanced Filters Panel */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent className="mt-6">
            <div className="academic-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Price Range */}
                <FilterSection title="Price Range" icon={DollarSign}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="free-only"
                        checked={filters.isFree}
                        onCheckedChange={(checked) => updateFilter('isFree', checked)}
                      />
                      <Label htmlFor="free-only" className="text-sm">Free courses only</Label>
                    </div>
                    {!filters.isFree && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>${filters.minPrice}</span>
                          <span>${filters.maxPrice}</span>
                        </div>
                        <Slider
                          min={0}
                          max={1000}
                          step={10}
                          value={[filters.minPrice, filters.maxPrice]}
                          onValueChange={([min, max]) => {
                            updateFilter('minPrice', min)
                            updateFilter('maxPrice', max)
                          }}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Rating" icon={Star}>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`rating-${rating}`}
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => updateFilter('minRating', rating)}
                          className="rounded"
                        />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < rating ? "fill-warning text-warning" : "text-muted-foreground"
                              )}
                            />
                          ))}
                          <span className="ml-1">& up</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Duration */}
                <FilterSection title="Course Duration" icon={Clock}>
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => updateFilter('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterSection>

                {/* Features */}
                <FilterSection title="Course Features" icon={Award}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has-videos"
                        checked={filters.hasVideos}
                        onCheckedChange={(checked) => updateFilter('hasVideos', checked)}
                      />
                      <Label htmlFor="has-videos" className="text-sm">Video content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has-certificate"
                        checked={filters.hasCertificate}
                        onCheckedChange={(checked) => updateFilter('hasCertificate', checked)}
                      />
                      <Label htmlFor="has-certificate" className="text-sm">Certificate included</Label>
                    </div>
                  </div>
                </FilterSection>

              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  {Object.entries(filters).filter(([key, value]) => {
                    if (key === 'search') return value !== ''
                    if (key === 'category') return value !== 'All Categories'
                    if (key === 'level') return value !== 'All Levels'
                    return false
                  }).length} filters applied
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onReset}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsAdvancedOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}