import { jsxs, jsx } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { u as useAuth } from './ssr.mjs';
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

function FilesPage() {
  var _a, _b;
  const {
    token
  } = useAuth();
  const qc = useQueryClient();
  const files = useQuery({
    queryKey: ["files"],
    queryFn: async () => await api.listFiles(token || "", {
      page: 1,
      limit: 20
    }),
    enabled: !!token
  });
  const upload = useMutation({
    mutationFn: async (fd) => api.uploadFile(token || "", fd),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["files"]
    })
  });
  const del = useMutation({
    mutationFn: async (fileId) => api.deleteFile(token || "", fileId),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["files"]
    })
  });
  const onUpload = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    upload.mutate(fd);
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Files" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: onUpload, className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsx("input", { type: "file", name: "file", required: true }),
      /* @__PURE__ */ jsxs("select", { name: "bucket", className: "border p-1 rounded", children: [
        /* @__PURE__ */ jsx("option", { value: "general", children: "general" }),
        /* @__PURE__ */ jsx("option", { value: "avatars", children: "avatars" }),
        /* @__PURE__ */ jsx("option", { value: "course-assets", children: "course-assets" })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1 text-sm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", name: "is_public", value: "true" }),
        " Public"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "px-3 py-1 bg-blue-600 text-white rounded", disabled: upload.isPending, children: upload.isPending ? "Uploading..." : "Upload" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white rounded border", children: (_b = (_a = files.data) == null ? void 0 : _a.files) == null ? void 0 : _b.map((f) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: f.filename || f.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
          f.content_type,
          " \u2022 ",
          Math.round((f.size || 0) / 1024),
          " KB"
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "text-red-600", onClick: () => del.mutate(f.file_id || f.id), children: "Delete" })
    ] }, f.file_id || f.id)) })
  ] });
}

export { FilesPage as component };
//# sourceMappingURL=files.index-EJqQO3vm.mjs.map
