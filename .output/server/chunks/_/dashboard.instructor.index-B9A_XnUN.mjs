import { jsx, jsxs } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { u as useAuth } from './ssr.mjs';
import { I as InstructorGuard } from './InstructorGuard-BFlWVyU4.mjs';
import 'react';
import '@tanstack/router-ssr-query-core';
import '@tanstack/react-devtools';
import 'lucide-react';
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

function InstructorDashboard() {
  var _a;
  const {
    user,
    token
  } = useAuth();
  const courses = useQuery({
    queryKey: ["instructor-courses", user == null ? void 0 : user.id],
    queryFn: async () => (await api.listCourses({
      page: 1,
      page_size: 50,
      q: void 0
    })).data,
    enabled: !!user
  });
  const mine = (((_a = courses.data) == null ? void 0 : _a.courses) || []).filter((c) => c.instructor_id === (user == null ? void 0 : user.id));
  return /* @__PURE__ */ jsx(InstructorGuard, { children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Instructor Dashboard" }),
      /* @__PURE__ */ jsx(Link, { to: "/dashboard/instructor/courses/new", className: "px-3 py-1 bg-blue-600 text-white rounded", children: "New Course" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: mine.map((c) => /* @__PURE__ */ jsxs("div", { className: "border rounded p-4 bg-white", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: c.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: c.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-3 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/dashboard/instructor/courses/$courseId/edit", params: {
          courseId: c.id
        }, className: "text-blue-600", children: "Edit" }),
        /* @__PURE__ */ jsx(Link, { to: "/dashboard/instructor/courses/$courseId/lectures", params: {
          courseId: c.id
        }, className: "text-blue-600", children: "Lectures" }),
        /* @__PURE__ */ jsx(Link, { to: "/courses/$courseId", params: {
          courseId: c.id
        }, className: "text-blue-600", children: "View" })
      ] })
    ] }, c.id)) })
  ] }) });
}

export { InstructorDashboard as component };
//# sourceMappingURL=dashboard.instructor.index-B9A_XnUN.mjs.map
