# AGENTS.md

This repository is a React + TypeScript + Vite frontend for an AI interview preparation platform. Agents working here should optimize for safe iteration, visual consistency, and build reliability over clever rewrites.

## Mission

- Preserve and improve a premium SaaS-style frontend for interview preparation.
- Keep changes aligned with the current route model, design tokens, and shared UI structure.
- Treat startup and dependency stability as first-class concerns.

## Repo orientation

- App entry: `src/main.tsx`
- App composition: `src/app/App.tsx`
- Route definition: `src/app/routes.tsx`
- Shared authenticated shell: `src/app/components/layouts/AppLayout.tsx`
- Pages: `src/app/pages`
- Reusable UI: `src/app/components/ui`
- Global style imports: `src/styles/index.css`
- Theme tokens: `src/styles/theme.css`
- Vite config: `vite.config.ts`
- Vite launcher workaround: `scripts/run-vite.mjs`
- Product blueprint: `APPLICATION_STRUCTURE.md`

## Non-negotiable rules

### Build and dependency safety

- Keep `react` and `react-dom` as normal runtime dependencies.
- Keep `package.json` and `package-lock.json` synchronized after dependency edits.
- Use `npm run build` to validate meaningful changes.
- Do not remove or bypass `scripts/run-vite.mjs` unless direct Vite startup has been revalidated in this environment.
- If a dev server fails only with a local port permission error, do not confuse that with an application bug.

### Architecture and file placement

- Put new pages in `src/app/pages`.
- Put shared or reusable UI in `src/app/components`.
- Keep authenticated experiences under `/app` unless there is a clear product reason not to.
- Update routing centrally in `src/app/routes.tsx`.
- Favor extension of existing primitives over inventing parallel component systems.

### Styling and design system

- Reuse tokens from `src/styles/theme.css` before introducing new color values.
- Maintain both light and dark theme behavior.
- Preserve the polished SaaS visual language already established by the current pages.
- Avoid one-off styling that fights the token system or duplicates existing utility/component patterns.

### TypeScript discipline

- Use `import type` for type-only imports.
- Keep types local and readable.
- Prefer small, explicit fixes to broad refactors unless the request clearly calls for structural work.

## Operating workflow

1. Read the relevant page, route, layout, and style files before editing.
2. Check `APPLICATION_STRUCTURE.md` for user-flow or IA-sensitive changes.
3. When touching visuals, inspect `src/styles/theme.css` first.
4. When touching startup or tooling, inspect `package.json`, `package-lock.json`, `vite.config.ts`, and `scripts/run-vite.mjs`.
5. Validate with `npm run build`.
6. Report any residual risk clearly, especially if it is environment-specific.

## Known repo-specific hazards

- A stale install can break the Vite executable shim in `node_modules/.bin`.
- This repo has already experienced `esbuild` native binary execution failures in restricted environments.
- Large bundle warnings are currently informational, not release blockers.
- Type/value import mixups can create noisy warnings even when the app still builds.

## Codex agent roles

Use these roles mentally when working here, even if the tooling does not require explicit registration:

- `frontend-architect`
  Owns route structure, shared layout decisions, and cross-page consistency.
- `design-system-keeper`
  Protects token usage, theme consistency, and component reuse.
- `tooling-guardian`
  Handles Vite, TypeScript, package management, and startup/build stability.
- `integration-finisher`
  Runs validation, checks for regressions, and makes sure the final state is shippable.

For small tasks, one agent can cover all four roles. For larger tasks, split the thinking by responsibility but keep the final implementation coherent.

## Preferred outcome

The best change in this repo is one that feels native to the existing product, keeps the build healthy, and leaves the next agent with less ambiguity than before.
