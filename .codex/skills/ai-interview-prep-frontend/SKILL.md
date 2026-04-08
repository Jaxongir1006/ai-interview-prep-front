---
name: ai-interview-prep-frontend
description: Use when working in this repository to diagnose startup or build failures, maintain the Vite React Tailwind frontend, add or refactor routes and UI, and preserve this project's architecture, theme tokens, dependency rules, and esbuild workaround.
metadata:
  short-description: Project-specific workflow for this frontend
---

# AI Interview Prep Frontend

Use this skill for any non-trivial work in this repository. It captures the project layout, the constraints that matter, and the failure modes already observed in this codebase.

## Project map

- Entry point: `src/main.tsx`
- App shell: `src/app/App.tsx`
- Routing: `src/app/routes.tsx`
- Shared protected layout: `src/app/components/layouts/AppLayout.tsx`
- Pages: `src/app/pages/*`
- Shared UI primitives: `src/app/components/ui/*`
- Theme and global styles: `src/styles/index.css`, `src/styles/theme.css`, `src/styles/fonts.css`, `src/styles/tailwind.css`
- Build config: `vite.config.ts`
- Dev/build launcher workaround: `scripts/run-vite.mjs`
- Product structure reference: `APPLICATION_STRUCTURE.md`

## What matters in this repo

- This is a React + TypeScript + Vite frontend with Tailwind CSS v4 and token-driven theming.
- The route model is intentional:
  Public pages live at `/`, `/login`, `/register`, `/password-reset`, `/onboarding`.
  App pages live under `/app` and should usually render through `AppLayout`.
- The design system is based on reusable UI components in `src/app/components/ui`.
- Theme values should come from CSS custom properties in `src/styles/theme.css`, not from scattered hard-coded colors.
- This repo previously failed to start because of dependency drift and an `esbuild` execution issue. Those fixes are now part of the repo contract.

## Required working rules

### Startup and dependency rules

- Keep `react` and `react-dom` in `dependencies`, not `peerDependencies`.
- Keep `package.json` and `package-lock.json` aligned after dependency edits.
- Use `npm run build` as the primary validation command after meaningful changes.
- Use the existing `npm run dev` and `npm run build` scripts instead of invoking Vite directly.
- Do not remove `scripts/run-vite.mjs` unless you verify that direct Vite execution works again in this environment.

### UI and styling rules

- Prefer existing UI primitives before creating new component patterns.
- Reuse theme tokens such as `--primary`, `--muted`, `--border`, `--sidebar-*`, and chart tokens from `src/styles/theme.css`.
- Preserve dark and light mode behavior when changing colors or layout.
- Keep typography and spacing consistent with the current premium SaaS look.
- When adding custom styles, place them where they logically belong:
  Global tokens in `theme.css`, global imports in `index.css`, component-level styling near the component.

### Routing and page rules

- Update `src/app/routes.tsx` for any new page-level route.
- If a new authenticated page belongs in the main app shell, place it under `/app` and render it through `AppLayout`.
- Keep page files in `src/app/pages` and shared layout or reusable view logic in `src/app/components`.

### TypeScript and import rules

- Use `import type` for type-only imports.
- Respect the `@` alias defined in `vite.config.ts` if it improves clarity, but do not force broad import rewrites without a reason.
- Avoid adding unnecessary abstractions unless they reduce duplication across pages or shared components.

## Recommended workflow

1. Read the relevant route, layout, and page files before editing.
2. Check `APPLICATION_STRUCTURE.md` when the request affects navigation, page purpose, or app information architecture.
3. For visual changes, inspect `src/styles/theme.css` first so new UI matches the token system.
4. For startup or build failures, inspect:
   `package.json`
   `package-lock.json`
   `vite.config.ts`
   `scripts/run-vite.mjs`
5. After changes, run `npm run build`.
6. If `npm run dev` fails only with a port permission error in a restricted sandbox, treat that as an environment issue unless the build also fails.

## Known pitfalls

- A broken or stale install can leave `node_modules/.bin/vite` unusable even when `vite` exists on disk.
- This repo has already hit an `esbuild` native binary execution failure (`ETXTBSY` / `EPIPE`) during Vite startup. The wrapper script exists to avoid that.
- Vite or Rollup warnings about large chunks are currently non-blocking. Treat them as optimization work, not immediate breakage.
- If a library exports a type only, importing it as a value can create avoidable build warnings.

## Definition of done

- The requested change fits the current route and component structure.
- Theme consistency is preserved in both light and dark modes.
- Dependencies remain coherent.
- `npm run build` passes.
- Any remaining limitation is clearly called out as environmental or intentionally deferred.
