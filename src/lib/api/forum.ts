// Forum API client for connecting to the backend
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/forum`

export interface Topic {
  id: string
  title: string
  content?: string
  description?: string // Backend uses 'description' instead of 'content'
  category: string
  courseId?: string
  course_id?: string // Backend snake_case
  created_by_id?: string // Backend field
  author?: {
    id: string
    name: string
    avatar?: string
    role: 'student' | 'instructor' | 'admin'
  }
  createdAt: string
  created_at?: string // Backend snake_case
  updatedAt: string
  updated_at?: string // Backend snake_case
  status: 'pending' | 'approved' | 'rejected'
  viewCount: number
  view_count?: number // Backend snake_case
  postCount: number
  post_count?: number // Backend snake_case
  isPinned: boolean
  is_sticky?: boolean // Backend field name
  isLocked: boolean
  is_locked?: boolean // Backend field name
  pinOrder?: number
  pin_order?: number // Backend snake_case
  tags: Array<string>
  lastReply?: {
    authorName: string
    timestamp: string
  }
}

export interface Post {
  id: string
  topicId: string
  content: string
  author: {
    id: string
    name?: string
    username: string
    avatar?: string | null
    role: string
  }
  createdAt: string
  updatedAt: string
  status: 'pending' | 'approved' | 'rejected'
  isAnswer: boolean
  isPinned: boolean
  pinOrder?: number
  voteCount: number
  userVote?: 'up' | 'down' | null
}

export interface CreateTopicRequest {
  title: string
  content: string
  category: string
  courseId?: string
  tags: Array<string>
}

export interface CreatePostRequest {
  content: string
}

export interface TopicsResponse {
  topics: Array<Topic>
  total: number
  page: number
  limit: number
}

class ForumApi {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Topics
  async getTopics(params?: {
    page?: number
    limit?: number
    category?: string
    courseId?: string
    status?: string
  }): Promise<TopicsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.courseId) searchParams.set('courseId', params.courseId)
    if (params?.status) searchParams.set('status', params.status)

    const query = searchParams.toString()
    return this.request<TopicsResponse>(`/topics${query ? `?${query}` : ''}`)
  }

  async getTopic(topicId: string): Promise<Topic> {
    return this.request<Topic>(`/topics/${topicId}`)
  }

  async createTopic(
    data: CreateTopicRequest,
    authToken?: string,
  ): Promise<Topic> {
    // Map frontend 'content' to backend 'description'
    const backendData = {
      title: data.title,
      description: data.content,
      category: data.category,
      course_id: data.courseId,
      tags: data.tags,
    }

    return this.request<Topic>('/topics', {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(backendData),
    })
  }

  async updateTopic(
    topicId: string,
    data: Partial<CreateTopicRequest>,
    authToken?: string,
  ): Promise<Topic> {
    return this.request<Topic>(`/topics/${topicId}`, {
      method: 'PUT',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(data),
    })
  }

  async deleteTopic(topicId: string, authToken?: string): Promise<void> {
    return this.request<void>(`/topics/${topicId}`, {
      method: 'DELETE',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
  }

  // Posts
  async getPosts(
    topicId: string,
    params?: {
      page?: number
      limit?: number
    },
  ): Promise<{ posts: Array<Post>; total: number }> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request<{ posts: Array<Post>; total: number }>(
      `/topics/${topicId}/posts${query ? `?${query}` : ''}`,
    )
  }

  async createPost(
    topicId: string,
    data: CreatePostRequest,
    authToken?: string,
  ): Promise<Post> {
    return this.request<Post>(`/topics/${topicId}/posts`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(data),
    })
  }

  async updatePost(
    postId: string,
    data: Partial<CreatePostRequest>,
    authToken?: string,
  ): Promise<Post> {
    return this.request<Post>(`/posts/${postId}`, {
      method: 'PUT',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(data),
    })
  }

  async deletePost(postId: string, authToken?: string): Promise<void> {
    return this.request<void>(`/posts/${postId}`, {
      method: 'DELETE',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
  }

  // Approval System (requires auth)
  async getPendingTopics(authToken: string): Promise<{ topics: Array<Topic> }> {
    return this.request<{ topics: Array<Topic> }>('/pending/topics', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  async approveTopic(topicId: string, authToken: string): Promise<void> {
    return this.request<void>(`/topics/${topicId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id: topicId, status: 'approved' }),
    })
  }

  async rejectTopic(topicId: string, authToken: string): Promise<void> {
    return this.request<void>(`/topics/${topicId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id: topicId, status: 'rejected' }),
    })
  }

  async approvePost(postId: string, authToken: string): Promise<void> {
    return this.request<void>(`/posts/${postId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id: postId, status: 'approved' }),
    })
  }

  async rejectPost(postId: string, authToken: string): Promise<void> {
    return this.request<void>(`/posts/${postId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id: postId, status: 'rejected' }),
    })
  }

  // Pin Management (requires auth)
  async setTopicPinOrder(
    topicId: string,
    pinOrder: number,
    authToken: string,
  ): Promise<void> {
    return this.request<void>(`/topics/${topicId}/pin-order`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ pinOrder }),
    })
  }

  async setPostPinOrder(
    postId: string,
    pinOrder: number,
    authToken: string,
  ): Promise<void> {
    return this.request<void>(`/posts/${postId}/pin-order`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ pinOrder }),
    })
  }

  // Voting
  async votePost(
    postId: string,
    voteType: 'up' | 'down',
    authToken?: string,
  ): Promise<void> {
    return this.request<void>('/votes', {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify({ post_id: postId, vote_type: voteType }),
    })
  }

  async removeVote(postId: string, authToken?: string): Promise<void> {
    return this.request<void>(`/posts/${postId}/vote`, {
      method: 'DELETE',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
  }

  // Pin Post (instructor/admin only)
  async togglePinPost(postId: string, authToken: string): Promise<Post> {
    return this.request<Post>(`/posts/${postId}/pin`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  // Create post/reply with new endpoint format
  async createPostNew(
    data: {
      topicId: string
      content: string
      parentId?: string
    },
    authToken: string,
  ): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        topic_id: data.topicId,
        content: data.content,
        parent_id: data.parentId,
      }),
    })
  }
}

// Export singleton instance
export const forumApi = new ForumApi()

// Export for direct usage if needed
export default forumApi
