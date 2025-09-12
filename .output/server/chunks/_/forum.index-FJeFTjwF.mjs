import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { B as Button, c as cn, I as Input, f as formatDistanceToNow } from './ssr.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger } from './tabs-nVzR7rtM.mjs';
import { Plus, Filter, Users, Search, Clock, TrendingUp, MessageSquare, SortDesc, X, AlertCircle, Loader2, ThumbsUp, ThumbsDown, Pin, Lock, CheckCircle, Eye, Tag, User, Calendar } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from './dialog-5HmVNweK.mjs';
import { L as Label } from './label-DJNj9mF1.mjs';
import { T as Textarea } from './textarea-BwlHZp3V.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-BQyaqGxc.mjs';
import { f as forumService } from './forum-De-B0kv7.mjs';
import '@tanstack/react-query';
import '@tanstack/router-ssr-query-core';
import '@tanstack/react-devtools';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-dropdown-menu';
import '@tanstack/react-query-devtools';
import 'node:fs';
import 'tiny-invariant';
import 'tiny-warning';
import '@tanstack/router-core';
import '@tanstack/router-core/ssr/client';
import 'node:async_hooks';
import '@modelcontextprotocol/sdk/server/mcp.js';
import 'zod';
import '@modelcontextprotocol/sdk/server/streamableHttp.js';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';
import '@tanstack/react-router/ssr/server';
import '@radix-ui/react-tabs';
import '@radix-ui/react-dialog';
import '@radix-ui/react-label';
import '@radix-ui/react-select';

