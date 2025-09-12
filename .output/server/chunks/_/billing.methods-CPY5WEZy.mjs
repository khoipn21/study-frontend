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

function PaymentMethodsPage() {
  var _a;
  const {
    token
  } = useAuth();
  const qc = useQueryClient();
  const methods = useQuery({
    queryKey: ["billing", "methods"],
    queryFn: async () => {
      var _a2;
      return (_a2 = (await api.listPaymentMethods(token || "")).payment_methods) != null ? _a2 : [];
    },
    enabled: !!token
  });
  const create = useMutation({
    mutationFn: async (payload) => api.createPaymentMethod(token || "", payload),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["billing", "methods"]
    })
  });
  const del = useMutation({
    mutationFn: async (id) => api.deletePaymentMethod(token || "", id),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["billing", "methods"]
    })
  });
  const setDefault = useMutation({
    mutationFn: async (id) => api.setDefaultPaymentMethod(token || "", id),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["billing", "methods"]
    })
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const provider = String(fd.get("provider") || "stripe");
    const tokenVal = String(fd.get("token") || "");
    const last4 = String(fd.get("last4") || "");
    const expiry = String(fd.get("expiry") || "");
    create.mutate({
      provider,
      token: tokenVal,
      card_last_four: last4,
      card_expiry: expiry
    });
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Payment Methods" }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "flex flex-col gap-2 mb-4", children: [
      /* @__PURE__ */ jsx("input", { name: "provider", placeholder: "Provider (e.g., stripe)", className: "border p-2 rounded", defaultValue: "stripe" }),
      /* @__PURE__ */ jsx("input", { name: "token", placeholder: "Provider token", className: "border p-2 rounded", required: true }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("input", { name: "last4", placeholder: "Card last 4", className: "border p-2 rounded" }),
        /* @__PURE__ */ jsx("input", { name: "expiry", placeholder: "MM/YYYY", className: "border p-2 rounded" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "px-3 py-2 bg-blue-600 text-white rounded self-start", disabled: create.isPending, children: create.isPending ? "Adding..." : "Add Method" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: (_a = methods.data) == null ? void 0 : _a.map((m) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          m.provider,
          " \u2022\u2022\u2022\u2022",
          m.card_last_four
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: m.card_expiry })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: "text-blue-600", onClick: () => setDefault.mutate(m.id), children: "Make default" }),
        /* @__PURE__ */ jsx("button", { className: "text-red-600", onClick: () => del.mutate(m.id), children: "Delete" })
      ] })
    ] }, m.id)) })
  ] });
}

export { PaymentMethodsPage as component };
//# sourceMappingURL=billing.methods-CPY5WEZy.mjs.map
