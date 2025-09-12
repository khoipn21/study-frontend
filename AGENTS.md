# Repository Guidelines

## Project Structure & Module Organization

- `src/` — application code.
  - `routes/` page routes (`*.tsx`) and server/API routes (`api.*.ts`).
  - `components/` reusable UI (PascalCase files), `integrations/` providers, `hooks/` custom hooks, `utils/` helpers, `lib/` misc.
  - `styles.css` global styles. Path alias `@/*` → `src/*` (see `tsconfig.json`).
- `public/` static assets served as-is.
- Config: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `prettier.config.js`.

## Build, Test, and Development Commands

- `bun run dev` — start Vite dev server at `http://localhost:3000`.
- `bun run build` — production build (SSR + client) to `.output/`.
- `bun run serve` — preview the built app locally.
- `bun run test` — run unit/component tests with Vitest.
- `bun run lint` — run ESLint; `bun run check` applies Prettier format + ESLint fixes.

## Coding Style & Naming Conventions

- Language: TypeScript + React (strict mode). Indentation: 2 spaces.
- Prettier: `semi: false`, `singleQuote: true`, `trailingComma: 'all'`.
- ESLint: `@tanstack/eslint-config`. Keep imports ordered; prefer functional components.
- Names: components `PascalCase`, hooks `useXxx` in `src/hooks/`, route files describe feature (e.g., `demo.tanstack-query.tsx`).

## Testing Guidelines

- Frameworks: Vitest + Testing Library (`@testing-library/react`, `jsdom`).
- Place tests alongside code as `*.test.tsx|ts` or under `__tests__/`.
- Test behavior and accessibility; mock network where needed. Example: `npm run test`.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
  - Example: `feat(routes): add MCP todos page`.
- PRs: concise description, link issues, screenshots/GIFs for UI changes, notes on breaking changes, and checklist of affected routes.

## Security & Configuration Tips

- Never commit secrets. Use env files; Vite exposes `import.meta.env.VITE_*` only. Example: `VITE_API_BASE_URL=`.
- Validate external input with `zod` where applicable.

## Agent Notes

- Scope applies repo-wide; follow existing patterns and keep changes minimal.
- Prefer `rg` for search; avoid destructive ops. Do not reformat unrelated files—use `npm run check` only for touched files.
