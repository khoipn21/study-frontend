import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

function TanStackQueryDemo() {
  const {
    data,
    refetch
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/demo-tq-todos").then((res) => res.json()),
    initialData: []
  });
  const {
    mutate: addTodo
  } = useMutation({
    mutationFn: (todo2) => fetch("/api/demo-tq-todos", {
      method: "POST",
      body: JSON.stringify(todo2)
    }).then((res) => res.json()),
    onSuccess: () => refetch()
  });
  const [todo, setTodo] = useState("");
  const submitTodo = useCallback(async () => {
    await addTodo(todo);
    setTodo("");
  }, [addTodo, todo]);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black p-4 text-white", style: {
    backgroundImage: "radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)"
  }, children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl mb-4", children: "TanStack Query Todos list" }),
    /* @__PURE__ */ jsx("ul", { className: "mb-4 space-y-2", children: data.map((t) => /* @__PURE__ */ jsx("li", { className: "bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md", children: /* @__PURE__ */ jsx("span", { className: "text-lg text-white", children: t.name }) }, t.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("input", { type: "text", value: todo, onChange: (e) => setTodo(e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter") {
          submitTodo();
        }
      }, placeholder: "Enter a new todo...", className: "w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" }),
      /* @__PURE__ */ jsx("button", { disabled: todo.trim().length === 0, onClick: submitTodo, className: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors", children: "Add todo" })
    ] })
  ] }) });
}

export { TanStackQueryDemo as component };
//# sourceMappingURL=demo.tanstack-query-BUOF8N1a.mjs.map
