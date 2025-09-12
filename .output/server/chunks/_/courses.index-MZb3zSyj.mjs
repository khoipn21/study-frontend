import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { useNavigate, useSearch, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, BookOpen, TrendingUp, Star, Grid3X3, List, Loader2, Filter, Search, SlidersHorizontal, ChevronDown, X, DollarSign, Clock, Award, Play, Heart, Users, Share2 } from 'lucide-react';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { B as Button, c as cn, I as Input } from './ssr.mjs';
import { L as Label } from './label-DJNj9mF1.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-BQyaqGxc.mjs';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { S as Slider } from './slider-DCssR2_R.mjs';
import { S as Switch } from './switch-CLxgkQ9s.mjs';
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
import '@radix-ui/react-label';
import '@radix-ui/react-select';
import '@radix-ui/react-slider';
import '@radix-ui/react-switch';

function CourseCard({
  course,
  variant = "default",
  showInstructor = true,
  showProgress = false,
  progress = 0
}) {
  const getLevelBadgeStyle = (level) => {
    switch (level == null ? void 0 : level.toLowerCase()) {
      case "beginner":
        return "course-level-beginner";
      case "intermediate":
        return "course-level-intermediate";
      case "advanced":
        return "course-level-advanced";
      case "expert":
        return "course-level-expert";
      default:
        return "course-level-beginner";
    }
  };
  const formatPrice = (price, currency = "USD") => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(price);
  };
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "academic-card group overflow-hidden transition-all duration-300",
    isFeatured && "border-primary/30 shadow-lg",
    "hover:shadow-xl hover:-translate-y-1"
  ), children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
      course.thumbnail_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: course.thumbnail_url,
          alt: course.title,
          className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-primary/60" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "secondary", className: "bg-background/90 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 mr-2" }),
        "Preview"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 flex gap-2", children: [
        course.level && /* @__PURE__ */ jsx("div", { className: cn(
          "px-2 py-1 text-xs font-medium rounded-full border",
          getLevelBadgeStyle(course.level)
        ), children: course.level }),
        isFeatured && /* @__PURE__ */ jsx("div", { className: "px-2 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground", children: "Featured" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0 bg-background/80 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" }) }) }),
      showProgress && progress > 0 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-black/20", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-success transition-all duration-300",
          style: { width: `${progress}%` }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn("p-4", isCompact && "p-3"), children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/courses/$courseId",
          params: { courseId: course.id },
          className: "block",
          children: /* @__PURE__ */ jsx("h3", { className: cn(
            "font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors",
            isCompact ? "text-base" : "text-lg",
            isFeatured && "text-xl"
          ), children: course.title })
        }
      ),
      showInstructor && course.instructor_name && !isCompact && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "by ",
        course.instructor_name
      ] }),
      course.description && !isCompact && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed", children: course.description }),
      /* @__PURE__ */ jsxs("div", { className: cn(
        "flex items-center gap-4 text-xs text-muted-foreground",
        isCompact ? "mt-2" : "mt-3"
      ), children: [
        course.duration_minutes && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsx("span", { children: formatDuration(course.duration_minutes) })
        ] }),
        course.rating && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current text-warning" }),
          /* @__PURE__ */ jsx("span", { children: course.rating }),
          course.rating_count && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "(",
            course.rating_count,
            ")"
          ] })
        ] }),
        course.enrollment_count && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsx("span", { children: course.enrollment_count.toLocaleString() })
        ] })
      ] }),
      course.tags && course.tags.length > 0 && !isCompact && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-3", children: [
        course.tags.slice(0, 3).map((tag, index) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "px-2 py-1 text-xs bg-muted text-muted-foreground rounded",
            children: tag
          },
          index
        )),
        course.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-xs text-muted-foreground", children: [
          "+",
          course.tags.length - 3,
          " more"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn(
        "flex items-center justify-between",
        isCompact ? "mt-3" : "mt-4"
      ), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: cn(
            "font-bold text-primary",
            isFeatured ? "text-xl" : "text-lg"
          ), children: formatPrice(course.price || 0, course.currency) }),
          course.price && course.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground line-through", children: [
            "$",
            (course.price * 1.5).toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          !isCompact && /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-8 w-8 p-0",
              onClick: (e) => e.preventDefault(),
              children: /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(Button, { size: isCompact ? "sm" : "default", asChild: true, children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/courses/$courseId",
              params: { courseId: course.id },
              children: showProgress && progress > 0 ? "Continue" : "Enroll Now"
            }
          ) })
        ] })
      ] }),
      showProgress && progress > 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          progress,
          "% Complete"
        ] }),
        /* @__PURE__ */ jsx("span", { children: progress === 100 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-success", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
          "Completed"
        ] }) : "In Progress" })
      ] }) })
    ] })
  ] });
}
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
const categories = [
  "All Categories",
  "Programming",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Health & Fitness",
  "Language",
  "Personal Development",
  "Technology"
];
const levels = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];
const durations = [
  "Any Duration",
  "0-2 hours",
  "2-6 hours",
  "6-12 hours",
  "12+ hours"
];
const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "duration", label: "Duration" }
];
function CourseFilters({
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
  totalResults = 0,
  className
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "search") return value !== "";
    if (key === "category") return value !== "All Categories";
    if (key === "level") return value !== "All Levels";
    if (key === "duration") return value !== "Any Duration";
    if (key === "status") return value !== "";
    if (key === "instructor") return value !== "";
    if (key === "minPrice") return value > 0;
    if (key === "maxPrice") return value < 1e3;
    if (key === "minRating") return value > 0;
    if (key === "isFree" || key === "hasVideos" || key === "hasCertificate") return value === true;
    return false;
  });
  const FilterSection = ({ children, title, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs(Label, { className: "text-sm font-medium text-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
      title
    ] }),
    children
  ] });
  return /* @__PURE__ */ jsx("div", { className: cn("bg-card border-b", className), children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-2xl", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "search",
            placeholder: "Search for courses, instructors, or topics...",
            value: filters.search,
            onChange: (e) => updateFilter("search", e.target.value),
            className: "pl-10 pr-4 h-11"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap lg:flex-nowrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.category,
            onValueChange: (value) => updateFilter("category", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Category" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: categories.map((category) => /* @__PURE__ */ jsx(SelectItem, { value: category, children: category }, category)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.level,
            onValueChange: (value) => updateFilter("level", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Level" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: levels.map((level) => /* @__PURE__ */ jsx(SelectItem, { value: level, children: level }, level)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.sortBy,
            onValueChange: (value) => updateFilter("sortBy", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sort by" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: sortOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setIsAdvancedOpen(!isAdvancedOpen),
            className: "lg:hidden",
            children: [
              /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4 mr-2" }),
              "Filters",
              hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "ml-2 h-2 w-2 rounded-full bg-primary" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(Collapsible, { open: isAdvancedOpen, onOpenChange: setIsAdvancedOpen, children: /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "hidden lg:flex",
            children: [
              /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4 mr-2" }),
              "Advanced Filters",
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 ml-2" }),
              hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "ml-2 h-2 w-2 rounded-full bg-primary" })
            ]
          }
        ) }) }),
        hasActiveFilters && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onReset,
            className: "text-muted-foreground hover:text-foreground",
            children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4 mr-1" }),
              "Clear"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx("div", { children: isLoading ? "Searching..." : /* @__PURE__ */ jsxs(Fragment, { children: [
        totalResults.toLocaleString(),
        " course",
        totalResults !== 1 ? "s" : "",
        " found",
        filters.search && ` for "${filters.search}"`
      ] }) }),
      hasActiveFilters && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { children: "Filters active" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-primary animate-pulse" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Collapsible, { open: isAdvancedOpen, onOpenChange: setIsAdvancedOpen, children: /* @__PURE__ */ jsx(CollapsibleContent, { className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx(FilterSection, { title: "Price Range", icon: DollarSign, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                id: "free-only",
                checked: filters.isFree,
                onCheckedChange: (checked) => updateFilter("isFree", checked)
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "free-only", className: "text-sm", children: "Free courses only" })
          ] }),
          !filters.isFree && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                filters.minPrice
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                filters.maxPrice
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Slider,
              {
                min: 0,
                max: 1e3,
                step: 10,
                value: [filters.minPrice, filters.maxPrice],
                onValueChange: ([min, max]) => {
                  updateFilter("minPrice", min);
                  updateFilter("maxPrice", max);
                },
                className: "w-full"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(FilterSection, { title: "Rating", icon: Star, children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [4.5, 4, 3.5, 3].map((rating) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              id: `rating-${rating}`,
              name: "rating",
              checked: filters.minRating === rating,
              onChange: () => updateFilter("minRating", rating),
              className: "rounded"
            }
          ),
          /* @__PURE__ */ jsxs(Label, { htmlFor: `rating-${rating}`, className: "flex items-center text-sm", children: [
            [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
              Star,
              {
                className: cn(
                  "h-3 w-3",
                  i < rating ? "fill-warning text-warning" : "text-muted-foreground"
                )
              },
              i
            )),
            /* @__PURE__ */ jsx("span", { className: "ml-1", children: "& up" })
          ] })
        ] }, rating)) }) }),
        /* @__PURE__ */ jsx(FilterSection, { title: "Course Duration", icon: Clock, children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.duration,
            onValueChange: (value) => updateFilter("duration", value),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select duration" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: durations.map((duration) => /* @__PURE__ */ jsx(SelectItem, { value: duration, children: duration }, duration)) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(FilterSection, { title: "Course Features", icon: Award, children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                id: "has-videos",
                checked: filters.hasVideos,
                onCheckedChange: (checked) => updateFilter("hasVideos", checked)
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "has-videos", className: "text-sm", children: "Video content" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                id: "has-certificate",
                checked: filters.hasCertificate,
                onCheckedChange: (checked) => updateFilter("hasCertificate", checked)
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "has-certificate", className: "text-sm", children: "Certificate included" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 pt-6 border-t", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
          Object.entries(filters).filter(([key, value]) => {
            if (key === "search") return value !== "";
            if (key === "category") return value !== "All Categories";
            if (key === "level") return value !== "All Levels";
            return false;
          }).length,
          " filters applied"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: onReset, children: "Reset Filters" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => setIsAdvancedOpen(false), children: "Apply Filters" })
        ] })
      ] })
    ] }) }) })
  ] }) });
}
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "px-3 py-1 border rounded disabled:opacity-50",
        disabled: page <= 1,
        onClick: () => onPageChange(page - 1),
        children: "Prev"
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
      "Page ",
      page,
      " of ",
      totalPages
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "px-3 py-1 border rounded disabled:opacity-50",
        disabled: page >= totalPages,
        onClick: () => onPageChange(page + 1),
        children: "Next"
      }
    )
  ] });
}
function CoursesPage() {
  var _a;
  const navigate = useNavigate();
  const searchParams = useSearch({
    from: "/courses/"
  });
  const [viewMode, setViewMode] = useState(searchParams.view || "grid");
  const filters = useMemo(() => ({
    search: searchParams.q || "",
    category: searchParams.category || "All Categories",
    level: searchParams.level || "All Levels",
    minPrice: searchParams.minPrice || 0,
    maxPrice: searchParams.maxPrice || 1e3,
    minRating: searchParams.minRating || 0,
    duration: "Any Duration",
    status: "",
    instructor: "",
    isFree: false,
    hasVideos: false,
    hasCertificate: false,
    sortBy: searchParams.sortBy || "relevance",
    sortOrder: "desc"
  }), [searchParams]);
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["courses", searchParams],
    queryFn: async () => {
      const res = await api.listCourses({
        page: searchParams.page || 1,
        q: searchParams.q || "",
        category: searchParams.category !== "All Categories" ? searchParams.category : void 0,
        level: searchParams.level !== "All Levels" ? searchParams.level : void 0,
        min_price: searchParams.minPrice,
        max_price: searchParams.maxPrice,
        min_rating: searchParams.minRating,
        sort_by: searchParams.sortBy
      });
      return res.data;
    }
  });
  const handleFiltersChange = (newFilters) => {
    const searchParams2 = {
      page: 1,
      q: newFilters.search || void 0,
      category: newFilters.category !== "All Categories" ? newFilters.category : void 0,
      level: newFilters.level !== "All Levels" ? newFilters.level : void 0,
      minPrice: newFilters.minPrice > 0 ? newFilters.minPrice : void 0,
      maxPrice: newFilters.maxPrice < 1e3 ? newFilters.maxPrice : void 0,
      minRating: newFilters.minRating > 0 ? newFilters.minRating : void 0,
      sortBy: newFilters.sortBy !== "relevance" ? newFilters.sortBy : void 0,
      view: viewMode
    };
    navigate({
      to: "/courses/",
      search: searchParams2,
      replace: true
    });
  };
  const handleResetFilters = () => {
    navigate({
      to: "/courses/",
      search: {
        page: 1,
        view: viewMode
      },
      replace: true
    });
  };
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    navigate({
      to: "/courses/",
      search: {
        ...searchParams,
        view: mode
      },
      replace: true
    });
  };
  const handlePageChange = (page) => {
    navigate({
      to: "/courses/",
      search: {
        ...searchParams,
        page
      },
      replace: true
    });
  };
  ((_a = data == null ? void 0 : data.courses) == null ? void 0 : _a.slice(0, 3)) || [];
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-[50vh] flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Failed to load courses" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: error instanceof Error ? error.message : "Something went wrong while fetching courses" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => window.location.reload(), children: "Try Again" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/5 to-accent/5 border-b", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4", children: "Explore Our Course Catalog" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-6", children: "Discover thousands of courses from expert instructors in technology, business, design, and more." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: (data == null ? void 0 : data.total) || 0 }),
            " courses"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: "Updated weekly" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsx("span", { children: "Expert instructors" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(CourseFilters, { filters, onFiltersChange: handleFiltersChange, onReset: handleResetFilters, isLoading, totalResults: (data == null ? void 0 : data.total) || 0 }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: isLoading ? "Loading..." : /* @__PURE__ */ jsxs(Fragment, { children: [
            (data == null ? void 0 : data.total) || 0,
            " course",
            ((data == null ? void 0 : data.total) || 0) !== 1 ? "s" : "",
            filters.search && ` for "${filters.search}"`
          ] }) }),
          (data == null ? void 0 : data.page) && (data == null ? void 0 : data.total_pages) && data.total_pages > 1 && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "Page ",
            data.page,
            " of ",
            data.total_pages
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-muted p-1 rounded-md", children: [
          /* @__PURE__ */ jsx(Button, { variant: viewMode === "grid" ? "default" : "ghost", size: "sm", onClick: () => handleViewModeChange("grid"), className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(Grid3X3, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: viewMode === "list" ? "default" : "ghost", size: "sm", onClick: () => handleViewModeChange("list"), className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" }) })
        ] }) })
      ] }),
      isLoading && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Loading courses..." })
      ] }) }),
      !isLoading && data && data.courses.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No courses found" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Try adjusting your search terms or filters to find what you're looking for." }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleResetFilters, variant: "outline", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4 mr-2" }),
          "Clear all filters"
        ] })
      ] }),
      !isLoading && data && data.courses.length > 0 && /* @__PURE__ */ jsx("div", { className: cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"), children: data.courses.map((course, index) => /* @__PURE__ */ jsx(CourseCard, { course, variant: viewMode === "list" ? "compact" : index < 3 ? "featured" : "default", showInstructor: true }, course.id)) }),
      !isLoading && data && data.total_pages && data.total_pages > 1 && /* @__PURE__ */ jsx("div", { className: "mt-12 flex justify-center", children: /* @__PURE__ */ jsx(Pagination, { page: data.page, totalPages: data.total_pages, onPageChange: handlePageChange }) })
    ] })
  ] });
}

export { CoursesPage as component };
//# sourceMappingURL=courses.index-MZb3zSyj.mjs.map
