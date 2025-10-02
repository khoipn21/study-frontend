import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  DollarSign,
  Globe,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import { useCallback, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

import type { CourseFilter } from '@/lib/types'

interface CourseFiltersProps {
  filters: CourseFilter
  onFiltersChange: (filters: CourseFilter) => void
  onSearch: (query: string) => void
  searchQuery: string
  isLoading?: boolean
  resultCount?: number
  className?: string
}

const CATEGORIES = [
  'Development',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Photography',
  'Music',
  'Health & Fitness',
  'Language',
  'Personal Development',
]

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
]

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese',
  'Portuguese',
  'Italian',
  'Russian',
  'Arabic',
]

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
]

export function CourseFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  isLoading = false,
  resultCount,
  className,
}: CourseFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Calculate active filter count
  const calculateActiveFilters = useCallback((currentFilters: CourseFilter) => {
    let count = 0
    if (currentFilters.category?.length) count++
    if (currentFilters.level?.length) count++
    if (currentFilters.access_type?.length) count++
    if (currentFilters.language?.length) count++
    if (currentFilters.price_range) count++
    if (currentFilters.duration_range) count++
    if (currentFilters.rating_min) count++
    if (currentFilters.has_certificate) count++
    if (currentFilters.is_featured) count++
    return count
  }, [])

  const updateFilters = useCallback(
    (newFilters: Partial<CourseFilter>) => {
      const updatedFilters = { ...filters, ...newFilters }
      onFiltersChange(updatedFilters)
      setActiveFilterCount(calculateActiveFilters(updatedFilters))
    },
    [filters, onFiltersChange, calculateActiveFilters],
  )

  const clearAllFilters = useCallback(() => {
    onFiltersChange({})
    setActiveFilterCount(0)
  }, [onFiltersChange])

  const removeFilter = useCallback(
    (filterKey: keyof CourseFilter, value?: string) => {
      const newFilters = { ...filters }

      if (
        filterKey === 'category' ||
        filterKey === 'level' ||
        filterKey === 'access_type' ||
        filterKey === 'language'
      ) {
        if (value && newFilters[filterKey]) {
          newFilters[filterKey] = newFilters[filterKey].filter(
            (item) => item !== value,
          ) as any
          if (newFilters[filterKey]?.length === 0) {
            delete newFilters[filterKey]
          }
        } else {
          delete newFilters[filterKey]
        }
      } else {
        delete newFilters[filterKey]
      }

      onFiltersChange(newFilters)
      setActiveFilterCount(calculateActiveFilters(newFilters))
    },
    [filters, onFiltersChange, calculateActiveFilters],
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4"
          disabled={isLoading}
        />
        {searchQuery && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearch('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isAdvancedOpen && 'rotate-180',
              )}
            />
          </Button>

          {/* Sort By */}
          <Select
            value={filters.sort_by || 'popularity'}
            onValueChange={(value) =>
              updateFilters({ sort_by: value as CourseFilter['sort_by'] })
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Result Count */}
        {resultCount !== undefined && (
          <span className="text-sm text-muted-foreground">
            {resultCount.toLocaleString()} courses found
          </span>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {/* Category filters */}
          {filters.category?.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('category', category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Level filters */}
          {filters.level?.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {level}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('level', level)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Access type filters */}
          {filters.access_type?.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {type === 'free'
                ? 'Free'
                : type === 'paid'
                  ? 'Paid'
                  : 'Subscription'}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('access_type', type)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Other filters */}
          {filters.price_range && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${filters.price_range.min} - ${filters.price_range.max}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('price_range')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.rating_min && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.rating_min}+ stars
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('rating_min')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 border rounded-lg bg-muted/20">
            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Category
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category?.includes(category) || false}
                      onCheckedChange={(checked) => {
                        const currentCategories = filters.category || []
                        if (checked) {
                          updateFilters({
                            category: [...currentCategories, category],
                          })
                        } else {
                          updateFilters({
                            category: currentCategories.filter(
                              (c) => c !== category,
                            ),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Level
              </h4>
              <div className="space-y-2">
                {LEVELS.map((level) => (
                  <div
                    key={level.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`level-${level.value}`}
                      checked={filters.level?.includes(level.value) || false}
                      onCheckedChange={(checked) => {
                        const currentLevels = filters.level || []
                        if (checked) {
                          updateFilters({
                            level: [...currentLevels, level.value],
                          })
                        } else {
                          updateFilters({
                            level: currentLevels.filter(
                              (l) => l !== level.value,
                            ),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`level-${level.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Type Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Access Type
              </h4>
              <div className="space-y-2">
                {[
                  { value: 'free', label: 'Free Courses' },
                  { value: 'paid', label: 'Paid Courses' },
                  { value: 'subscription', label: 'Subscription' },
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`access-${type.value}`}
                      checked={
                        filters.access_type?.includes(type.value as any) ||
                        false
                      }
                      onCheckedChange={(checked) => {
                        const currentTypes = filters.access_type || []
                        if (checked) {
                          updateFilters({
                            access_type: [...currentTypes, type.value as any],
                          })
                        } else {
                          updateFilters({
                            access_type: currentTypes.filter(
                              (t) => t !== type.value,
                            ),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`access-${type.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range
              </h4>
              <div className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={[
                      filters.price_range?.min || 0,
                      filters.price_range?.max || 500,
                    ]}
                    onValueChange={([min, max]) => {
                      updateFilters({
                        price_range: { min, max },
                      })
                    }}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>${filters.price_range?.min || 0}</span>
                    <span>${filters.price_range?.max || 500}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Range */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (hours)
              </h4>
              <div className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={[
                      filters.duration_range?.min || 0,
                      filters.duration_range?.max || 50,
                    ]}
                    onValueChange={([min, max]) => {
                      updateFilters({
                        duration_range: { min, max },
                      })
                    }}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{filters.duration_range?.min || 0}h</span>
                    <span>{filters.duration_range?.max || 50}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </h4>
              <Select
                value={filters.rating_min?.toString() || ''}
                onValueChange={(value) => {
                  if (value) {
                    updateFilters({ rating_min: parseFloat(value) })
                  } else {
                    updateFilters({ rating_min: undefined })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any rating</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.0">4.0+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3.0">3.0+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Features */}
            <div className="space-y-3">
              <h4 className="font-medium">Features</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificate"
                    checked={filters.has_certificate || false}
                    onCheckedChange={(checked) => {
                      updateFilters({ has_certificate: checked as boolean })
                    }}
                  />
                  <label
                    htmlFor="certificate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Certificate available
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.is_featured || false}
                    onCheckedChange={(checked) => {
                      updateFilters({ is_featured: checked as boolean })
                    }}
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured courses
                  </label>
                </div>
              </div>
            </div>

            {/* Language Filter */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {LANGUAGES.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={filters.language?.includes(language) || false}
                      onCheckedChange={(checked) => {
                        const currentLanguages = filters.language || []
                        if (checked) {
                          updateFilters({
                            language: [...currentLanguages, language],
                          })
                        } else {
                          updateFilters({
                            language: currentLanguages.filter(
                              (l) => l !== language,
                            ),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`language-${language}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default CourseFilters
