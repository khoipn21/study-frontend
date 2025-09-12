import { jsx, jsxs } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { m as Route$1, u as useAuth } from './ssr.mjs';
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

function ManageLectures() {
  var _a2, _b2;
  var _a, _b;
  const {
    courseId
  } = Route$1.useParams();
  const {
    token
  } = useAuth();
  const qc = useQueryClient();
  const lectures = useQuery({
    queryKey: ["lectures", courseId],
    queryFn: async () => (await api.listLectures(courseId, {
      page: 1,
      page_size: 100
    })).data
  });
  const create = useMutation({
    mutationFn: async (payload) => api.createLecture(token || "", payload),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["lectures", courseId]
    })
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      course_id: courseId,
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || ""),
      order_number: Number(fd.get("order_number") || "1"),
      duration_minutes: Number(fd.get("duration_minutes") || "0"),
      is_free: String(fd.get("is_free") || "") === "true",
      video_id: String(fd.get("video_id") || "")
    };
    create.mutate(payload);
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsx(InstructorGuard, { children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Manage Lectures" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-2 mb-4", onSubmit, children: [
      /* @__PURE__ */ jsx("input", { name: "title", placeholder: "Lecture title", className: "border p-2 rounded", required: true }),
      /* @__PURE__ */ jsx("textarea", { name: "description", placeholder: "Description", className: "border p-2 rounded" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("input", { name: "order_number", type: "number", placeholder: "Order", className: "border p-2 rounded", defaultValue: ((_a2 = (_a = lectures.data) == null ? void 0 : _a.lectures) != null ? _a2 : []).length + 1 }),
        /* @__PURE__ */ jsx("input", { name: "duration_minutes", type: "number", placeholder: "Duration (min)", className: "border p-2 rounded" }),
        /* @__PURE__ */ jsx("input", { name: "video_id", placeholder: "Video ID (optional)", className: "border p-2 rounded" })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", name: "is_free", value: "true" }),
        " Free preview"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "px-3 py-1 bg-blue-600 text-white rounded self-start", disabled: create.isPending, children: create.isPending ? "Adding..." : "Add Lecture" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: ((_b2 = (_b = lectures.data) == null ? void 0 : _b.lectures) != null ? _b2 : []).map((l) => /* @__PURE__ */ jsx("li", { className: "p-3 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
        l.order_number,
        ". ",
        l.title
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
        l.duration_minutes,
        " min \u2022 video: ",
        l.video_id || "\u2014"
      ] })
    ] }) }, l.id)) })
  ] }) });
}

export { ManageLectures as component };
//# sourceMappingURL=dashboard.instructor.courses._courseId.lectures-CxVKaRwY.mjs.map
