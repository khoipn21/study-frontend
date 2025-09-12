var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const _ForumService = class _ForumService2 {
  static getInstance() {
    if (!_ForumService2.instance) {
      _ForumService2.instance = new _ForumService2();
    }
    return _ForumService2.instance;
  }
  constructor() {
  }
  async getPosts(params) {
    const { categoryId, courseId, search, sortBy = "recent", page = 1, limit = 20 } = params;
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy
      });
      if (categoryId) queryParams.append("categoryId", categoryId);
      if (courseId) queryParams.append("courseId", courseId);
      if (search) queryParams.append("search", search);
      const response = await fetch(`/api/v1/forum/posts?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      return this.getMockPosts(params);
    }
  }
  async getPost(id) {
    try {
      const response = await fetch(`/api/v1/forum/posts/${id}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return await response.json();
    } catch (error) {
      console.error("Error fetching post:", error);
      return this.getMockPost(id);
    }
  }
  async createPost(data) {
    try {
      const response = await fetch("/api/v1/forum/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create post");
      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }
  async createReply(data) {
    try {
      const response = await fetch("/api/v1/forum/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create reply");
      return await response.json();
    } catch (error) {
      console.error("Error creating reply:", error);
      throw error;
    }
  }
  async votePost(postId, vote) {
    try {
      const response = await fetch(`/api/v1/forum/posts/${postId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vote })
      });
      if (!response.ok) throw new Error("Failed to vote on post");
    } catch (error) {
      console.error("Error voting on post:", error);
      throw error;
    }
  }
  async voteReply(replyId, vote) {
    try {
      const response = await fetch(`/api/v1/forum/replies/${replyId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vote })
      });
      if (!response.ok) throw new Error("Failed to vote on reply");
    } catch (error) {
      console.error("Error voting on reply:", error);
      throw error;
    }
  }
  async acceptReply(replyId) {
    try {
      const response = await fetch(`/api/v1/forum/replies/${replyId}/accept`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to accept reply");
    } catch (error) {
      console.error("Error accepting reply:", error);
      throw error;
    }
  }
  async getCategories() {
    try {
      const response = await fetch("/api/v1/forum/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return this.getMockCategories();
    }
  }
  async getForumStats() {
    try {
      const response = await fetch("/api/v1/forum/stats");
      if (!response.ok) throw new Error("Failed to fetch forum stats");
      return await response.json();
    } catch (error) {
      console.error("Error fetching forum stats:", error);
      return this.getMockStats();
    }
  }
  getMockCategories() {
    return [
      {
        id: "1",
        name: "General Discussion",
        description: "General discussions about courses and learning",
        icon: "MessageSquare",
        color: "blue",
        postCount: 156
      },
      {
        id: "2",
        name: "Programming",
        description: "Coding questions and programming help",
        icon: "Code",
        color: "green",
        postCount: 243
      },
      {
        id: "3",
        name: "Design",
        description: "UI/UX design discussions and feedback",
        icon: "Palette",
        color: "purple",
        postCount: 89
      },
      {
        id: "4",
        name: "Career Advice",
        description: "Career guidance and job search tips",
        icon: "Briefcase",
        color: "orange",
        postCount: 67
      },
      {
        id: "5",
        name: "Study Groups",
        description: "Form study groups and find study partners",
        icon: "Users",
        color: "pink",
        postCount: 34
      }
    ];
  }
  getMockStats() {
    return {
      totalPosts: 589,
      totalReplies: 1247,
      totalUsers: 1834,
      mostActiveUsers: [
        {
          id: "1",
          username: "sarah_dev",
          avatar: "/avatars/sarah.jpg",
          role: "instructor",
          reputation: 2450,
          joinDate: "2023-01-15"
        },
        {
          id: "2",
          username: "alex_student",
          role: "student",
          reputation: 1280,
          joinDate: "2023-03-22"
        }
      ],
      recentPosts: []
    };
  }
  getMockPosts(params) {
    const mockPosts = [
      {
        id: "1",
        title: "Best practices for React state management?",
        content: "I'm working on a large React application and struggling with state management. What are the current best practices?",
        author: {
          id: "2",
          username: "alex_student",
          role: "student",
          reputation: 1280,
          joinDate: "2023-03-22"
        },
        category: this.getMockCategories()[1],
        tags: ["react", "state-management", "javascript"],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        views: 45,
        votes: 8,
        isLocked: false,
        isPinned: false,
        isSolved: false,
        replies: [],
        userVote: null
      }
    ];
    return { posts: mockPosts, total: mockPosts.length };
  }
  getMockPost(id) {
    return {
      id,
      title: "Best practices for React state management?",
      content: "I'm working on a large React application and struggling with state management. What are the current best practices? Should I use Redux, Zustand, or stick with React's built-in state management?",
      author: {
        id: "2",
        username: "alex_student",
        role: "student",
        reputation: 1280,
        joinDate: "2023-03-22"
      },
      category: this.getMockCategories()[1],
      tags: ["react", "state-management", "javascript"],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      views: 45,
      votes: 8,
      isLocked: false,
      isPinned: false,
      isSolved: false,
      replies: [
        {
          id: "1",
          content: "For large applications, I recommend Redux Toolkit. It provides excellent developer experience and scales well.",
          author: {
            id: "1",
            username: "sarah_dev",
            role: "instructor",
            reputation: 2450,
            joinDate: "2023-01-15"
          },
          postId: id,
          createdAt: "2024-01-15T11:15:00Z",
          updatedAt: "2024-01-15T11:15:00Z",
          votes: 12,
          isAccepted: true,
          userVote: null
        }
      ],
      userVote: null
    };
  }
};
__publicField(_ForumService, "instance");
let ForumService = _ForumService;
const forumService = ForumService.getInstance();

export { forumService as f };
//# sourceMappingURL=forum-De-B0kv7.mjs.map
