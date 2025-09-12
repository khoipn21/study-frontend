import { jsx, jsxs } from 'react/jsx-runtime';
import { z } from 'zod';
import { u as useAppForm } from './demo.form-JG5l18qT.mjs';
import 'react';
import '@tanstack/form-core';
import '@tanstack/react-store';
import './ssr.mjs';
import '@tanstack/react-router';
import '@tanstack/react-query';
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
import '@modelcontextprotocol/sdk/server/streamableHttp.js';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';
import '@tanstack/react-router/ssr/server';
import './textarea-BwlHZp3V.mjs';
import './select-BQyaqGxc.mjs';
import '@radix-ui/react-select';
import './label-DJNj9mF1.mjs';
import '@radix-ui/react-label';

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required")
});
function SimpleForm() {
  const form = useAppForm({
    defaultValues: {
      title: "",
      description: ""
    },
    validators: {
      onBlur: schema
    },
    onSubmit: ({
      value
    }) => {
      console.log(value);
      alert("Form submitted successfully!");
    }
  });
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white", style: {
    backgroundImage: "radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)"
  }, children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }, className: "space-y-6", children: [
    /* @__PURE__ */ jsx(form.AppField, { name: "title", children: (field) => /* @__PURE__ */ jsx(field.TextField, { label: "Title" }) }),
    /* @__PURE__ */ jsx(form.AppField, { name: "description", children: (field) => /* @__PURE__ */ jsx(field.TextArea, { label: "Description" }) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(form.AppForm, { children: /* @__PURE__ */ jsx(form.SubscribeButton, { label: "Submit" }) }) })
  ] }) }) });
}

export { SimpleForm as component };
//# sourceMappingURL=demo.form.simple-CCJVQvWo.mjs.map
