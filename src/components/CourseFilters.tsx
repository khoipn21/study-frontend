import React, { useState } from 'react'
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  DollarSign,
  Filter,
  Globe,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { PRICE_RANGES, formatPriceRange, formatVND } from '@/lib/currency'
import {
  formatVietnameseCount,
  vietnameseTranslations,
} from '@/lib/vietnamese-locale'
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
  // Enhanced filters for Vietnamese market
  language: string
  accessType: string
  isPopular: boolean
  isFeatured: boolean
  hasSubtitles: boolean
  instructorVerified: boolean
  completionRate: number
  currency: 'VND' | 'USD'
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
  'Tất cả danh mục',
  'Lập trình',
  'Khoa học dữ liệu',
  'Thiết kế',
  'Kinh doanh',
  'Marketing',
  'Âm nhạc',
  'Nhiếp ảnh',
  'Sức khỏe & Thể dục',
  'Ngôn ngữ',
  'Phát triển bản thân',
  'Công nghệ',
  'Tài chính',
  'Kế toán',
  'Giáo dục',
  'Nghệ thuật',
  'Du lịch',
  'Nấu ăn',
]

const levels = [
  'Tất cả cấp độ',
  'Cơ bản',
  'Trung cấp',
  'Nâng cao',
  'Chuyên gia',
]

const durations = [
  'Mọi thời lượng',
  'Dưới 2 giờ',
  '2-6 giờ',
  '6-12 giờ',
  'Trên 12 giờ',
]

const languages = [
  'Tất cả ngôn ngữ',
  'Tiếng Việt',
  'Tiếng Anh',
  'Tiếng Anh (Phụ đề Việt)',
  'Tiếng Trung',
  'Tiếng Nhật',
  'Tiếng Hàn',
]

const accessTypes = [
  'Tất cả loại',
  'Miễn phí',
  'Trả phí một lần',
  'Đăng ký hàng tháng',
  'Truy cập trọn đời',
]

const sortOptions = [
  { value: 'relevance', label: 'Phù hợp nhất' },
  { value: 'popularity', label: 'Phổ biến nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_low', label: 'Giá: Thấp đến cao' },
  { value: 'price_high', label: 'Giá: Cao đến thấp' },
  { value: 'duration', label: 'Thời lượng' },
  { value: 'enrollment_count', label: 'Nhiều học viên nhất' },
  { value: 'completion_rate', label: 'Tỷ lệ hoàn thành cao' },
]

