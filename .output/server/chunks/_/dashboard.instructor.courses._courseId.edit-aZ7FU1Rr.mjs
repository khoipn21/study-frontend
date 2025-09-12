import { jsx, jsxs } from 'react/jsx-runtime';
import { useQuery, useMutation } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { n as Route, u as useAuth } from './ssr.mjs';
import { I as InstructorGuard } from './InstructorGuard-BFlWVyU4.mjs';
import '@tanstack/react-router';
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

function EditCourse() {
  const {
    courseId
  } = Route.useParams();
  const {
    token
  } = useAuth();
  const course = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => (await api.getCourse(courseId)).data
  });
  const update = useMutation({
    mutationFn: async (payload) => api.updateCourse(token || "", courseId, payload),
    onSuccess: () => course.refetch()
  });
  if (!course.data) return /* @__PURE__ */ jsx("div", { className: "p-4", children: "Loading..." });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || ""),
      category: String(fd.get("category") || ""),
      level: String(fd.get("level") || ""),
      price: Number(fd.get("price") || "0"),
      currency: "USD",
      thumbnail_url: String(fd.get("thumbnail_url") || ""),
      status: String(fd.get("status") || "draft")
    };
    update.mutate(payload);
  };
  return /* @__PURE__ */ jsx(InstructorGuard, { children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Edit Course" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-3", onSubmit, children: [
      /* @__PURE__ */ jsx("input", { name: "title", defaultValue: course.data.title, className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("textarea", { name: "description", defaultValue: course.data.description, className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("input", { name: "category", defaultValue: course.data.category, className: "border p-2 rounded" }),
      /* @__PURE__ */ jsxs("select", { name: "level", defaultValue: course.data.level, className: "border p-2 rounded", children: [
        /* @__PURE__ */ jsx("option", { value: "beginner", children: "Beginner" }),
        /* @__PURE__ */ jsx("option", { value: "intermediate", children: "Intermediate" }),
        /* @__PURE__ */ jsx("option", { value: "advanced", children: "Advanced" })
      ] }),
      /* @__PURE__ */ jsx("input", { name: "price", type: "number", step: "0.01", defaultValue: course.data.price, className: "border p-2 rounded" }),
      /* @__PURE__ */ jsx("input", { name: "thumbnail_url", defaultValue: course.data.thumbnail_url, className: "border p-2 rounded" }),
      /* @__PURE__ */ jsxs("select", { name: "status", defaultValue: course.data.status, className: "border p-2 rounded", children: [
        /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
        /* @__PURE__ */ jsx("option", { value: "published", children: "Published" }),
        /* @__PURE__ */ jsx("option", { value: "archived", children: "Archived" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded self-start", disabled: update.isPending, children: update.isPending ? "Saving..." : "Save" })
    ] })
  ] }) });
}

export { EditCourse as component };
//# sourceMappingURL=dashboard.instructor.courses._courseId.edit-aZ7FU1Rr.mjs.map
