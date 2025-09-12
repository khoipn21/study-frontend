import { jsxs, jsx } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { g as Route$9, u as useAuth } from './ssr.mjs';
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

function TopicPage() {
  var _a2;
  var _a, _b, _c, _d;
  const {
    topicId
  } = Route$9.useParams();
  const {
    token,
    user
  } = useAuth();
  const qc = useQueryClient();
  const topic = useQuery({
    queryKey: ["forum", "topic", topicId],
    queryFn: async () => await api.getTopic(topicId)
  });
  const posts = useQuery({
    queryKey: ["forum", "topic", topicId, "posts"],
    queryFn: async () => await api.listTopicPosts(topicId, {
      page: 1,
      limit: 50
    })
  });
  const createPost = useMutation({
    mutationFn: async (content) => api.createPost(token || "", {
      topic_id: topicId,
      content
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["forum", "topic", topicId, "posts"]
    })
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const content = String(fd.get("content") || "");
    createPost.mutate(content);
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-2", children: (_a2 = (_a = topic.data) == null ? void 0 : _a.title) != null ? _a2 : "Topic" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: (_b = topic.data) == null ? void 0 : _b.description }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: (_d = (_c = posts.data) == null ? void 0 : _c.posts) == null ? void 0 : _d.map((p) => /* @__PURE__ */ jsxs("li", { className: "p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: p.content }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
        "by ",
        p.user_id,
        " at ",
        new Date(p.created_at).toLocaleString()
      ] })
    ] }, p.id)) }),
    user && /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("textarea", { name: "content", placeholder: "Write a reply...", className: "border p-2 rounded", required: true }),
      /* @__PURE__ */ jsx("button", { className: "px-3 py-2 bg-blue-600 text-white rounded self-start", disabled: createPost.isPending, children: createPost.isPending ? "Posting..." : "Post" })
    ] })
  ] });
}

export { TopicPage as component };
//# sourceMappingURL=forum.topics._topicId-Dvh1Irv3.mjs.map
