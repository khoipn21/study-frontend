import { jsxs, jsx } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { l as Route$3, u as useAuth } from './ssr.mjs';
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

function CourseProgressPage() {
  var _a, _b;
  const {
    courseId
  } = Route$3.useParams();
  const {
    token
  } = useAuth();
  const qc = useQueryClient();
  const progress = useQuery({
    queryKey: ["progress", courseId],
    queryFn: async () => (await api.getCourseProgress(token || "", courseId)).data,
    enabled: !!token
  });
  const complete = useMutation({
    mutationFn: async (lectureId) => api.completeLecture(token || "", {
      course_id: courseId,
      lecture_id: lectureId,
      watch_time_seconds: 60
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["progress", courseId]
    })
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Course Progress" }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: (_b = (_a = progress.data) == null ? void 0 : _a.lecture_progress) == null ? void 0 : _b.map((lp) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          lp.order_number,
          ". ",
          lp.title
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
          Math.round(lp.progress_percentage || 0),
          "% \u2022 ",
          lp.watch_time_seconds,
          "s"
        ] })
      ] }),
      !lp.is_completed && /* @__PURE__ */ jsx("button", { className: "text-blue-600", onClick: () => complete.mutate(lp.lecture_id), children: "Mark Complete" })
    ] }, lp.lecture_id)) })
  ] });
}

export { CourseProgressPage as component };
//# sourceMappingURL=me.course._courseId.progress-DBm4JmwM.mjs.map
