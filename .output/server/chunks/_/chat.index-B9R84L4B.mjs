import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import { c as cn, B as Button, I as Input, f as formatDistanceToNow, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, d as DropdownMenuItem } from './ssr.mjs';
import { Bot, MoreVertical, Plus, Search, BookOpen, MessageSquare, Clock, Edit3, Trash2, Sparkles, Play, Loader2, Send, User, ExternalLink, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { T as Textarea } from './textarea-BwlHZp3V.mjs';
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function ChatMessage({
  message,
  onCopy,
  onFeedback,
  onSuggestionClick
}) {
  var _a, _b, _c;
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy == null ? void 0 : onCopy(message.content);
  };
  const formatContent = (content) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("```")) {
        return null;
      }
      if (line.startsWith("\u2022 ")) {
        return /* @__PURE__ */ jsx("li", { className: "ml-4 list-disc", children: line.substring(2) }, index);
      }
      if (line.includes("**")) {
        const parts = line.split("**");
        return /* @__PURE__ */ jsx("p", { className: "mb-2", children: parts.map(
          (part, partIndex) => partIndex % 2 === 1 ? /* @__PURE__ */ jsx("strong", { children: part }, partIndex) : part
        ) }, index);
      }
      return line.trim() ? /* @__PURE__ */ jsx("p", { className: "mb-2", children: line }, index) : /* @__PURE__ */ jsx("br", {}, index);
    }).filter(Boolean);
  };
  const extractCodeBlocks = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks2 = [];
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks2.push({
        language: match[1] || "text",
        code: match[2].trim()
      });
    }
    return codeBlocks2;
  };
  const contentWithoutCodeBlocks = message.content.replace(/```(\w+)?\n([\s\S]*?)```/g, "[CODE_BLOCK]");
  const codeBlocks = extractCodeBlocks(message.content);
  let codeBlockIndex = 0;
  if (isSystem) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center my-4", children: /* @__PURE__ */ jsx("div", { className: "px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground", children: message.content }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "flex gap-3 p-4",
    isUser && "flex-row-reverse bg-muted/30",
    isAssistant && "bg-background"
  ), children: [
    /* @__PURE__ */ jsx("div", { className: cn(
      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
      isUser && "bg-primary text-primary-foreground",
      isAssistant && "bg-secondary text-secondary-foreground"
    ), children: isUser ? /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: cn(
      "flex-1 space-y-2",
      isUser && "text-right"
    ), children: [
      /* @__PURE__ */ jsx("div", { className: cn(
        "inline-block max-w-[80%] rounded-lg px-4 py-2",
        isUser && "bg-primary text-primary-foreground ml-auto",
        isAssistant && "bg-card border"
      ), children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none", children: formatContent(contentWithoutCodeBlocks).map((element, index) => {
        if (element === "[CODE_BLOCK]" && codeBlocks[codeBlockIndex]) {
          const codeBlock = codeBlocks[codeBlockIndex++];
          return /* @__PURE__ */ jsxs("div", { className: "my-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-muted px-3 py-1 rounded-t-lg", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: codeBlock.language }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => navigator.clipboard.writeText(codeBlock.code),
                  className: "h-6 w-6 p-0",
                  children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("pre", { className: "bg-muted/50 p-3 rounded-b-lg overflow-x-auto", children: /* @__PURE__ */ jsx("code", { className: "text-sm", children: codeBlock.code }) })
          ] }, index);
        }
        return element;
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: cn(
        "flex items-center gap-2 text-xs text-muted-foreground",
        isUser && "justify-end"
      ), children: [
        /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(message.timestamp)) }),
        isAssistant && ((_a = message.metadata) == null ? void 0 : _a.confidence) && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-muted rounded", children: [
          Math.round(message.metadata.confidence * 100),
          "% confident"
        ] })
      ] }),
      isAssistant && ((_b = message.metadata) == null ? void 0 : _b.sources) && message.metadata.sources.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Sources:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: message.metadata.sources.map((source, index) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: source.url,
            className: "inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors",
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: source.title })
            ]
          },
          index
        )) })
      ] }),
      isAssistant && ((_c = message.metadata) == null ? void 0 : _c.suggestions) && message.metadata.suggestions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Ask me:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: message.metadata.suggestions.map((suggestion, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onSuggestionClick == null ? void 0 : onSuggestionClick(suggestion),
            className: "px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs hover:bg-secondary/80 transition-colors",
            children: suggestion
          },
          index
        )) })
      ] }),
      !isUser && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: handleCopy,
            className: "h-6 px-2 text-xs",
            children: [
              /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 mr-1" }),
              "Copy"
            ]
          }
        ),
        onFeedback && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: () => onFeedback(message.id, "up"),
              className: "h-6 px-2 text-xs",
              children: /* @__PURE__ */ jsx(ThumbsUp, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: () => onFeedback(message.id, "down"),
              className: "h-6 px-2 text-xs",
              children: /* @__PURE__ */ jsx(ThumbsDown, { className: "h-3 w-3" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const _AIChatService = class _AIChatService2 {
  static getInstance() {
    if (!_AIChatService2.instance) {
      _AIChatService2.instance = new _AIChatService2();
    }
    return _AIChatService2.instance;
  }
  constructor() {
  }
  async sendMessage(request) {
    try {
      const response = await fetch("/api/v1/ai-chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error sending message:", error);
      return this.getMockResponse(request.message, request.context);
    }
  }
  async getSessions(courseId) {
    try {
      const queryParams = new URLSearchParams();
      if (courseId) queryParams.append("courseId", courseId);
      const response = await fetch(`/api/v1/ai-chat/sessions?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return await response.json();
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return this.getMockSessions(courseId);
    }
  }
  async getSession(sessionId) {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch session");
      return await response.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      return this.getMockSession(sessionId);
    }
  }
  async createSession(context) {
    try {
      const response = await fetch("/api/v1/ai-chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ context })
      });
      if (!response.ok) throw new Error("Failed to create session");
      return await response.json();
    } catch (error) {
      console.error("Error creating session:", error);
      return this.createMockSession(context);
    }
  }
  async deleteSession(sessionId) {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete session");
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }
  async updateSessionTitle(sessionId, title) {
    try {
      const response = await fetch(`/api/v1/ai-chat/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error("Failed to update session title");
    } catch (error) {
      console.error("Error updating session title:", error);
    }
  }
  async getCourseSuggestions(courseId) {
    try {
      const response = await fetch(`/api/v1/ai-chat/suggestions/course/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error("Error fetching course suggestions:", error);
      return this.getMockSuggestions(courseId);
    }
  }
  async getLectureSuggestions(lectureId) {
    try {
      const response = await fetch(`/api/v1/ai-chat/suggestions/lecture/${lectureId}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error("Error fetching lecture suggestions:", error);
      return this.getMockSuggestions("lecture");
    }
  }
  // Mock methods for development/fallback
  getMockResponse(userMessage, context) {
    const responses = [
      "I understand you're asking about this topic. Let me help break it down for you.",
      "That's a great question! Here's what I can tell you about this concept:",
      "Based on your current course progress, here's some additional context that might help:",
      "Let me provide some examples to illustrate this point better:",
      "I see you're working through this challenge. Here are some approaches you could try:"
    ];
    const mockSources = (context == null ? void 0 : context.courseId) ? [
      {
        title: "Course Lecture 3: Key Concepts",
        url: `/courses/${context.courseId}/lectures/3`,
        type: "lecture"
      },
      {
        title: "Related Forum Discussion",
        url: "/forum/posts/123",
        type: "forum"
      }
    ] : [];
    const mockSuggestions = [
      "Can you explain this concept with more examples?",
      "What are the common pitfalls to avoid here?",
      "How does this relate to other topics in the course?"
    ];
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: `${responses[Math.floor(Math.random() * responses.length)]}

${this.generateContextualResponse(userMessage, context)}`,
      role: "assistant",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      courseId: context == null ? void 0 : context.courseId,
      lectureId: context == null ? void 0 : context.lectureId,
      metadata: {
        sources: mockSources,
        confidence: 0.85 + Math.random() * 0.15,
        suggestions: mockSuggestions
      }
    };
  }
  generateContextualResponse(userMessage, context) {
    const message = userMessage.toLowerCase();
    if (message.includes("explain") || message.includes("what is")) {
      return "This concept is fundamental to understanding the broader topic. Here are the key points:\n\n\u2022 **Definition**: The core principle involves...\n\u2022 **Application**: You'll typically use this when...\n\u2022 **Best Practices**: Remember to always...";
    }
    if (message.includes("example") || message.includes("show me")) {
      return "Here's a practical example:\n\n```javascript\nfunction example() {\n  // This demonstrates the concept\n  return 'Hello, World!'\n}\n```\n\nThis example shows how to...";
    }
    if (message.includes("error") || message.includes("problem") || message.includes("bug")) {
      return "Let's troubleshoot this step by step:\n\n1. **Check the basics**: Ensure you have...\n2. **Common causes**: This issue often happens when...\n3. **Solution**: Try this approach...\n\nIf you're still having issues, can you share your code?";
    }
    if (message.includes("difference") || message.includes("vs") || message.includes("compare")) {
      return "Great question! Here's a comparison:\n\n**Option A**:\n\u2022 Pros: Fast, simple, widely supported\n\u2022 Cons: Limited flexibility\n\u2022 Use when: You need quick results\n\n**Option B**:\n\u2022 Pros: More flexible, powerful features\n\u2022 Cons: Steeper learning curve\n\u2022 Use when: You need advanced functionality";
    }
    return "I'd be happy to help you understand this better. Could you provide more specific details about what you'd like to know?";
  }
  getMockSessions(courseId) {
    const baseSessions = [
      {
        id: "session_1",
        title: "Understanding React Hooks",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T11:45:00Z",
        courseId: "react-course",
        messages: []
      },
      {
        id: "session_2",
        title: "JavaScript Array Methods",
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
        courseId: "js-fundamentals",
        messages: []
      },
      {
        id: "session_3",
        title: "General Programming Questions",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:45:00Z",
        messages: []
      }
    ];
    return courseId ? baseSessions.filter((session) => session.courseId === courseId) : baseSessions;
  }
  getMockSession(sessionId) {
    const sessions = this.getMockSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return null;
    return {
      ...session,
      messages: [
        {
          id: "msg_1",
          content: "Hello! How can I help you today?",
          role: "assistant",
          timestamp: session.createdAt
        },
        {
          id: "msg_2",
          content: "I have a question about React hooks",
          role: "user",
          timestamp: "2024-01-15T10:35:00Z"
        },
        {
          id: "msg_3",
          content: "React hooks are functions that let you use state and other React features in functional components. The most commonly used hooks are useState and useEffect. Would you like me to explain how they work?",
          role: "assistant",
          timestamp: "2024-01-15T10:36:00Z",
          metadata: {
            confidence: 0.92,
            sources: [
              {
                title: "React Hooks Documentation",
                url: "https://reactjs.org/docs/hooks-intro.html",
                type: "documentation"
              }
            ],
            suggestions: [
              "Can you show me examples of useState?",
              "How do I use useEffect?",
              "What are the rules of hooks?"
            ]
          }
        }
      ]
    };
  }
  createMockSession(context) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return {
      id: sessionId,
      title: "New Chat Session",
      messages: [
        {
          id: `msg_${Date.now()}`,
          content: (context == null ? void 0 : context.courseId) ? "Hello! I'm here to help you with your course. What would you like to know?" : "Hello! I'm your AI tutor. How can I assist you today?",
          role: "assistant",
          timestamp: now,
          courseId: context == null ? void 0 : context.courseId,
          lectureId: context == null ? void 0 : context.lectureId
        }
      ],
      createdAt: now,
      updatedAt: now,
      courseId: context == null ? void 0 : context.courseId,
      lectureId: context == null ? void 0 : context.lectureId
    };
  }
  getMockSuggestions(contextType) {
    const suggestions = {
      "react-course": [
        "How do React hooks work?",
        "What is the difference between props and state?",
        "How do I handle forms in React?",
        "Can you explain the component lifecycle?"
      ],
      "js-fundamentals": [
        "What are arrow functions?",
        "How do promises work?",
        "Explain async/await",
        "What is the difference between let, const, and var?"
      ],
      lecture: [
        "Can you summarize this lecture?",
        "What are the key takeaways?",
        "I need help with the practice exercises",
        "How does this relate to previous topics?"
      ],
      default: [
        "Help me understand this concept",
        "Can you provide more examples?",
        "What should I study next?",
        "I'm having trouble with..."
      ]
    };
    return suggestions[contextType] || suggestions.default;
  }
};
__publicField(_AIChatService, "instance");
let AIChatService = _AIChatService;
const aiChatService = AIChatService.getInstance();
function ChatInterface({
  context,
  className,
  embedded = false,
  height = "h-96"
}) {
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    initializeChat();
  }, [context]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    loadSuggestions();
  }, [context]);
  const scrollToBottom = () => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  const initializeChat = async () => {
    try {
      const session = await aiChatService.createSession(context);
      setCurrentSession(session);
      setMessages(session.messages);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };
  const loadSuggestions = async () => {
    if (!context) return;
    try {
      let suggestions2 = [];
      if (context.courseId) {
        suggestions2 = await aiChatService.getCourseSuggestions(context.courseId);
      } else if (context.lectureId) {
        suggestions2 = await aiChatService.getLectureSuggestions(context.lectureId);
      }
      setSuggestions(suggestions2);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  };
  const handleSendMessage = async (messageContent) => {
    const content = messageContent || inputValue.trim();
    if (!content || !currentSession) return;
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      content,
      role: "user",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      courseId: context == null ? void 0 : context.courseId,
      lectureId: context == null ? void 0 : context.lectureId
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const aiResponse = await aiChatService.sendMessage({
        message: content,
        context,
        sessionId: currentSession.id
      });
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSuggestionClick = (suggestion) => {
    var _a;
    setInputValue(suggestion);
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const handleCopy = () => {
  };
  const handleFeedback = (messageId, feedback) => {
    console.log(`Feedback for ${messageId}: ${feedback}`);
  };
  const quickActions = [
    {
      icon: BookOpen,
      label: "Explain this topic",
      action: () => handleSendMessage("Can you explain this topic in detail?")
    },
    {
      icon: Play,
      label: "Show examples",
      action: () => handleSendMessage("Can you show me some practical examples?")
    },
    {
      icon: MessageSquare,
      label: "Ask a question",
      action: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "flex flex-col bg-background border rounded-lg",
    embedded ? "shadow-sm" : "shadow-lg",
    className
  ), children: [
    !embedded && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "AI Tutor" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: (context == null ? void 0 : context.courseId) ? "Course Assistant" : (context == null ? void 0 : context.lectureId) ? "Lecture Helper" : "General Study Assistant" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-success rounded-full animate-pulse" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Online" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn(
      "flex-1 overflow-y-auto",
      height,
      embedded && "min-h-0"
    ), children: [
      messages.length <= 1 && /* @__PURE__ */ jsxs("div", { className: "p-6 text-center space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-2", children: (context == null ? void 0 : context.courseId) ? "Course AI Assistant" : "AI Tutor Ready to Help" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-md mx-auto", children: "I'm here to help you understand concepts, answer questions, and guide your learning journey. Ask me anything!" })
        ] }),
        !embedded && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center pt-4", children: quickActions.map((action, index) => {
          const Icon = action.icon;
          return /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: action.action,
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
                action.label
              ]
            },
            index
          );
        }) }),
        suggestions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Popular questions:" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: suggestions.slice(0, 4).map((suggestion, index) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSuggestionClick(suggestion),
              className: "px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors text-left max-w-48",
              children: suggestion
            },
            index
          )) })
        ] })
      ] }),
      messages.map((message) => /* @__PURE__ */ jsx(
        ChatMessage,
        {
          message,
          onCopy: handleCopy,
          onFeedback: handleFeedback,
          onSuggestionClick: handleSuggestionClick
        },
        message.id
      )),
      isLoading && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Thinking..." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-t bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(
            Textarea,
            {
              ref: inputRef,
              placeholder: "Ask me anything about your studies...",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: handleKeyDown,
              rows: 1,
              className: "min-h-[40px] max-h-32 resize-none pr-12"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute right-2 bottom-2 text-xs text-muted-foreground", children: inputValue.length > 0 && /* @__PURE__ */ jsxs("span", { children: [
            inputValue.length,
            "/2000"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => handleSendMessage(),
            disabled: !inputValue.trim() || isLoading,
            className: "h-10 w-10 p-0",
            children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: "Press Enter to send, Shift+Enter for new line" }),
        context && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-primary rounded-full" }),
          "Context-aware responses"
        ] })
      ] })
    ] })
  ] });
}
function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    loadSessions();
  }, []);
  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const sessionsData = await aiChatService.getSessions();
      setSessions(sessionsData);
      if (sessionsData.length > 0 && !currentSessionId) {
        setCurrentSessionId(sessionsData[0].id);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateNewSession = async () => {
    try {
      const newSession = await aiChatService.createSession();
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };
  const handleDeleteSession = async (sessionId) => {
    try {
      await aiChatService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };
  const handleUpdateSessionTitle = async (sessionId, title) => {
    try {
      await aiChatService.updateSessionTitle(sessionId, title);
      setSessions((prev) => prev.map((s) => s.id === sessionId ? {
        ...s,
        title
      } : s));
    } catch (error) {
      console.error("Error updating session title:", error);
    }
  };
  const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-background flex overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: cn("w-80 border-r bg-card flex flex-col transition-all duration-300", !isSidebarOpen && "w-0 overflow-hidden"), children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bot, { className: "h-6 w-6 text-primary" }),
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "AI Tutor" })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsSidebarOpen(false), className: "md:hidden", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleCreateNewSession, className: "w-full gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "New Chat"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "p-4 space-y-3", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-16 bg-muted rounded-lg animate-pulse" }, i)) }) : filteredSessions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "p-2 space-y-1", children: filteredSessions.map((session) => /* @__PURE__ */ jsxs("div", { className: cn("group flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors", currentSessionId === session.id && "bg-muted"), onClick: () => setCurrentSessionId(session.id), children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: session.courseId ? /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate", children: session.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(session.updatedAt)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "opacity-0 group-hover:opacity-100 h-6 w-6 p-0", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-3 w-3" }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: (e) => {
              e.stopPropagation();
              const newTitle = prompt("Enter new title:", session.title);
              if (newTitle && newTitle !== session.title) {
                handleUpdateSessionTitle(session.id, newTitle);
              }
            }, children: [
              /* @__PURE__ */ jsx(Edit3, { className: "h-4 w-4 mr-2" }),
              "Rename"
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: (e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this conversation?")) {
                handleDeleteSession(session.id);
              }
            }, className: "text-destructive", children: [
              /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              "Delete"
            ] })
          ] })
        ] })
      ] }, session.id)) }) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "font-medium mb-2", children: "No conversations" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: searchQuery ? "No conversations match your search" : "Start a new conversation with your AI tutor" }),
        !searchQuery && /* @__PURE__ */ jsxs(Button, { onClick: handleCreateNewSession, size: "sm", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Start Chatting"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [
        /* @__PURE__ */ jsx("p", { children: "AI responses are generated and may contain errors." }),
        /* @__PURE__ */ jsx("p", { children: "Always verify important information." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center justify-between p-4 border-b bg-card", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsSidebarOpen(true), children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-semibold truncate", children: (currentSession == null ? void 0 : currentSession.title) || "Select a conversation" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: handleCreateNewSession, children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) })
      ] }),
      currentSessionId && currentSession ? /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(ChatInterface, { context: {
        courseId: currentSession.courseId,
        lectureId: currentSession.lectureId
      }, height: "h-full", className: "h-full border-0 rounded-none" }) }) : /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center bg-muted/20", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 max-w-md mx-auto p-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Bot, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: "Welcome to AI Tutor" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Your personal AI assistant for learning. Ask questions, get explanations, and receive help with your studies anytime." }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleCreateNewSession, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Start Your First Conversation"
        ] })
      ] }) })
    ] })
  ] });
}

export { ChatPage as component };
//# sourceMappingURL=chat.index-B9R84L4B.mjs.map