function ForumPostCard({
  post,
  variant = "default",
  showCategory = true,
  className
}) {
  const isCompact = variant === "compact";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "academic-card p-4 hover:shadow-md transition-shadow",
        isCompact && "p-3",
        className
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 min-w-[40px]", children: [
          /* @__PURE__ */ jsx("button", { className: "p-1 rounded hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ThumbsUp, { className: cn(
            "h-4 w-4",
            post.userVote === "up" ? "text-primary fill-current" : "text-muted-foreground"
          ) }) }),
          /* @__PURE__ */ jsx("span", { className: cn(
            "text-sm font-medium",
            post.votes > 0 ? "text-success" : post.votes < 0 ? "text-destructive" : "text-muted-foreground"
          ), children: post.votes }),
          /* @__PURE__ */ jsx("button", { className: "p-1 rounded hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ThumbsDown, { className: cn(
            "h-4 w-4",
            post.userVote === "down" ? "text-destructive fill-current" : "text-muted-foreground"
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              post.isPinned && /* @__PURE__ */ jsx(Pin, { className: "h-4 w-4 text-warning" }),
              post.isLocked && /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-muted-foreground" }),
              post.isSolved && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-success" }),
              showCategory && /* @__PURE__ */ jsx(
                "span",
                {
                  className: "px-2 py-1 rounded-full text-xs font-medium",
                  style: {
                    backgroundColor: `var(--color-${post.category.color}-100)`,
                    color: `var(--color-${post.category.color}-700)`
                  },
                  children: post.category.name
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { children: post.views })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { children: post.replies.length })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/forum/posts/$postId",
              params: { postId: post.id },
              className: "block group",
              children: /* @__PURE__ */ jsx("h3", { className: cn(
                "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2",
                isCompact ? "text-sm" : "text-base"
              ), children: post.title })
            }
          ),
          !isCompact && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2 line-clamp-2", children: post.content }),
          post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-2 flex-wrap", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3 text-muted-foreground" }),
            post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs",
                children: tag
              },
              tag
            )),
            post.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "+",
              post.tags.length - 3
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              post.author.avatar ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: post.author.avatar,
                  alt: post.author.username,
                  className: "h-5 w-5 rounded-full"
                }
              ) : /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: post.author.username }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "px-1.5 py-0.5 rounded text-xs font-medium",
                    post.author.role === "instructor" && "bg-primary/10 text-primary",
                    post.author.role === "admin" && "bg-destructive/10 text-destructive",
                    post.author.role === "student" && "bg-muted text-muted-foreground"
                  ),
                  children: post.author.role
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(post.createdAt)) })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function CreatePostModal({
  children,
  courseId,
  categoryId: defaultCategoryId,
  onSuccess
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: defaultCategoryId || "",
    tags: [],
    newTag: ""
  });
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);
  const loadCategories = async () => {
    try {
      const categoriesData = await forumService.getCategories();
      setCategories(categoriesData);
      if (!formData.categoryId && categoriesData.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: categoriesData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };
  const handleAddTag = () => {
    const tag = formData.newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTag: ""
      }));
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }
    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        courseId,
        tags: formData.tags
      };
      const post = await forumService.createPost(postData);
      setIsOpen(false);
      setFormData({
        title: "",
        content: "",
        categoryId: defaultCategoryId || "",
        tags: [],
        newTag: ""
      });
      onSuccess == null ? void 0 : onSuccess(post.id);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setError("");
    setFormData({
      title: "",
      content: "",
      categoryId: defaultCategoryId || "",
      tags: [],
      newTag: ""
    });
  };
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, onClick: () => setIsOpen(true), children }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-2xl", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5 text-primary" }),
          "Create New Post"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Start a new discussion or ask a question in the community forum" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              placeholder: "What's your question or topic?",
              value: formData.title,
              onChange: (e) => setFormData((prev) => ({ ...prev, title: e.target.value })),
              maxLength: 200,
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground text-right", children: [
            formData.title.length,
            "/200"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Category *" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.categoryId,
              onValueChange: (value) => setFormData((prev) => ({ ...prev, categoryId: value })),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a category" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: categories.map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category.id, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-3 h-3 rounded-full",
                      style: { backgroundColor: `var(--color-${category.color}-500)` }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: category.name })
                ] }) }, category.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "Content *" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "content",
              placeholder: "Describe your question or topic in detail...",
              value: formData.content,
              onChange: (e) => setFormData((prev) => ({ ...prev, content: e.target.value })),
              rows: 8,
              maxLength: 5e3,
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground text-right", children: [
            formData.content.length,
            "/5000"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tags (optional)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Add a tag...",
                value: formData.newTag,
                onChange: (e) => setFormData((prev) => ({ ...prev, newTag: e.target.value })),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                },
                maxLength: 20
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleAddTag,
                disabled: !formData.newTag.trim() || formData.tags.length >= 5,
                children: "Add"
              }
            )
          ] }),
          formData.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.tags.map((tag) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm",
              children: [
                tag,
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveTag(tag),
                    className: "hover:bg-primary/20 rounded-full p-0.5",
                    children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                  }
                )
              ]
            },
            tag
          )) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Add up to 5 tags to help others find your post. Press Enter or click Add to add each tag." })
        ] }),
        error && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: error })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleClose,
              disabled: isLoading,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: isLoading || !formData.title.trim() || !formData.content.trim(),
              children: [
                isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                isLoading ? "Creating..." : "Create Post"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ForumIndex() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    loadForumData();
  }, [selectedCategory, sortBy, searchQuery, currentPage]);
  const loadForumData = async () => {
    setIsLoading(true);
    try {
      const [postsData, categoriesData, statsData] = await Promise.all([forumService.getPosts({
        categoryId: selectedCategory === "all" ? void 0 : selectedCategory,
        search: searchQuery || void 0,
        sortBy,
        page: currentPage,
        limit: 20
      }), forumService.getCategories(), forumService.getForumStats()]);
      setPosts(postsData.posts);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading forum data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadForumData();
  };
  const handlePostCreated = (postId) => {
    loadForumData();
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b bg-card", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: "Community Forum" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Connect with fellow learners, ask questions, and share knowledge" })
        ] }),
        /* @__PURE__ */ jsx(CreatePostModal, { onSuccess: handlePostCreated, children: /* @__PURE__ */ jsxs(Button, { className: "gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "New Post"
        ] }) })
      ] }),
      stats && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-1", children: stats.totalPosts }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total Posts" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-1", children: stats.totalReplies }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Total Replies" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-1", children: stats.totalUsers }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Active Members" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary mb-1", children: categories.reduce((sum, cat) => sum + cat.postCount, 0) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "All Discussions" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
            "Categories"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }, className: cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors", selectedCategory === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"), children: "All Categories" }),
            categories.map((category) => /* @__PURE__ */ jsxs("button", { onClick: () => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }, className: cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between", selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"), children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: {
                  backgroundColor: `var(--color-${category.color}-500)`
                } }),
                /* @__PURE__ */ jsx("span", { children: category.name })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: category.postCount })
            ] }, category.id))
          ] })
        ] }),
        (stats == null ? void 0 : stats.mostActiveUsers) && stats.mostActiveUsers.length > 0 && /* @__PURE__ */ jsxs("div", { className: "academic-card p-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
            "Top Contributors"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: stats.mostActiveUsers.map((user, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary", children: index + 1 }),
            user.avatar ? /* @__PURE__ */ jsx("img", { src: user.avatar, alt: user.username, className: "w-6 h-6 rounded-full" }) : /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "h-3 w-3 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: user.username }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                user.reputation,
                " rep"
              ] })
            ] })
          ] }, user.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "academic-card p-4", children: [
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(Input, { placeholder: "Search posts...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", variant: "outline", children: "Search" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Tabs, { value: sortBy, onValueChange: (value) => {
              setSortBy(value);
              setCurrentPage(1);
            }, children: /* @__PURE__ */ jsxs(TabsList, { children: [
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "recent", className: "gap-2", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                "Recent"
              ] }),
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "popular", className: "gap-2", children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
                "Popular"
              ] }),
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "unanswered", className: "gap-2", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-3 w-3" }),
                "Unanswered"
              ] }),
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "solved", className: "gap-2", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-3 w-3" }),
                "Solved"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(SortDesc, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxs("span", { children: [
                posts.length,
                " posts"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 animate-pulse", children: [
          /* @__PURE__ */ jsx("div", { className: "h-6 bg-muted rounded mb-2" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded mb-2 w-3/4" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-1/2" })
        ] }, i)) }) : posts.length > 0 ? posts.map((post) => /* @__PURE__ */ jsx(ForumPostCard, { post, showCategory: selectedCategory === "all" }, post.id)) : /* @__PURE__ */ jsxs("div", { className: "academic-card p-8 text-center", children: [
          /* @__PURE__ */ jsx(MessageSquare, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "No posts found" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: searchQuery ? "Try adjusting your search terms or filters" : "Be the first to start a discussion in this category!" }),
          /* @__PURE__ */ jsx(CreatePostModal, { categoryId: selectedCategory === "all" ? void 0 : selectedCategory, onSuccess: handlePostCreated, children: /* @__PURE__ */ jsxs(Button, { children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Create First Post"
          ] }) })
        ] }) }),
        posts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)), disabled: currentPage === 1, children: "Previous" }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center px-4 text-sm text-muted-foreground", children: [
            "Page ",
            currentPage
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setCurrentPage((prev) => prev + 1), disabled: posts.length < 20, children: "Next" })
        ] })
      ] })
    ] }) })
  ] });
}

export { ForumIndex as component };
//# sourceMappingURL=forum.index-FJeFTjwF.mjs.map
