import { jsxs, jsx } from 'react/jsx-runtime';
import { useQuery } from '@tanstack/react-query';
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

function TransactionsPage() {
  var _a;
  const {
    token
  } = useAuth();
  const tx = useQuery({
    queryKey: ["billing", "transactions"],
    queryFn: async () => {
      var _a3;
      var _a2;
      return (_a3 = (_a2 = await api.listTransactions(token || "", {
        limit: 50,
        offset: 0
      })) == null ? void 0 : _a2.transactions) != null ? _a3 : [];
    },
    enabled: !!token
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Transactions" }),
    /* @__PURE__ */ jsx("ul", { className: "divide-y bg-white border rounded", children: (_a = tx.data) == null ? void 0 : _a.map((t) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
          t.status,
          " \u2022 ",
          t.amount,
          " ",
          t.currency
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: new Date(t.created_at).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t.transaction_reference })
    ] }, t.id)) })
  ] });
}

export { TransactionsPage as component };
//# sourceMappingURL=billing.transactions-B_EU7jp_.mjs.map
