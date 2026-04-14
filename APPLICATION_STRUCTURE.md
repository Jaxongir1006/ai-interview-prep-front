# AI Interview Preparation Platform

This document describes the frontend structure, current implementation status, and the backend APIs needed to make the product fully data-driven.

## Product Summary

InterviewAI is a SaaS-style interview preparation app for software developers. The frontend is built with React, TypeScript, Vite, Tailwind CSS, Radix/shadcn-style UI primitives, Motion, Recharts, and `next-themes`.

The app currently has a polished UI shell, real authentication/onboarding API integration, and mock data for the core interview, dashboard, analytics, profile, and results experiences.

## Route Map

### Public Routes

| Route | Page | Purpose | Backend status |
| --- | --- | --- | --- |
| `/` | Landing page | Marketing and primary CTA | Static |
| `/login` | Login page | Email/password and social sign-in | Integrated |
| `/register` | Register page | Account creation | Integrated |
| `/verify-email` | Verify email page | Email verification and resend flow | Integrated |
| `/password-reset` | Password reset page | Password recovery UI | UI present, backend TBD |
| `/onboarding` | Onboarding flow | Target role, level, and topic preferences | Integrated |
| `/oauth/:provider/callback` | OAuth callback | GitHub/Google login callback | Integrated |

### Protected App Routes

All authenticated routes live under `/app` and render inside the shared sidebar/topbar layout.

| Route | Page | Purpose | Backend status |
| --- | --- | --- | --- |
| `/app` | Dashboard | Summary stats, charts, topic insights, recent activity, CTA | Mock data |
| `/app/interview` | Interview session | Question flow, timer, answers, code/text mode | Mock data |
| `/app/results/:sessionId` | Results | Score report, topic breakdown, feedback, recommendations | Mock data |
| `/app/analytics` | Analytics | Historical performance and filters | Mock data |
| `/app/profile` | Profile | User details, proficiency, achievements, preferences | Mock data |
| `/app/settings` | Settings | Account, theme, notifications, security | Mostly local/mock |

## Frontend Architecture

| Area | File |
| --- | --- |
| App entry | `src/main.tsx` |
| App providers | `src/app/App.tsx` |
| Route definitions | `src/app/routes.tsx` |
| Protected app shell | `src/app/components/layouts/AppLayout.tsx` |
| Pages | `src/app/pages` |
| Reusable UI | `src/app/components/ui` |
| Auth/session helpers | `src/app/lib/auth.ts` |
| API client | `src/app/lib/api.ts` |
| OAuth helpers | `src/app/lib/oauth.ts` |
| Global styles | `src/styles/index.css` |
| Theme tokens | `src/styles/theme.css` |
| Vite launcher workaround | `scripts/run-vite.mjs` |

## Current Backend Integration

| Flow | Endpoint |
| --- | --- |
| Register | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Refresh token | `POST /api/v1/auth/refresh-token` |
| GitHub OAuth | `POST /api/v1/auth/github-oauth-login` |
| Google OAuth | `POST /api/v1/auth/google-oauth-login` |
| Verify email | `POST /api/v1/auth/verify-email` |
| Resend verification | `POST /api/v1/auth/resend-verification-email` |
| Complete onboarding | `POST /api/v1/me/complete-onboarding` |

## Dashboard Backend API Plan

Start with one aggregate endpoint for the first dashboard render:

```http
GET /api/v1/dashboard/overview?range=7d
Authorization: Bearer <access_token>
```

The response should include:

- Current user summary
- Quick stats and deltas
- Performance trend points
- Topic performance
- Weak and strong topics
- Recent activity
- Recommended next interview setup

Use smaller endpoints later for filtering, pagination, and partial refreshes:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/dashboard/stats?range=7d` | Refresh summary cards |
| `GET /api/v1/dashboard/performance-trend?range=30d&topic_id=algorithms` | Filter chart data |
| `GET /api/v1/dashboard/topics?range=30d` | Topic performance |
| `GET /api/v1/dashboard/recent-activity?limit=10&cursor=<cursor>` | Paginated activity |
| `GET /api/v1/dashboard/recommendations` | Topic and next-session recommendations |

Detailed dashboard JSON contracts are in `workfile.md`.

## APIs Needed Beyond Dashboard

### Interview Sessions

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/interview-sessions` | Start a new interview session |
| `GET` | `/api/v1/interview-sessions/:sessionId` | Load session state |
| `POST` | `/api/v1/interview-sessions/:sessionId/answers` | Save or update an answer |
| `POST` | `/api/v1/interview-sessions/:sessionId/submit` | Finish session and trigger scoring |
| `GET` | `/api/v1/interview-sessions/:sessionId/results` | Load scored results |

### Analytics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/analytics/summary` | Overall analytics summary |
| `GET` | `/api/v1/analytics/performance` | Historical score/time chart data |
| `GET` | `/api/v1/analytics/difficulty` | Difficulty distribution |
| `GET` | `/api/v1/analytics/topics` | Topic-level analytics |

### Profile And Settings

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/me` | Current user profile |
| `PATCH` | `/api/v1/me` | Update user profile |
| `GET` | `/api/v1/me/preferences` | Load interview preferences |
| `PATCH` | `/api/v1/me/preferences` | Update interview preferences |
| `GET` | `/api/v1/me/notifications` | Load notification settings |
| `PATCH` | `/api/v1/me/notifications` | Update notification settings |
| `POST` | `/api/v1/auth/password-reset/request` | Request password reset |
| `POST` | `/api/v1/auth/password-reset/confirm` | Confirm password reset |
| `DELETE` | `/api/v1/me` | Delete account |

## Build And Tooling

Use the wrapper scripts:

```bash
npm run dev
npm run build
```

Do not bypass `scripts/run-vite.mjs` unless direct Vite execution has been revalidated in this environment.

## Implementation Priorities

1. Replace dashboard mock data with `GET /api/v1/dashboard/overview`.
2. Add loading, empty, and error states to the dashboard.
3. Connect recent activity rows to real results pages.
4. Start interview sessions through `POST /api/v1/interview-sessions`.
5. Persist answers and submit sessions to the backend.
6. Replace results mock data with scored backend results.
7. Connect analytics, profile, and settings to their dedicated APIs.
