import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Calendar, BookOpen, ArrowRight, Award, Star, Users, Clock, CheckCircle, Flame, MessageSquare, Bot, User, Play, Target, Plus, Trash2 } from 'lucide-react';
import { u as useAuth, B as Button, c as cn, I as Input, f as formatDistanceToNow } from './ssr.mjs';
import { Link } from '@tanstack/react-router';
import { P as Progress } from './progress-B-kuOVqI.mjs';
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from './dialog-5HmVNweK.mjs';
import { L as Label } from './label-DJNj9mF1.mjs';
import { T as Textarea } from './textarea-BwlHZp3V.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-BQyaqGxc.mjs';
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
import '@radix-ui/react-progress';
import '@radix-ui/react-dialog';
import '@radix-ui/react-label';
import '@radix-ui/react-select';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function StatsCards({ stats, className }) {
  const formatWatchTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  const statsData = [
    {
      title: "Courses Enrolled",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "blue",
      trend: null
    },
    {
      title: "Completed Courses",
      value: stats.completedCourses,
      icon: CheckCircle,
      color: "green",
      trend: stats.completedCourses > 0 ? "+1 this month" : null
    },
    {
      title: "Learning Time",
      value: formatWatchTime(stats.totalWatchTime),
      icon: Clock,
      color: "purple",
      trend: "+2.5h this week"
    },
    {
      title: "Study Streak",
      value: `${stats.streakDays} days`,
      icon: Flame,
      color: "orange",
      trend: stats.streakDays > 7 ? "Personal best!" : null
    },
    {
      title: "Certificates",
      value: stats.certificatesEarned,
      icon: Award,
      color: "yellow",
      trend: null
    },
    {
      title: "Forum Posts",
      value: stats.forumPosts,
      icon: MessageSquare,
      color: "indigo",
      trend: stats.forumPosts > 10 ? "Active contributor" : null
    },
    {
      title: "AI Chats",
      value: stats.chatSessions,
      icon: Bot,
      color: "pink",
      trend: "+5 this week"
    },
    {
      title: "In Progress",
      value: stats.inProgressCourses,
      icon: TrendingUp,
      color: "teal",
      trend: "Keep going!"
    }
  ];
  const getColorClasses = (color) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50 border-blue-100",
      green: "text-green-600 bg-green-50 border-green-100",
      purple: "text-purple-600 bg-purple-50 border-purple-100",
      orange: "text-orange-600 bg-orange-50 border-orange-100",
      yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
      indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
      pink: "text-pink-600 bg-pink-50 border-pink-100",
      teal: "text-teal-600 bg-teal-50 border-teal-100"
    };
    return colors[color] || colors.blue;
  };
  return /* @__PURE__ */ jsx("div", { className: cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className), children: statsData.map((stat, index) => {
    const Icon = stat.icon;
    const colorClasses = getColorClasses(stat.color);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "academic-card p-6 hover:shadow-md transition-shadow",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: cn(
              "p-3 rounded-lg border",
              colorClasses
            ), children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
            stat.trend && /* @__PURE__ */ jsx("div", { className: "text-xs text-success font-medium bg-success/10 px-2 py-1 rounded", children: stat.trend })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground font-medium", children: stat.title })
          ] })
        ]
      },
      index
    );
  }) });
}
function LearningProgress({ courses, className }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  const formatLastWatched = (timestamp) => {
    if (!timestamp) return "Not started";
    const date = new Date(timestamp);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  if (courses.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: cn("academic-card p-8 text-center", className), children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No courses in progress" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Start learning something new today!" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/courses", children: "Browse Courses" }) })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: cn("space-y-4", className), children: courses.map((course) => /* @__PURE__ */ jsx("div", { className: "academic-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: course.courseThumbnail ? /* @__PURE__ */ jsx(
      "img",
      {
        src: course.courseThumbnail,
        alt: course.courseTitle,
        className: "w-20 h-20 rounded-lg object-cover"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-muted rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-8 w-8 text-muted-foreground" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/courses/$courseId",
              params: { courseId: course.courseId },
              className: "block group",
              children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2", children: course.courseTitle })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: course.instructor })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsx("span", { children: course.category })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  getDifficultyColor(course.difficulty)
                ),
                children: course.difficulty
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right ml-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-primary", children: [
            course.progress,
            "%"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Complete" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(Progress, { value: course.progress, className: "h-2" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxs("span", { children: [
              formatTime(course.estimatedTimeToComplete),
              " remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Last watched ",
              formatLastWatched(course.lastWatched)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          course.nextLecture && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/learn/$courseId/$lectureId",
              params: {
                courseId: course.courseId,
                lectureId: course.nextLecture.id
              },
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsx(Play, { className: "h-3 w-3" }),
                "Continue"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/courses/$courseId",
              params: { courseId: course.courseId },
              className: "gap-1",
              children: [
                "View Course",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          ) })
        ] })
      ] }),
      course.nextLecture && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-muted/50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-foreground", children: [
            "Next: ",
            course.nextLecture.title
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            course.nextLecture.duration,
            " minutes"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/learn/$courseId/$lectureId",
            params: {
              courseId: course.courseId,
              lectureId: course.nextLecture.id
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx(Play, { className: "h-3 w-3" }),
              "Watch Now"
            ]
          }
        ) })
      ] }) })
    ] })
  ] }) }, course.courseId)) });
}
function ActivityFeed({ activities, className }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "course_started":
        return BookOpen;
      case "lecture_completed":
        return CheckCircle;
      case "certificate_earned":
        return Award;
      case "forum_post":
        return MessageSquare;
      case "chat_session":
        return Bot;
      case "achievement_unlocked":
        return Award;
      default:
        return Play;
    }
  };
  const getActivityColor = (type) => {
    switch (type) {
      case "course_started":
        return "text-blue-600 bg-blue-50";
      case "lecture_completed":
        return "text-green-600 bg-green-50";
      case "certificate_earned":
        return "text-yellow-600 bg-yellow-50";
      case "forum_post":
        return "text-purple-600 bg-purple-50";
      case "chat_session":
        return "text-pink-600 bg-pink-50";
      case "achievement_unlocked":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const formatActivityTitle = (activity) => {
    switch (activity.type) {
      case "course_started":
        return `Started: ${activity.title.replace("Started: ", "")}`;
      case "lecture_completed":
        return `Completed: ${activity.title.replace("Completed: ", "")}`;
      case "certificate_earned":
        return `Certificate Earned: ${activity.title.replace("Certificate Earned: ", "")}`;
      case "forum_post":
        return activity.title;
      case "chat_session":
        return `AI Chat: ${activity.title.replace("AI Chat: ", "")}`;
      case "achievement_unlocked":
        return activity.title;
      default:
        return activity.title;
    }
  };
  if (activities.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "academic-card p-8 text-center", children: [
      /* @__PURE__ */ jsx(TrendingUp, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No recent activity" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Start learning to see your progress here!" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "academic-card", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Recent Activity" }) }),
    /* @__PURE__ */ jsx("div", { className: "divide-y", children: activities.map((activity) => {
      var _a, _b, _c;
      const Icon = getActivityIcon(activity.type);
      const colorClasses = getActivityColor(activity.type);
      return /* @__PURE__ */ jsx("div", { className: "p-4 hover:bg-muted/50 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground text-sm", children: formatActivityTitle(activity) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: activity.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { children: formatDistanceToNow(new Date(activity.timestamp)) })
              ] }),
              ((_a = activity.metadata) == null ? void 0 : _a.duration) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Play, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  activity.metadata.duration,
                  "min"
                ] })
              ] }),
              ((_b = activity.metadata) == null ? void 0 : _b.progress) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  activity.metadata.progress,
                  "% complete"
                ] })
              ] }),
              ((_c = activity.metadata) == null ? void 0 : _c.points) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "+",
                  activity.metadata.points,
                  " points"
                ] })
              ] })
            ] })
          ] }),
          (activity.courseId || activity.lectureId) && /* @__PURE__ */ jsx("div", { className: "ml-3", children: activity.lectureId ? /* @__PURE__ */ jsx(
            Link,
            {
              to: "/learn/$courseId/$lectureId",
              params: {
                courseId: activity.courseId,
                lectureId: activity.lectureId
              },
              className: "text-xs text-primary hover:underline",
              children: "View"
            }
          ) : activity.courseId ? /* @__PURE__ */ jsx(
            Link,
            {
              to: "/courses/$courseId",
              params: { courseId: activity.courseId },
              className: "text-xs text-primary hover:underline",
              children: "View Course"
            }
          ) : null })
        ] }) })
      ] }) }, activity.id);
    }) }),
    activities.length > 5 && /* @__PURE__ */ jsx("div", { className: "p-4 border-t text-center", children: /* @__PURE__ */ jsx("button", { className: "text-sm text-primary hover:underline font-medium", children: "View All Activity" }) })
  ] });
}
function StudyGoals({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  className
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "daily",
    target: 30,
    unit: "minutes",
    deadline: ""
  });
  const handleCreateGoal = () => {
    if (!formData.title.trim()) return;
    const goalData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      target: formData.target,
      unit: formData.unit,
      deadline: formData.deadline || void 0
    };
    onCreateGoal == null ? void 0 : onCreateGoal(goalData);
    setIsCreateDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      type: "daily",
      target: 30,
      unit: "minutes",
      deadline: ""
    });
  };
  const getGoalTypeIcon = (type) => {
    switch (type) {
      case "daily":
        return Clock;
      case "weekly":
        return Calendar;
      case "monthly":
        return TrendingUp;
      case "custom":
        return Target;
      default:
        return Target;
    }
  };
  const getGoalTypeColor = (type) => {
    switch (type) {
      case "daily":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "weekly":
        return "text-green-600 bg-green-50 border-green-200";
      case "monthly":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "custom":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = /* @__PURE__ */ new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1e3 * 60 * 60 * 24));
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString();
  };
  const getProgressColor = (progress, target, isCompleted) => {
    if (isCompleted) return "text-green-600";
    const percentage = progress / target * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-blue-600";
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-4", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Study Goals" })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "New Goal"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "Create Study Goal" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: "Set a new learning goal to stay motivated and track your progress." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Goal Title" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "title",
                  placeholder: "e.g., Complete React Course",
                  value: formData.title,
                  onChange: (e) => setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Description (optional)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "description",
                  placeholder: "What do you want to achieve?",
                  value: formData.description,
                  onChange: (e) => setFormData((prev) => ({ ...prev, description: e.target.value })),
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Goal Type" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.type,
                    onValueChange: (value) => setFormData((prev) => ({ ...prev, type: value })),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "daily", children: "Daily" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "weekly", children: "Weekly" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "monthly", children: "Monthly" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: "Custom" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Unit" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    value: formData.unit,
                    onValueChange: (value) => setFormData((prev) => ({ ...prev, unit: value })),
                    children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsx(SelectItem, { value: "minutes", children: "Minutes" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "lectures", children: "Lectures" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "courses", children: "Courses" }),
                        /* @__PURE__ */ jsx(SelectItem, { value: "forum_posts", children: "Forum Posts" })
                      ] })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "target", children: "Target" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "target",
                    type: "number",
                    min: "1",
                    value: formData.target,
                    onChange: (e) => setFormData((prev) => ({ ...prev, target: parseInt(e.target.value) || 1 }))
                  }
                )
              ] }),
              formData.type === "custom" && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "deadline", children: "Deadline (optional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "deadline",
                    type: "date",
                    value: formData.deadline,
                    onChange: (e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsCreateDialogOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleCreateGoal, disabled: !formData.title.trim(), children: "Create Goal" })
          ] })
        ] })
      ] })
    ] }),
    goals.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "academic-card p-8 text-center", children: [
      /* @__PURE__ */ jsx(Target, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No study goals set" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Create your first goal to stay motivated and track your progress." }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setIsCreateDialogOpen(true), className: "gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Create Your First Goal"
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: goals.map((goal) => {
      const Icon = getGoalTypeIcon(goal.type);
      const colorClasses = getGoalTypeColor(goal.type);
      const progressPercentage = goal.current / goal.target * 100;
      const deadline = formatDeadline(goal.deadline);
      const progressColor = getProgressColor(goal.current, goal.target, goal.isCompleted);
      return /* @__PURE__ */ jsx("div", { className: "academic-card p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: cn("p-2 rounded-lg border", colorClasses), children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground", children: goal.title }),
              goal.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: goal.description })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 ml-3", children: onDeleteGoal && /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => onDeleteGoal(goal.id),
                className: "h-6 w-6 p-0 text-muted-foreground hover:text-destructive",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: cn("font-medium", progressColor), children: [
                goal.current,
                " / ",
                goal.target,
                " ",
                goal.unit,
                goal.isCompleted && /* @__PURE__ */ jsx(CheckCircle, { className: "inline h-4 w-4 ml-1 text-green-600" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                Math.round(progressPercentage),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Progress,
              {
                value: Math.min(progressPercentage, 100),
                className: "h-2"
              }
            ),
            deadline && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground capitalize", children: [
                goal.type,
                " goal"
              ] }),
              /* @__PURE__ */ jsx("span", { className: cn(
                "font-medium",
                deadline.includes("Overdue") ? "text-destructive" : deadline.includes("today") || deadline.includes("tomorrow") ? "text-warning" : "text-muted-foreground"
              ), children: deadline })
            ] })
          ] })
        ] })
      ] }) }, goal.id);
    }) })
  ] });
}
const _DashboardService = class _DashboardService2 {
  static getInstance() {
    if (!_DashboardService2.instance) {
      _DashboardService2.instance = new _DashboardService2();
    }
    return _DashboardService2.instance;
  }
  constructor() {
  }
  async getDashboardData(userId) {
    try {
      const response = await fetch(`/api/v1/dashboard/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return this.getMockDashboardData();
    }
  }
  async updateStudyGoal(goalId, progress) {
    try {
      const response = await fetch(`/api/v1/dashboard/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ progress })
      });
      if (!response.ok) throw new Error("Failed to update study goal");
    } catch (error) {
      console.error("Error updating study goal:", error);
    }
  }
  async createStudyGoal(goal) {
    try {
      const response = await fetch("/api/v1/dashboard/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(goal)
      });
      if (!response.ok) throw new Error("Failed to create study goal");
      return await response.json();
    } catch (error) {
      console.error("Error creating study goal:", error);
      throw error;
    }
  }
  async getWeeklyStats(userId) {
    try {
      const response = await fetch(`/api/v1/dashboard/stats/weekly/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch weekly stats");
      return await response.json();
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      return this.getMockWeeklyStats();
    }
  }
  getMockDashboardData() {
    return {
      stats: {
        totalCourses: 8,
        completedCourses: 3,
        inProgressCourses: 2,
        totalWatchTime: 1247,
        // minutes
        streakDays: 12,
        certificatesEarned: 3,
        forumPosts: 15,
        chatSessions: 28
      },
      recentProgress: [
        {
          courseId: "react-mastery",
          courseTitle: "React Mastery: Build Modern Web Applications",
          courseThumbnail: "/course-thumbnails/react-mastery.jpg",
          instructor: "Sarah Wilson",
          progress: 68,
          lastWatched: "2024-01-15T14:30:00Z",
          nextLecture: {
            id: "react-hooks-advanced",
            title: "Advanced React Hooks Patterns",
            duration: 25
          },
          estimatedTimeToComplete: 120,
          difficulty: "intermediate",
          category: "Web Development"
        },
        {
          courseId: "typescript-fundamentals",
          courseTitle: "TypeScript Fundamentals for Modern Development",
          courseThumbnail: "/course-thumbnails/typescript.jpg",
          instructor: "Michael Chen",
          progress: 34,
          lastWatched: "2024-01-14T09:15:00Z",
          nextLecture: {
            id: "ts-generics",
            title: "Understanding TypeScript Generics",
            duration: 18
          },
          estimatedTimeToComplete: 200,
          difficulty: "intermediate",
          category: "Programming Languages"
        }
      ],
      recentActivity: [
        {
          id: "activity_1",
          type: "lecture_completed",
          title: "Completed: React State Management",
          description: "You finished the lecture on advanced state management patterns",
          timestamp: "2024-01-15T14:30:00Z",
          courseId: "react-mastery",
          lectureId: "state-management",
          metadata: {
            duration: 22,
            progress: 68
          }
        },
        {
          id: "activity_2",
          type: "achievement_unlocked",
          title: "Achievement Unlocked: Study Streak!",
          description: "You maintained a 12-day learning streak",
          timestamp: "2024-01-15T08:00:00Z",
          metadata: {
            points: 100
          }
        },
        {
          id: "activity_3",
          type: "forum_post",
          title: "Posted in React Community",
          description: "Asked a question about React performance optimization",
          timestamp: "2024-01-14T16:20:00Z"
        }
      ],
      achievements: [
        {
          id: "first_course",
          title: "First Steps",
          description: "Complete your first course",
          icon: "GraduationCap",
          category: "milestone",
          points: 100,
          unlockedAt: "2024-01-10T12:00:00Z"
        },
        {
          id: "study_streak_7",
          title: "Week Warrior",
          description: "Study for 7 consecutive days",
          icon: "Flame",
          category: "learning",
          points: 150,
          unlockedAt: "2024-01-12T08:00:00Z"
        },
        {
          id: "community_contributor",
          title: "Community Contributor",
          description: "Make 10 helpful forum posts",
          icon: "MessageSquare",
          category: "engagement",
          points: 200,
          progress: {
            current: 7,
            target: 10,
            unit: "posts"
          }
        },
        {
          id: "speed_learner",
          title: "Speed Learner",
          description: "Complete 5 lectures in one day",
          icon: "Zap",
          category: "special",
          points: 300,
          progress: {
            current: 3,
            target: 5,
            unit: "lectures"
          }
        }
      ],
      studyGoals: [
        {
          id: "daily_30min",
          title: "Daily Learning",
          description: "Study for at least 30 minutes every day",
          type: "daily",
          target: 30,
          current: 22,
          unit: "minutes",
          isCompleted: false,
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          id: "weekly_react",
          title: "React Mastery Progress",
          description: "Complete 5 React lectures this week",
          type: "weekly",
          target: 5,
          current: 3,
          unit: "lectures",
          deadline: "2024-01-21T23:59:59Z",
          isCompleted: false,
          createdAt: "2024-01-15T00:00:00Z"
        }
      ],
      learningPaths: [
        {
          id: "frontend_developer",
          title: "Frontend Developer Path",
          description: "Master modern frontend development with React, TypeScript, and modern tools",
          courses: [
            { id: "html-css-basics", title: "HTML & CSS Fundamentals", isCompleted: true, isUnlocked: true, order: 1 },
            { id: "javascript-essentials", title: "JavaScript Essentials", isCompleted: true, isUnlocked: true, order: 2 },
            { id: "react-fundamentals", title: "React Fundamentals", isCompleted: true, isUnlocked: true, order: 3 },
            { id: "react-mastery", title: "React Mastery", isCompleted: false, isUnlocked: true, order: 4 },
            { id: "typescript-fundamentals", title: "TypeScript Fundamentals", isCompleted: false, isUnlocked: true, order: 5 },
            { id: "next-js-complete", title: "Next.js Complete Guide", isCompleted: false, isUnlocked: false, order: 6 }
          ],
          progress: 60,
          estimatedTime: 45,
          difficulty: "intermediate",
          category: "Web Development"
        }
      ],
      upcomingDeadlines: [
        {
          id: "goal_deadline_1",
          title: "React Mastery Weekly Goal",
          type: "goal",
          dueDate: "2024-01-21T23:59:59Z",
          priority: "medium"
        },
        {
          id: "course_deadline_1",
          title: "TypeScript Course Assignment",
          type: "assignment",
          dueDate: "2024-01-25T23:59:59Z",
          priority: "high"
        }
      ],
      recommendations: [
        {
          id: "rec_1",
          type: "course",
          title: "Advanced React Patterns",
          reason: "Based on your progress in React Mastery",
          thumbnail: "/course-thumbnails/advanced-react.jpg",
          rating: 4.8,
          studentsCount: 15420
        },
        {
          id: "rec_2",
          type: "course",
          title: "Node.js Backend Development",
          reason: "Perfect complement to your frontend skills",
          thumbnail: "/course-thumbnails/nodejs.jpg",
          rating: 4.7,
          studentsCount: 12830
        },
        {
          id: "rec_3",
          type: "learning_path",
          title: "Full Stack Developer Path",
          reason: "Natural progression from Frontend Developer Path",
          rating: 4.9,
          studentsCount: 8540
        }
      ]
    };
  }
  getMockWeeklyStats() {
    const today = /* @__PURE__ */ new Date();
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      stats.push({
        date: date.toISOString().split("T")[0],
        minutes: Math.floor(Math.random() * 90) + 10,
        lecturesCompleted: Math.floor(Math.random() * 4),
        coursesStarted: i === 6 ? 1 : Math.floor(Math.random() * 2)
      });
    }
    return stats;
  }
};
__publicField(_DashboardService, "instance");
let DashboardService = _DashboardService;
const dashboardService = DashboardService.getInstance();
function DashboardPage() {
  const {
    user
  } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState([]);
  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadWeeklyStats();
    }
  }, [user]);
  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await dashboardService.getDashboardData(user.id);
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadWeeklyStats = async () => {
    if (!user) return;
    try {
      const stats = await dashboardService.getWeeklyStats(user.id);
      setWeeklyStats(stats);
    } catch (error) {
      console.error("Error loading weekly stats:", error);
    }
  };
  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await dashboardService.createStudyGoal(goalData);
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          studyGoals: [newGoal, ...prev.studyGoals]
        };
      });
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };
  const handleUpdateGoal = async (goalId, progress) => {
    try {
      await dashboardService.updateStudyGoal(goalId, progress);
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          studyGoals: prev.studyGoals.map((goal) => goal.id === goalId ? {
            ...goal,
            current: progress,
            isCompleted: progress >= goal.target
          } : goal)
        };
      });
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };
  const getWelcomeMessage = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-muted rounded w-1/4" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [...Array(8)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-32 bg-muted rounded" }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-64 bg-muted rounded" }),
          /* @__PURE__ */ jsx("div", { className: "h-64 bg-muted rounded" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-96 bg-muted rounded" })
      ] })
    ] }) }) });
  }
  if (!dashboardData) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-8 text-center", children: [
      /* @__PURE__ */ jsx(TrendingUp, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-2", children: "Unable to load dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "There was an error loading your dashboard data." }),
      /* @__PURE__ */ jsxs(Button, { onClick: loadDashboardData, className: "gap-2", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }),
        "Try Again"
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-foreground", children: [
          getWelcomeMessage(),
          ", ",
          user == null ? void 0 : user.username,
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Here's your learning progress and achievements" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        dashboardData.stats.streakDays > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-orange-600" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-orange-800", children: [
            dashboardData.stats.streakDays,
            " day streak!"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: loadDashboardData, className: "gap-2", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }),
          "Refresh"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(StatsCards, { stats: dashboardData.stats, className: "mb-8" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Continue Learning" })
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-1", children: [
              "View All",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(LearningProgress, { courses: dashboardData.recentProgress })
        ] }),
        dashboardData.learningPaths.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Learning Paths" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dashboardData.learningPaths.map((path) => /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground mb-2", children: path.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: path.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    path.courses.length,
                    " courses"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    path.estimatedTime,
                    "h estimated"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "capitalize", children: path.difficulty })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-primary", children: [
                  path.progress,
                  "%"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Complete" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-3", children: [
              path.courses.slice(0, 6).map((course, index) => /* @__PURE__ */ jsx("div", { className: cn("flex-1 h-2 rounded", course.isCompleted ? "bg-green-500" : course.isUnlocked ? "bg-yellow-300" : "bg-muted") }, course.id)),
              path.courses.length > 6 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
                "+",
                path.courses.length - 6
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                path.courses.filter((c) => c.isCompleted).length,
                " of ",
                path.courses.length,
                " completed"
              ] }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Continue Path" })
            ] })
          ] }, path.id)) })
        ] }),
        dashboardData.achievements.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Achievements" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: dashboardData.achievements.slice(0, 4).map((achievement) => /* @__PURE__ */ jsx("div", { className: cn("academic-card p-4", achievement.unlockedAt ? "border-success bg-success/5" : "opacity-75"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: cn("p-2 rounded-lg", achievement.unlockedAt ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"), children: /* @__PURE__ */ jsx(Award, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-foreground mb-1", children: achievement.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-2", children: achievement.description }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-primary", children: [
                  "+",
                  achievement.points,
                  " points"
                ] }),
                achievement.progress && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  achievement.progress.current,
                  "/",
                  achievement.progress.target,
                  " ",
                  achievement.progress.unit
                ] })
              ] })
            ] })
          ] }) }, achievement.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsx(StudyGoals, { goals: dashboardData.studyGoals, onCreateGoal: handleCreateGoal, onUpdateGoal: handleUpdateGoal }),
        /* @__PURE__ */ jsx(ActivityFeed, { activities: dashboardData.recentActivity.slice(0, 5) }),
        dashboardData.recommendations.length > 0 && /* @__PURE__ */ jsxs("div", { className: "academic-card", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Recommended for You" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "divide-y", children: dashboardData.recommendations.slice(0, 3).map((rec) => /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            rec.thumbnail && /* @__PURE__ */ jsx("img", { src: rec.thumbnail, alt: rec.title, className: "w-12 h-12 rounded object-cover" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm line-clamp-2 mb-1", children: rec.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: rec.reason }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current text-yellow-500" }),
                  /* @__PURE__ */ jsx("span", { children: rec.rating })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Users, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsx("span", { children: rec.studentsCount.toLocaleString() })
                ] })
              ] })
            ] })
          ] }) }, rec.id)) }),
          /* @__PURE__ */ jsx("div", { className: "p-4 border-t text-center", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "gap-1", children: [
            "View All Recommendations",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
          ] }) })
        ] }),
        dashboardData.upcomingDeadlines.length > 0 && /* @__PURE__ */ jsxs("div", { className: "academic-card", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-warning" }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Upcoming Deadlines" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "divide-y", children: dashboardData.upcomingDeadlines.map((deadline) => /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm mb-1", children: deadline.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground capitalize", children: deadline.type.replace("_", " ") })
            ] }),
            /* @__PURE__ */ jsx("span", { className: cn("text-xs font-medium px-2 py-1 rounded", deadline.priority === "high" && "bg-destructive/10 text-destructive", deadline.priority === "medium" && "bg-warning/10 text-warning", deadline.priority === "low" && "bg-muted text-muted-foreground"), children: new Date(deadline.dueDate).toLocaleDateString() })
          ] }) }, deadline.id)) })
        ] })
      ] })
    ] })
  ] }) });
}

export { DashboardPage as component };
//# sourceMappingURL=me.dashboard-B13f2KPu.mjs.map
