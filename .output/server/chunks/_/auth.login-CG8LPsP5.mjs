import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import React__default from 'react';
import { a as api } from './api-client-Dtm8Zh8Q.mjs';
import { u as useAuth } from './ssr.mjs';
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

function LoginPage() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [error, setError] = React__default.useState(null);
  const mutation = useMutation({
    mutationFn: (payload) => api.login(payload),
    onSuccess: (res) => {
      const data = res.data;
      login(data.user, data.token);
      navigate({
        to: "/courses/"
      });
    },
    onError: (e) => setError((e == null ? void 0 : e.message) || "Login failed")
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    mutation.mutate({
      email,
      password
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Login" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-3", onSubmit, children: [
      /* @__PURE__ */ jsx("input", { name: "email", type: "email", placeholder: "Email", className: "border rounded p-2", required: true }),
      /* @__PURE__ */ jsx("input", { name: "password", type: "password", placeholder: "Password", className: "border rounded p-2", required: true }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50", disabled: mutation.isPending, children: mutation.isPending ? "Logging in..." : "Login" }),
      error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: error })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm mt-3", children: [
      "No account?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/auth/register", className: "text-blue-600 underline", children: "Register" })
    ] })
  ] });
}

export { LoginPage as component };
//# sourceMappingURL=auth.login-CG8LPsP5.mjs.map