export function CourseFilters({
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
  totalResults = 0,
  className,
}: CourseFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const updateFilter = (key: keyof CourseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
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
    if (key === 'isFree' || key === 'hasVideos' || key === 'hasCertificate')
      return value === true
    return false
  })

  const FilterSection = ({
    children,
    title,
    icon: Icon,
  }: {
    children: React.ReactNode
    title: string
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
    <div className={cn('bg-card border-b', className)}>
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar and Basic Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm khóa học, giảng viên, hoặc chủ đề..."
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
                <SelectValue placeholder="Danh mục" />
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
                <SelectValue placeholder="Cấp độ" />
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
                <SelectValue placeholder="Sắp xếp theo" />
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
              Bộ lọc
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>

            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc nâng cao
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
                Xóa
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>
            {isLoading ? (
              'Đang tìm kiếm...'
            ) : (
              <>
                {formatVietnameseCount(totalResults, 'khóa học')} được tìm thấy
                {filters.search && ` cho "${filters.search}"`}
              </>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span>Bộ lọc đang hoạt động</span>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>

        {/* Advanced Filters Panel */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent className="mt-6">
            <div className="academic-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Price Range - VND Support */}
                <FilterSection title="Khoảng giá" icon={DollarSign}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="free-only"
                        checked={filters.isFree}
                        onCheckedChange={(checked) =>
                          updateFilter('isFree', checked)
                        }
                      />
                      <Label htmlFor="free-only" className="text-sm">
                        Chỉ khóa học miễn phí
                      </Label>
                    </div>
                    {!filters.isFree && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(PRICE_RANGES).map(([key, range]) => (
                            <div
                              key={key}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                id={`price-${key}`}
                                name="priceRange"
                                checked={
                                  filters.minPrice === range.min &&
                                  filters.maxPrice === range.max
                                }
                                onChange={() => {
                                  updateFilter('minPrice', range.min)
                                  updateFilter('maxPrice', range.max)
                                }}
                                className="rounded"
                              />
                              <Label
                                htmlFor={`price-${key}`}
                                className="text-xs"
                              >
                                {range.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{formatVND(filters.minPrice * 1000)}</span>
                            <span>
                              {filters.maxPrice === Infinity
                                ? '∞'
                                : formatVND(filters.maxPrice * 1000)}
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={5000}
                            step={100}
                            value={[
                              filters.minPrice,
                              Math.min(filters.maxPrice, 5000),
                            ]}
                            onValueChange={([min, max]) => {
                              updateFilter('minPrice', min)
                              updateFilter('maxPrice', max)
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Đánh giá" icon={Star}>
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
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="flex items-center text-sm"
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3 w-3',
                                i < rating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground',
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
                <FilterSection title="Thời lượng khóa học" icon={Clock}>
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => updateFilter('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời lượng" />
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
                <FilterSection title="Tính năng khóa học" icon={Award}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has-videos"
                        checked={filters.hasVideos}
                        onCheckedChange={(checked) =>
                          updateFilter('hasVideos', checked)
                        }
                      />
                      <Label htmlFor="has-videos" className="text-sm">
                        Có video bài giảng
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has-certificate"
                        checked={filters.hasCertificate}
                        onCheckedChange={(checked) =>
                          updateFilter('hasCertificate', checked)
                        }
                      />
                      <Label htmlFor="has-certificate" className="text-sm">
                        Có chứng chỉ
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has-subtitles"
                        checked={filters.hasSubtitles || false}
                        onCheckedChange={(checked) =>
                          updateFilter('hasSubtitles', checked)
                        }
                      />
                      <Label htmlFor="has-subtitles" className="text-sm">
                        Có phụ đề tiếng Việt
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-popular"
                        checked={filters.isPopular || false}
                        onCheckedChange={(checked) =>
                          updateFilter('isPopular', checked)
                        }
                      />
                      <Label htmlFor="is-popular" className="text-sm">
                        Khóa học phổ biến
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="instructor-verified"
                        checked={filters.instructorVerified || false}
                        onCheckedChange={(checked) =>
                          updateFilter('instructorVerified', checked)
                        }
                      />
                      <Label htmlFor="instructor-verified" className="text-sm">
                        Giảng viên đã xác minh
                      </Label>
                    </div>
                  </div>
                </FilterSection>

                {/* Language */}
                <FilterSection title="Ngôn ngữ" icon={Globe}>
                  <Select
                    value={filters.language || 'Tất cả ngôn ngữ'}
                    onValueChange={(value) => updateFilter('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterSection>

                {/* Access Type */}
                <FilterSection title="Loại truy cập" icon={Zap}>
                  <Select
                    value={filters.accessType || 'Tất cả loại'}
                    onValueChange={(value) => updateFilter('accessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại truy cập" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterSection>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  {
                    Object.entries(filters).filter(([key, value]) => {
                      if (key === 'search') return value !== ''
                      if (key === 'category') return value !== 'Tất cả danh mục'
                      if (key === 'level') return value !== 'Tất cả cấp độ'
                      if (key === 'language') return value !== 'Tất cả ngôn ngữ'
                      if (key === 'accessType') return value !== 'Tất cả loại'
                      if (
                        key === 'isFree' ||
                        key === 'hasVideos' ||
                        key === 'hasCertificate' ||
                        key === 'hasSubtitles' ||
                        key === 'isPopular' ||
                        key === 'instructorVerified'
                      )
                        return value === true
                      if (key === 'minPrice') return value > 0
                      if (key === 'maxPrice') return value < 5000
                      if (key === 'minRating') return value > 0
                      return false
                    }).length
                  }{' '}
                  bộ lọc đang áp dụng
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onReset}>
                    Đặt lại bộ lọc
                  </Button>
                  <Button size="sm" onClick={() => setIsAdvancedOpen(false)}>
                    Áp dụng bộ lọc
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
