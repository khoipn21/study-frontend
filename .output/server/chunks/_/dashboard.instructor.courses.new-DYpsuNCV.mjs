import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
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

function NewCourse() {
  const {
    user,
    token
  } = useAuth();
  const navigate = useNavigate();
  const create = useMutation({
    mutationFn: async (payload) => api.createCourse(token || "", payload),
    onSuccess: (res) => {
      var _a;
      return navigate({
        to: "/dashboard/instructor/courses/$courseId/edit",
        params: {
          courseId: ((_a = res.data) == null ? void 0 : _a.id) || ""
        }
      });
    }
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || ""),
      instructor_id: (user == null ? void 0 : user.id) || "",
      category: String(fd.get("category") || "general"),
      level: String(fd.get("level") || "beginner"),
      price: Number(fd.get("price") || "0"),
      currency: "USD",
      thumbnail_url: String(fd.get("thumbnail_url") || "")
    };
    create.mutate(payload);
  };
  return /* @__PURE__ */ jsx(InstructorGuard, { children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Create New Course" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-3", onSubmit, children: [
      /* @__PURE__ */ jsx("input", { name: "title", placeholder: "Title", className: "border p-2 rounded", required: true }),
      /* @__PURE__ */ jsx("textarea", { name: "description", placeholder: "Description", className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("input", { name: "category", placeholder: "Category", className: "border p-2 rounded" }),
      /* @__PURE__ */ jsxs("select", { name: "level", className: "border p-2 rounded", children: [
        /* @__PURE__ */ jsx("option", { value: "beginner", children: "Beginner" }),
        /* @__PURE__ */ jsx("option", { value: "intermediate", children: "Intermediate" }),
        /* @__PURE__ */ jsx("option", { value: "advanced", children: "Advanced" })
      ] }),
      /* @__PURE__ */ jsx("input", { name: "price", type: "number", step: "0.01", placeholder: "Price", className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("input", { name: "thumbnail_url", placeholder: "Thumbnail URL", className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded self-start", disabled: create.isPending, children: create.isPending ? "Creating..." : "Create" })
    ] })
  ] }) });
}

export { NewCourse as component };
//# sourceMappingURL=dashboard.instructor.courses.new-DYpsuNCV.mjs.map
