import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { u as useAuth } from './ssr.mjs';
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

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-2", children: "You must be logged in to view this page." }),
      /* @__PURE__ */ jsx(Link, { to: "/auth/login", className: "text-blue-600 underline", children: "Go to Login" })
    ] });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function EnrollmentsPage() {
  const {
    token
  } = useAuth();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      var _a;
      const res = await api.listEnrollments(token || "");
      return (_a = res.data) != null ? _a : {
        enrollments: [],
        total: 0,
        page: 1,
        page_size: 10,
        total_pages: 1
      };
    },
    enabled: !!token
  });
  return /* @__PURE__ */ jsx(Protected, { children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "My Enrollments" }),
    isLoading && /* @__PURE__ */ jsx("div", { children: "Loading..." }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y", children: data == null ? void 0 : data.enrollments.map((e) => /* @__PURE__ */ jsx("li", { className: "py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          "Course: ",
          e.course_id
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Progress: ",
          Math.round(e.progress_percentage || 0),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/courses/$courseId", params: {
        courseId: e.course_id
      }, className: "text-blue-600 underline", children: "View" })
    ] }) }, e.id)) })
  ] }) });
}

export { EnrollmentsPage as component };
//# sourceMappingURL=me.enrollments-0b-Rs2OG.mjs.map
