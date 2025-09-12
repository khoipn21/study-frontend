import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { ArrowRight, BookOpen, Users, Trophy, Zap, Play, Clock, Star } from 'lucide-react';
import { u as useAuth, B as Button } from './ssr.mjs';
import 'react';
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

function HomePage() {
  const {
    user
  } = useAuth();
  const features = [{
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with years of real-world experience"
  }, {
    icon: Users,
    title: "Interactive Learning",
    description: "Engage with peers in discussions, forums, and collaborative projects"
  }, {
    icon: Trophy,
    title: "Earn Certificates",
    description: "Get recognized for your achievements with industry-recognized certificates"
  }, {
    icon: Zap,
    title: "AI-Powered Tutoring",
    description: "Get personalized help with our intelligent AI tutor available 24/7"
  }];
  const stats = [{
    label: "Active Students",
    value: "15,000+"
  }, {
    label: "Expert Instructors",
    value: "250+"
  }, {
    label: "Course Hours",
    value: "1,000+"
  }, {
    label: "Completion Rate",
    value: "95%"
  }];
  const testimonials = [{
    name: "Sarah Johnson",
    role: "Software Developer",
    content: "The courses here transformed my career. The practical approach and expert guidance made all the difference.",
    rating: 5
  }, {
    name: "Michael Chen",
    role: "Data Scientist",
    content: "Outstanding platform with high-quality content. The AI tutor helped me whenever I was stuck.",
    rating: 5
  }, {
    name: "Emily Rodriguez",
    role: "UX Designer",
    content: "I love the interactive discussions and the supportive community. Learned so much from both instructors and peers.",
    rating: 5
  }];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx("section", { className: "relative px-4 py-20 sm:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "font-academic", children: "Unlock Your" }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Potential" }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "font-academic", children: "Through Learning" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed", children: "Join thousands of learners advancing their careers with our comprehensive courses, expert instruction, and cutting-edge AI tutoring system." }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: user ? /* @__PURE__ */ jsx(Button, { size: "lg", asChild: true, className: "h-12 px-8", children: /* @__PURE__ */ jsxs(Link, { to: "/courses", children: [
        "Explore Courses",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { size: "lg", asChild: true, className: "h-12 px-8", children: /* @__PURE__ */ jsxs(Link, { to: "/auth/register", children: [
          "Get Started Free",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", asChild: true, className: "h-12 px-8", children: /* @__PURE__ */ jsx(Link, { to: "/courses", children: "Browse Courses" }) })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-3xl lg:text-4xl font-bold mb-2", children: stat.value }),
      /* @__PURE__ */ jsx("div", { className: "text-sm lg:text-base opacity-90", children: stat.label })
    ] }, index)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4", children: "Why Choose Our Platform?" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "We combine academic excellence with modern technology to create the ultimate learning experience." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "academic-card p-6 text-center group", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsx(feature.icon, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3 text-foreground", children: feature.title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: feature.description })
      ] }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-4 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4", children: "Popular Courses" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Discover our most popular courses taught by industry experts" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "academic-card overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Play, { className: "h-12 w-12 text-primary/80" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "12 hours" }),
            /* @__PURE__ */ jsx("span", { children: "\u2022" }),
            /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current text-warning" }),
            /* @__PURE__ */ jsx("span", { children: "4.9" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2 text-foreground", children: "Advanced React Development" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Master React with hooks, context, and modern patterns" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-primary", children: "$99" }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Learn More" })
          ] })
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/courses", children: [
        "View All Courses",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold font-academic text-foreground mb-4", children: "What Our Students Say" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Real stories from learners who transformed their careers" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsxs("div", { className: "academic-card p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center mb-4", children: [...Array(testimonial.rating)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current text-warning" }, i)) }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-4 leading-relaxed italic", children: [
          '"',
          testimonial.content,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: testimonial.name }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: testimonial.role })
        ] })
      ] }, index)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold font-academic mb-4", children: "Ready to Start Your Learning Journey?" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg mb-8 opacity-90 max-w-2xl mx-auto", children: "Join thousands of students already advancing their careers. Start with a free account and explore our course catalog." }),
      user ? /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", asChild: true, className: "h-12 px-8", children: /* @__PURE__ */ jsxs(Link, { to: "/courses", children: [
        "Explore Courses",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", asChild: true, className: "h-12 px-8", children: /* @__PURE__ */ jsxs(Link, { to: "/auth/register", children: [
          "Start Learning Today",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", className: "h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/auth/login", children: "Sign In" }) })
      ] })
    ] }) })
  ] });
}

export { HomePage as component };
//# sourceMappingURL=index-CKle1rme.mjs.map
