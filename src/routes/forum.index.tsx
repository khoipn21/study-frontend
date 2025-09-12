import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Filter,
  SortDesc,
} from 'lucide-react'
import { ForumPostCard } from '@/components/forum/ForumPostCard'
import { CreatePostModal } from '@/components/forum/CreatePostModal'
import {
  forumService,
  type ForumPost,
  type ForumCategory,
  type ForumStats,
} from '@/lib/forum'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/forum/')({
  component: ForumIndex,
})

function ForumIndex() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [stats, setStats] = useState<ForumStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered' | 'solved'>('recent')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadForumData()
  }, [selectedCategory, sortBy, searchQuery, currentPage])

  const loadForumData = async () => {
    setIsLoading(true)
    try {
      const [postsData, categoriesData, statsData] = await Promise.all([
        forumService.getPosts({
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sortBy,
          page: currentPage,
          limit: 20,
        }),
        forumService.getCategories(),
        forumService.getForumStats(),
      ])

      setPosts(postsData.posts)
      setCategories(categoriesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading forum data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadForumData()
  }

  const handlePostCreated = (postId: string) => {
    loadForumData()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Community Forum</h1>
              <p className="text-muted-foreground">
                Connect with fellow learners, ask questions, and share knowledge
              </p>
            </div>
            
            <CreatePostModal onSuccess={handlePostCreated}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </CreatePostModal>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="academic-card p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
              <div className="academic-card p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalReplies}</div>
                <div className="text-sm text-muted-foreground">Total Replies</div>
              </div>
              <div className="academic-card p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="academic-card p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">All Discussions</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="academic-card p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setCurrentPage(1)
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `var(--color-${category.color}-500)` }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs">{category.postCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Most Active Users */}
            {stats?.mostActiveUsers && stats.mostActiveUsers.length > 0 && (
              <div className="academic-card p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {stats.mostActiveUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.reputation} rep</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="academic-card p-4">
              <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>

              <div className="flex items-center justify-between">
                <Tabs
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value as typeof sortBy)
                    setCurrentPage(1)
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="recent" className="gap-2">
                      <Clock className="h-3 w-3" />
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="popular" className="gap-2">
                      <TrendingUp className="h-3 w-3" />
                      Popular
                    </TabsTrigger>
                    <TabsTrigger value="unanswered" className="gap-2">
                      <MessageSquare className="h-3 w-3" />
                      Unanswered
                    </TabsTrigger>
                    <TabsTrigger value="solved" className="gap-2">
                      <MessageSquare className="h-3 w-3" />
                      Solved
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SortDesc className="h-4 w-4" />
                  <span>{posts.length} posts</span>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="academic-card p-4 animate-pulse">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <ForumPostCard key={post.id} post={post} showCategory={selectedCategory === 'all'} />
                ))
              ) : (
                <div className="academic-card p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try adjusting your search terms or filters"
                      : "Be the first to start a discussion in this category!"}
                  </p>
                  <CreatePostModal
                    categoryId={selectedCategory === 'all' ? undefined : selectedCategory}
                    onSuccess={handlePostCreated}
                  >
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </CreatePostModal>
                </div>
              )}
            </div>

            {/* Pagination */}
            {posts.length > 0 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={posts.length < 20}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
