# Done Checklist (Before Hand-off)

- Build: `bun run build` completes without errors.
- Lint/Format: `bun run check` applied to touched files only.
- Tests: `bun run test` passes (or failing tests are documented with rationale).
- Dev run: `bun run dev` starts and the changed routes render.
- Security: No secrets committed; envs use `VITE_*`.
- Docs: Brief notes in PR description; screenshots/GIFs for UI changes.
- Commits: Conventional Commits style (e.g., `feat(routes): ...`).
