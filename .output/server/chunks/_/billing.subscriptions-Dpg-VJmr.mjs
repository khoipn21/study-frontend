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

function SubscriptionsPage() {
  var _a;
  const {
    token
  } = useAuth();
  const qc = useQueryClient();
  const subs = useQuery({
    queryKey: ["billing", "subscriptions"],
    queryFn: async () => {
      var _a3;
      var _a2;
      return (_a3 = (_a2 = await api.listSubscriptions(token || "")) == null ? void 0 : _a2.subscriptions) != null ? _a3 : [];
    },
    enabled: !!token
  });
  const create = useMutation({
    mutationFn: async (payload) => api.createSubscription(token || "", payload),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["billing", "subscriptions"]
    })
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payment_method_id = String(fd.get("payment_method_id") || "");
    const plan_name = String(fd.get("plan_name") || "pro");
    const billing_period = String(fd.get("billing_period") || "monthly");
    const price = Number(fd.get("price") || "0");
    create.mutate({
      payment_method_id,
      plan_name,
      billing_period,
      price
    });
    e.currentTarget.reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Subscriptions" }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "flex flex-col gap-2 mb-4", children: [
      /* @__PURE__ */ jsx("input", { name: "payment_method_id", placeholder: "Payment Method ID", className: "border p-2 rounded", required: true }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("input", { name: "plan_name", placeholder: "Plan name", className: "border p-2 rounded", defaultValue: "pro" }),
        /* @__PURE__ */ jsx("input", { name: "billing_period", placeholder: "Billing (monthly/yearly)", className: "border p-2 rounded", defaultValue: "monthly" })
      ] }),
      /* @__PURE__ */ jsx("input", { name: "price", placeholder: "Price", className: "border p-2 rounded", defaultValue: "9.99" }),
      /* @__PURE__ */ jsx("button", { className: "px-3 py-2 bg-blue-600 text-white rounded self-start", disabled: create.isPending, children: create.isPending ? "Subscribing..." : "Create Subscription" })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: (_a = subs.data) == null ? void 0 : _a.map((s) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          s.plan_name,
          " \u2022 ",
          s.status
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
          "Next: ",
          s.next_billing_date
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
        s.billing_period,
        " \u2022 ",
        s.price
      ] })
    ] }, s.id)) })
  ] });
}

export { SubscriptionsPage as component };
//# sourceMappingURL=billing.subscriptions-Dpg-VJmr.mjs.map
