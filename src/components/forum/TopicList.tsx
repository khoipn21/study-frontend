import {
  Eye,
  Grid3X3,
  List,
  MessageSquare,
  Pin,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { TopicCard, TopicCardSkeleton } from './TopicCard'
import type { Topic } from '@/lib/api/forum'

interface TopicListProps {
  topics: Array<Topic>
  isLoading?: boolean
  error?: Error | null
  selectedTopicId?: string
  onTopicSelect?: (topicId: string) => void
  onRefresh?: () => void
  showSearch?: boolean
  showFilters?: boolean
  showViewToggle?: boolean
  compact?: boolean
  emptyMessage?: string
  className?: string
}

type SortOption =
  | 'latest'
  | 'oldest'
  | 'most_replies'
  | 'most_views'
  | 'pinned_first'
type FilterOption = 'all' | 'pending' | 'approved' | 'pinned' | 'unpinned'
type ViewMode = 'list' | 'grid'

export function TopicList({
  topics,
  isLoading = false,
  error = null,
  selectedTopicId,
  onTopicSelect,
  onRefresh,
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  compact = false,
  emptyMessage = 'No topics found',
  className = '',
}: TopicListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('pinned_first')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter and sort topics
  const filteredAndSortedTopics = topics
    .filter((topic) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          topic.title.toLowerCase().includes(query) ||
          topic.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          topic.author?.name?.toLowerCase().includes(query)
        )
      }

      // Status filter
      switch (filterBy) {
        case 'pending':
          return topic.status === 'pending'
        case 'approved':
          return topic.status === 'approved'
        case 'pinned':
          return topic.isPinned || topic.is_sticky
        case 'unpinned':
          return !(topic.isPinned || topic.is_sticky)
        default:
          return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return (
            new Date(b.created_at || b.createdAt).getTime() -
            new Date(a.created_at || a.createdAt).getTime()
          )
        case 'oldest':
          return (
            new Date(a.created_at || a.createdAt).getTime() -
            new Date(b.created_at || b.createdAt).getTime()
          )
        case 'most_replies':
          return (
            (b.postCount || b.post_count || 0) -
            (a.postCount || a.post_count || 0)
          )
        case 'most_views':
          return (
            (b.viewCount || b.view_count || 0) -
            (a.viewCount || a.view_count || 0)
          )
        case 'pinned_first':
          // Pinned topics first, then by latest
          const aPinned = a.isPinned || a.is_sticky || false
          const bPinned = b.isPinned || b.is_sticky || false
          if (aPinned && !bPinned) return -1
          if (!aPinned && bPinned) return 1
          if (aPinned && bPinned) {
            // Both pinned, sort by pin order
            const aOrder = a.pinOrder || a.pin_order || 999
            const bOrder = b.pinOrder || b.pin_order || 999
            return aOrder - bOrder
          }
          // Both unpinned, sort by latest
          return (
            new Date(b.created_at || b.createdAt).getTime() -
            new Date(a.created_at || a.createdAt).getTime()
          )
        default:
          return 0
      }
    })

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading topics</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header with search and filters */}
      {(showSearch || showFilters || showViewToggle || onRefresh) && (
        <div className="space-y-4 mb-6">
          {/* Search bar */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics by title, tags, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Filters and controls */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort options */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pinned_first">
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4" />
                        Pinned First
                      </div>
                    </SelectItem>
                    <SelectItem value="latest">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        Latest First
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        Oldest First
                      </div>
                    </SelectItem>
                    <SelectItem value="most_replies">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Most Replies
                      </div>
                    </SelectItem>
                    <SelectItem value="most_views">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Most Views
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter options */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <Select
                  value={filterBy}
                  onValueChange={(value) => setFilterBy(value as FilterOption)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pinned">Pinned</SelectItem>
                    <SelectItem value="unpinned">Unpinned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View mode toggle */}
              {showViewToggle && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">View:</span>
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) =>
                      value && setViewMode(value as ViewMode)
                    }
                  >
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid3X3 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}

              {/* Refresh button */}
              {onRefresh && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh topics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Results count */}
              <div className="text-sm text-muted-foreground ml-auto">
                {filteredAndSortedTopics.length} topic
                {filteredAndSortedTopics.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Topics list/grid */}
      {isLoading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <TopicCardSkeleton key={index} compact={compact} />
          ))}
        </div>
      ) : filteredAndSortedTopics.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery
              ? `No topics found matching "${searchQuery}"`
              : emptyMessage}
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {filteredAndSortedTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isSelected={selectedTopicId === topic.id}
              onSelect={onTopicSelect}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}
