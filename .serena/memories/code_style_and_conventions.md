# Code Style & Conventions

- Formatting: Prettier (`semi: false`, `singleQuote: true`, `trailingComma: 'all'`).
- ESLint: `@tanstack/eslint-config`; keep imports ordered; prefer functional components.
- TypeScript: `strict: true`, `noUnusedLocals/Parameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.
- Naming:
  - Components: `PascalCase` in `src/components/`
  - Hooks: `useXxx` in `src/hooks/`
  - Routes: descriptive file names in `src/routes/` (e.g., `demo.tanstack-query.tsx`).
- Routing: File-based with TanStack Router; root layout in `src/routes/__root.tsx`.
- Paths: Use `@/*` alias to import from `src/*`.
- Testing: Place tests alongside code as `*.test.tsx|ts` or under `__tests__/`.
- Security: Do not commit secrets; only expose `VITE_*` envs via Vite (`import.meta.env`).
- Validation: Prefer `zod` for external input.
