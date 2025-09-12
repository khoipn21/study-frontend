import { jsx, Fragment } from 'react/jsx-runtime';
import { u as useAuth } from './ssr.mjs';

function InstructorGuard({ children }) {
  const { user } = useAuth();
  const allowed = user && (user.role === "instructor" || user.role === "admin");
  if (!allowed) {
    return /* @__PURE__ */ jsx("div", { className: "p-4", children: "Instructor access required." });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}

export { InstructorGuard as I };
//# sourceMappingURL=InstructorGuard-BFlWVyU4.mjs.map
