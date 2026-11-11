# JoinEazy — Student, Group & Assignment Management

A front-end SaaS prototype for managing courses, assignments, individual and group submissions, and acknowledgement workflows for students and professors. Built as a self-contained React + Vite single-page application that persists everything in the browser.

## Features

### Authentication
- Email/password login with show/hide password, remember-me, and role-based redirect.
- Registration with name, unique email, password (min 8 characters), confirm-match, and a mandatory role selection.
- Forgot-password page labelled as a demo flow.
- Simulated JWT stored in LocalStorage; sessions persist across refresh and are cleared on logout.
- Protected routes, guest-only routes, and cross-role guards that redirect to the correct dashboard.
- 404 page for unknown routes.

### Professor workspace
- Dashboard with live stats (courses, assignments, submissions, pending) derived from the data, recent assignments, submission overview, and activity feed.
- Courses list and per-course assignment management.
- Create and edit assignments; submission type is locked once any submission exists so existing records stay consistent.
- Assignment detail with progress tracking, Submitted and Pending tabs, search, and filters.
- Submission tracking for both individual (per-student) and group (per-group) assignment types.

### Student workspace
- Dashboard with enrolled courses, progress, and assignments needing attention.
- Course and assignment lists with status badges (Submitted, Pending, Overdue, Needs group), search, course filter, status filter, and sort by deadline.
- Individual acknowledgement via "Yes, I have submitted" with a confirmation modal; timestamp saved and duplicates prevented.
- Group acknowledgement: only the leader can confirm with "Yes, our group has submitted"; the status is shared across all members; non-leaders see an explanation and the leader's name.
- No-group state shows the exact message: "You are not part of any group. Create or join one to submit this assignment." with Create Group and Join Group buttons.

### Group management
- One group per course per student; no joining a second group; no cross-course groups.
- Create a group (you become leader) or join an existing one.
- "My groups" page with leader badge and member emails.
- Per-course group page with join list, create form, and leave-group (blocked once the group has submitted).

### Profile and demo data
- Profile page with name, email, role, and account creation date.
- Reset demo data action that restores the original seed and signs the user out.

## Tech stack

| Concern | Choice |
|---|---|
| Build tool | Vite |
| UI library | React 18 (JavaScript, JSX) |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Dates | date-fns |
| State | React Context (auth) + custom hooks |
| Persistence | LocalStorage behind an async service layer |

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Professor | `professor@joineazy.com` | `Professor123` |
| Student | `student@joineazy.com` | `Student123` |

Additional seeded accounts (professor `daniel.brooks@joineazy.com` and several students) are included in the seed data for a richer experience.

## Getting started

### Prerequisites
- Node.js 18 or higher
- npm

### Install and run

```bash
npm install
npm run dev
```

The dev server starts on the URL shown in the terminal.

### Build for production

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

### Lint

```bash
npm run lint
```

## Mock API and LocalStorage

JoinEazy uses **LocalStorage** as its persistence layer, not a remote database. The brief explicitly requested this, so a browser-native store was chosen over the default Supabase backend.

- All data lives under the `joineazy.db.v1` LocalStorage key as a single JSON object: `{ version, seededAt, users, courses, assignments, groups, submissions }`.
- A service layer (`src/services/`) wraps every read and write in a simulated network request (~350 ms latency) and throws typed `ServiceError` objects, so the UI exercises the same loading, error, and retry states a real API would produce.
- After any mutation, a custom `joineazy:data-changed` event is dispatched so every open view refreshes automatically.
- On first load (or if the stored data is missing/corrupt/version-mismatched), the app seeds itself with the sample dataset.

### Simulated session disclaimer

The "JWT" stored at `joineazy.session.v1` is a base64url-encoded header-payload-signature string generated client-side. It is **not** cryptographically signed and is intended only to demonstrate the auth flow. Do not treat it as production-grade security.

## Design choices

- **Role-scoped layouts:** Professor and student dashboards are fully separate, each with their own sidebar navigation and route guard.
- **Derived state:** No stats are hardcoded — every number on every dashboard is computed from the current data.
- **Submission type lock:** Editing an assignment blocks changing individual ↔ group once submissions exist, preventing inconsistent records.
- **One group per course:** Enforced in the service layer, not just the UI, so manually crafted requests are rejected.
- **Leader-only group submission:** The service checks leadership before recording an acknowledgement; non-leaders get a read-only explanation.
- **Responsive:** Sidebar becomes an overlay drawer below `lg`; cards stack; search collapses below `md`; no horizontal overflow.
- **Accessibility:** Focus rings, ARIA labels on icon-only controls, keyboard-closable modals, and `aria-live` toast regions.

## Project structure

```
src/
  components/
    assignments/     # cards, badges, tracker, editor, acknowledgement panel
    common/           # Button, Badge, Modal, ConfirmDialog, FormField, StateViews, etc.
    courses/          # CourseCard
    dashboard/        # StatCard
    forms/            # AssignmentForm, GroupForm
    layout/           # Sidebar, Navbar, navigation config
  context/            # AuthContext
  data/               # seedData
  hooks/              # useAsyncData, useAuth, useLogout, useClickOutside
  layouts/            # AppLayout, AuthLayout
  pages/
    auth/             # Login, Register, ForgotPassword
    professor/        # Dashboard, Courses, CourseAssignments, Assignments, AssignmentDetail
    student/          # Dashboard, Courses, Assignments, AssignmentDetail, Groups, CourseGroup
    profile/          # Profile
    errors/           # NotFound
  routes/             # AppRoutes, guards
  services/           # database, apiClient, auth, course, assignment, group, submission, dashboard
  utils/              # constants, formatters, validationSchemas, links, mockToken
```

## Deployment

This is a single-page application. The included `vercel.json` rewrites all routes to `index.html` so client-side routing works on Vercel:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Run `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, etc.).

## Known limitations

- All data is per-browser LocalStorage; there is no shared backend or cross-device sync.
- The session token is a mock and provides no real security.
- Password reset is a demo flow that does not send email.
- No automated tests are included; flows were verified by code review.

## Status

- Production build: passing (`npm run build`).
- Lint: passing with zero errors (`npm run lint`).
- Deployment to Vercel and GitHub submission have **not** been performed.
