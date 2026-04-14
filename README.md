# AI Interview Prep Frontend

A React + TypeScript + Vite frontend for an AI-powered interview preparation platform. The app provides authentication, onboarding, a protected SaaS dashboard shell, interview practice screens, results, analytics, profile, and settings pages.

The current frontend includes real auth/onboarding API integration and polished mock-driven product pages. The next major step is replacing dashboard, interview, analytics, profile, and results mock data with backend APIs.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI / shadcn-style components |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Animation | Motion |
| Themes | next-themes |
| Notifications | Sonner |

## Project Structure

```text
src
  app
    App.tsx
    routes.tsx
    components
      layouts
      ui
    lib
    pages
  styles
    fonts.css
    index.css
    tailwind.css
    theme.css
scripts
  run-vite.mjs
```

Important files:

| File | Purpose |
| --- | --- |
| `src/main.tsx` | React entry point |
| `src/app/App.tsx` | App providers and router mount |
| `src/app/routes.tsx` | Central route definitions |
| `src/app/components/layouts/AppLayout.tsx` | Protected app sidebar/topbar layout |
| `src/app/lib/api.ts` | Backend API client |
| `src/app/lib/auth.ts` | Local auth session helpers |
| `src/styles/theme.css` | Light/dark theme tokens |
| `vite.config.ts` | Vite, React, Tailwind, and alias config |
| `scripts/run-vite.mjs` | Vite launcher with esbuild workaround |

## Routes

### Public Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/verify-email` | Email verification |
| `/password-reset` | Password reset |
| `/onboarding` | Onboarding |
| `/oauth/:provider/callback` | OAuth callback |

### Protected Routes

Protected routes live under `/app` and require a valid access token.

| Route | Page |
| --- | --- |
| `/app` | Dashboard |
| `/app/interview` | Interview session |
| `/app/results/:sessionId` | Results |
| `/app/analytics` | Analytics |
| `/app/profile` | Profile |
| `/app/settings` | Settings |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL |
| `VITE_GITHUB_CLIENT_ID` | For GitHub OAuth | GitHub OAuth client ID |
| `VITE_GOOGLE_CLIENT_ID` | For Google OAuth | Google OAuth client ID |
| `VITE_OAUTH_REDIRECT_ORIGIN` | Optional | Fixed frontend origin for OAuth redirects |

Example:

```env
VITE_API_URL=http://localhost:9876
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_OAUTH_REDIRECT_ORIGIN=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

The dev server is started through `scripts/run-vite.mjs`. Use this script instead of calling Vite directly.

### 4. Build For Production

```bash
npm run build
```

Large bundle warnings are currently informational. They can be improved later with route-level code splitting.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run sync:backend-docs` | Clone or update backend docs into ignored `tmp/ai-interview-prep-api` |

## Backend Integration Status

Already integrated:

| Flow | Endpoint |
| --- | --- |
| Register | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Refresh token | `POST /api/v1/auth/refresh-token` |
| GitHub OAuth login | `POST /api/v1/auth/github-oauth-login` |
| Google OAuth login | `POST /api/v1/auth/google-oauth-login` |
| Verify email | `POST /api/v1/auth/verify-email` |
| Resend verification email | `POST /api/v1/auth/resend-verification-email` |
| Complete onboarding | `POST /api/v1/me/complete-onboarding` |

Still mock-driven:

| Area | Needed |
| --- | --- |
| Dashboard | Stats, charts, topic performance, recent activity, recommendations |
| Interview session | Start session, load questions, save answers, submit session |
| Results | Score report, feedback, topic breakdown, recommendations |
| Analytics | Historical performance, topic filters, difficulty distribution |
| Profile | Real user data, proficiency, achievements |
| Settings | Account updates, notifications, security actions |

## Recommended Dashboard API

Start with one aggregate endpoint for the first dashboard load:

```http
GET /api/v1/dashboard/overview
Authorization: Bearer <access_token>
```

This endpoint should return:

- Current user summary
- Quick stats
- Performance trend points
- Topic performance
- Weak topics
- Strong topics
- Recent activity
- Recommended next interview setup

Detailed JSON contracts are documented in `workfile.md`.

## Documentation

| File | Purpose |
| --- | --- |
| `APPLICATION_STRUCTURE.md` | Product structure, route map, architecture, and API plan |
| `workfile.md` | Dashboard API JSON contracts |
| `AGENTS.md` | Repo-specific engineering rules for agents |

## Styling Guidelines

- Reuse theme tokens from `src/styles/theme.css`.
- Preserve both light and dark mode behavior.
- Prefer existing components from `src/app/components/ui`.
- Keep new pages in `src/app/pages`.
- Keep shared reusable UI in `src/app/components`.
- Update routes only in `src/app/routes.tsx`.

## Tooling Notes

This repo uses `scripts/run-vite.mjs` to start Vite and set a patched esbuild binary path. Keep this wrapper in place unless direct Vite execution has been revalidated in the local environment.

Known local hazards:

- A stale install can break the Vite executable shim in `node_modules/.bin`.
- Restricted environments can trigger esbuild native binary execution issues.
- Port permission errors during dev server startup are usually local environment issues, not app bugs.

## Original Design Source

The UI originated from a Figma design:

https://www.figma.com/design/p4VmOEWeKZxBvyDXWeDu6w/AI-Interview-Prep-Platform-UI
