import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { h as Route$8, u as useAuth, B as Button, c as cn, f as formatDistanceToNow } from './ssr.mjs';
import { T as Textarea } from './textarea-BwlHZp3V.mjs';
import { MessageSquare, ArrowLeft, ThumbsUp, ThumbsDown, Pin, Lock, CheckCircle, Eye, Tag, User, Calendar, Send, Reply } from 'lucide-react';
import { f as forumService } from './forum-De-B0kv7.mjs';
import '@tanstack/react-router';
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

function PostDetail() {
  const {
    postId
  } = Route$8.useParams();
  const {
    user
  } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  useEffect(() => {
    loadPost();
  }, [postId]);
  const loadPost = async () => {
    setIsLoading(true);
    try {
      const postData = await forumService.getPost(postId);
      if (postData) {
        setPost(postData);
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVotePost = async (vote) => {
    if (!post) return;
    try {
      await forumService.votePost(post.id, vote);
      setPost((prev) => {
        if (!prev) return null;
        let newVotes = prev.votes;
        let newUserVote = vote;
        if (prev.userVote === vote) {
          newUserVote = null;
          newVotes = prev.userVote === "up" ? prev.votes - 1 : prev.votes + 1;
        } else if (prev.userVote) {
          newVotes = prev.userVote === "up" ? prev.votes - 2 : prev.votes + 2;
        } else {
          newVotes = vote === "up" ? prev.votes + 1 : prev.votes - 1;
        }
        return {
          ...prev,
          votes: newVotes,
          userVote: newUserVote
        };
      });
    } catch (error) {
      console.error("Error voting on post:", error);
    }
  };
  const handleVoteReply = async (replyId, vote) => {
    if (!post) return;
    try {
      await forumService.voteReply(replyId, vote);
      setPost((prev) => {
        if (!prev) return null;
        const updateReplyVotes = (replies) => {
          return replies.map((reply) => {
            if (reply.id === replyId) {
              let newVotes = reply.votes;
              let newUserVote = vote;
              if (reply.userVote === vote) {
                newUserVote = null;
                newVotes = reply.userVote === "up" ? reply.votes - 1 : reply.votes + 1;
              } else if (reply.userVote) {
                newVotes = reply.userVote === "up" ? reply.votes - 2 : reply.votes + 2;
              } else {
                newVotes = vote === "up" ? reply.votes + 1 : reply.votes - 1;
              }
              return {
                ...reply,
                votes: newVotes,
                userVote: newUserVote
              };
            }
            if (reply.replies) {
              return {
                ...reply,
                replies: updateReplyVotes(reply.replies)
              };
            }
            return reply;
          });
        };
        return {
          ...prev,
          replies: updateReplyVotes(prev.replies)
        };
      });
    } catch (error) {
      console.error("Error voting on reply:", error);
    }
  };
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !post || !user) return;
    setIsSubmittingReply(true);
    try {
      const replyData = {
        content: replyContent.trim(),
        postId: post.id,
        parentId: replyingTo || void 0
      };
      const newReply = await forumService.createReply(replyData);
      setPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          replies: [...prev.replies, newReply]
        };
      });
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };
  const handleAcceptReply = async (replyId) => {
    try {
      await forumService.acceptReply(replyId);
      setPost((prev) => {
        if (!prev) return null;
        const updateReplyAcceptance = (replies) => {
          return replies.map((reply) => ({
            ...reply,
            isAccepted: reply.id === replyId,
            replies: reply.replies ? updateReplyAcceptance(reply.replies) : void 0
          }));
        };
        return {
          ...prev,
          isSolved: true,
          replies: updateReplyAcceptance(prev.replies)
        };
      });
    } catch (error) {
      console.error("Error accepting reply:", error);
    }
  };
  const ReplyComponent = ({
    reply,
    depth = 0
  }) => /* @__PURE__ */ jsx("div", { className: cn("border-l-2 border-muted", depth > 0 && "ml-6"), children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-4 ml-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 min-w-[30px]", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => handleVoteReply(reply.id, "up"), className: "p-1 rounded hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ThumbsUp, { className: cn("h-3 w-3", reply.userVote === "up" ? "text-primary fill-current" : "text-muted-foreground") }) }),
        /* @__PURE__ */ jsx("span", { className: cn("text-xs font-medium", reply.votes > 0 ? "text-success" : reply.votes < 0 ? "text-destructive" : "text-muted-foreground"), children: reply.votes }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleVoteReply(reply.id, "down"), className: "p-1 rounded hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ThumbsDown, { className: cn("h-3 w-3", reply.userVote === "down" ? "text-destructive fill-current" : "text-muted-foreground") }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        reply.isAccepted && /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-success", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Accepted Answer" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none mb-3", children: /* @__PURE__ */ jsx("p", { children: reply.content }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            reply.author.avatar ? /* @__PURE__ */ jsx("img", { src: reply.author.avatar, alt: reply.author.username, className: "h-4 w-4 rounded-full" }) : /* @__PURE__ */ jsx(User, { className: "h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: reply.author.username }),
            /* @__PURE__ */ jsx("span", { className: cn("px-1.5 py-0.5 rounded text-xs font-medium", reply.author.role === "instructor" && "bg-primary/10 text-primary", reply.author.role === "admin" && "bg-destructive/10 text-destructive", reply.author.role === "student" && "bg-muted text-muted-foreground"), children: reply.author.role }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(reply.createdAt)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            user && (post == null ? void 0 : post.author.id) === user.id && !reply.isAccepted && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleAcceptReply(reply.id), children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 mr-1" }),
              "Accept"
            ] }),
            /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "ghost", onClick: () => setReplyingTo(reply.id), children: [
              /* @__PURE__ */ jsx(Reply, { className: "h-3 w-3 mr-1" }),
              "Reply"
            ] })
          ] })
        ] })
      ] })
    ] }),
    reply.replies && reply.replies.map((childReply) => /* @__PURE__ */ jsx(ReplyComponent, { reply: childReply, depth: depth + 1 }, childReply.id))
  ] }) });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-muted rounded w-1/4" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-3/4" }),
      /* @__PURE__ */ jsx("div", { className: "h-64 bg-muted rounded" })
    ] }) }) });
  }
  if (!post) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-8 text-center", children: [
      /* @__PURE__ */ jsx(MessageSquare, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Post not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "The post you're looking for doesn't exist or has been removed." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "gap-2", onClick: () => window.history.back(), children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to Forum"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "academic-card p-6 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 min-w-[60px]", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => handleVotePost("up"), className: "p-2 rounded hover:bg-muted transition-colors", disabled: !user, children: /* @__PURE__ */ jsx(ThumbsUp, { className: cn("h-6 w-6", post.userVote === "up" ? "text-primary fill-current" : "text-muted-foreground") }) }),
        /* @__PURE__ */ jsx("span", { className: cn("text-xl font-bold", post.votes > 0 ? "text-success" : post.votes < 0 ? "text-destructive" : "text-muted-foreground"), children: post.votes }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleVotePost("down"), className: "p-2 rounded hover:bg-muted transition-colors", disabled: !user, children: /* @__PURE__ */ jsx(ThumbsDown, { className: cn("h-6 w-6", post.userVote === "down" ? "text-destructive fill-current" : "text-muted-foreground") }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            post.isPinned && /* @__PURE__ */ jsx(Pin, { className: "h-5 w-5 text-warning" }),
            post.isLocked && /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }),
            post.isSolved && /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-success" }),
            /* @__PURE__ */ jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium", style: {
              backgroundColor: `var(--color-${post.category.color}-100)`,
              color: `var(--color-${post.category.color}-700)`
            }, children: post.category.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxs("span", { children: [
                post.views,
                " views"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxs("span", { children: [
                post.replies.length,
                " replies"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-4", children: post.title }),
        /* @__PURE__ */ jsx("div", { className: "prose prose-lg max-w-none mb-6", children: /* @__PURE__ */ jsx("p", { children: post.content }) }),
        post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 flex-wrap", children: [
          /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4 text-muted-foreground" }),
          post.tags.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-muted text-muted-foreground rounded text-sm", children: tag }, tag))
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          post.author.avatar ? /* @__PURE__ */ jsx("img", { src: post.author.avatar, alt: post.author.username, className: "h-8 w-8 rounded-full" }) : /* @__PURE__ */ jsx(User, { className: "h-6 w-6 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: post.author.username }),
              /* @__PURE__ */ jsx("span", { className: cn("px-2 py-1 rounded text-xs font-medium", post.author.role === "instructor" && "bg-primary/10 text-primary", post.author.role === "admin" && "bg-destructive/10 text-destructive", post.author.role === "student" && "bg-muted text-muted-foreground"), children: post.author.role })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(post.createdAt)) })
            ] })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold", children: [
        post.replies.length,
        " ",
        post.replies.length === 1 ? "Reply" : "Replies"
      ] }) }),
      post.replies.map((reply) => /* @__PURE__ */ jsx(ReplyComponent, { reply }, reply.id)),
      user && !post.isLocked && /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Your Reply" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitReply, className: "space-y-4", children: [
          /* @__PURE__ */ jsx(Textarea, { placeholder: "Share your thoughts, answer the question, or contribute to the discussion...", value: replyContent, onChange: (e) => setReplyContent(e.target.value), rows: 6, maxLength: 5e3, required: true }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              replyContent.length,
              "/5000 characters"
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSubmittingReply || !replyContent.trim(), children: [
              isSubmittingReply ? /* @__PURE__ */ jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" }) : /* @__PURE__ */ jsx(Send, { className: "h-4 w-4 mr-2" }),
              isSubmittingReply ? "Posting..." : "Post Reply"
            ] })
          ] })
        ] })
      ] }),
      !user && /* @__PURE__ */ jsxs("div", { className: "academic-card p-6 text-center", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "h-8 w-8 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Join the Discussion" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Log in to reply to this post and engage with the community." }),
        /* @__PURE__ */ jsx(Button, { children: "Sign In" })
      ] })
    ] })
  ] }) });
}

export { PostDetail as component };
//# sourceMappingURL=forum.posts._postId-BYfaL_HC.mjs.map
