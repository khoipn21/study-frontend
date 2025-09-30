## Project Overview

This is a TanStack Start + React learning management system (LMS) frontend application built with TypeScript. It includes features for course management, video streaming, progress tracking, forum discussions, payments, and AI chatbot integration.

**Key Technologies:**

- TanStack Router (file-based routing)
- TanStack Query (server state management)
- TanStack Form (form handling)
- Shadcn/UI + Tailwind CSS (styling)
- React 19
- Vite (build tool)
- Bun (package manager and runtime)

## Development Commands

**Development server (DO NOT RUN - server is already running):**

```bash
bun run dev
```

**Linting & Formatting:**

```bash
bun run lint          # Check for linting errors
bun run lint:fix      # Auto-fix linting errors
bun run format        # Format code with Prettier
bun run format:check  # Check formatting without changing files
bun run check         # Run format + lint:fix + type-check
```

**Type checking:**

```bash
bun run type-check    # Type check without emitting files
```

**Testing:**

```bash
bun run test          # Run all tests with Vitest
```

**Building:**

```bash
bun run build         # Build for production (DO NOT RUN - per instructions)
bun run serve         # Preview production build
```

**Adding Shadcn/UI components:**

```bash
pnpx shadcn@latest add <component-name>
```

## Architecture Overview

### Router & Data Fetching

- **Router configuration:** `src/router.tsx` - Creates the router with TanStack Query integration and AuthProvider wrapper
- **Route tree generation:** `src/routeTree.gen.ts` - Auto-generated from file-based routes
- **Root layout:** `src/routes/__root.tsx` - Contains global layout, navigation, and devtools

The router is configured with SSR-Query integration via `setupRouterSsrQueryIntegration` to enable server-side data fetching.

### Authentication Flow

Authentication is managed via React Context in `src/lib/auth-context.tsx`:

- Stores user and JWT token in localStorage under key `study.auth`
- Token validation with automatic expiry checks (1-minute buffer)
- Global logout events (`auth:logout`) triggered on 401 errors or invalid tokens
- Syncs auth state across browser tabs via storage events
- Provides `useAuth()` and `useAuthenticatedApi()` hooks

**Key hooks:**

- `useAuth()` - Access auth state and login/logout methods
- `useAuthenticatedApi()` - Helper for making authenticated API calls

### API Communication

API client is in `src/lib/api-client.ts`:

- Base URL configured via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8080/api/v1`)
- Two request patterns:
  1. `request<T>()` - Low-level fetch wrapper
  2. `requestGateway<T>()` - Wrapper for gateway responses with `success` field
- Named export `api` object with methods for all endpoints (auth, courses, enrollments, videos, progress, forum, payments, chat, notes, files)
- Class `ApiClient` (exported as `apiClient`) provides automatic token injection
- Automatic 401 handling triggers global logout

### TanStack Query Integration

- **Provider setup:** `src/integrations/tanstack-query/root-provider.tsx`
- **Devtools:** `src/integrations/tanstack-query/devtools.tsx`
- Query client is passed to router context for use in loaders and hooks
- Use `useQuery`, `useMutation` from `@tanstack/react-query` in components

### File-Based Routing Conventions

Routes are located in `src/routes/` and follow TanStack Router conventions:

**Patterns:**

- `index.tsx` → `/`
- `courses.index.tsx` → `/courses`
- `courses.$courseId.tsx` → `/courses/:courseId`
- `learn.$courseId.$lectureId.tsx` → `/learn/:courseId/:lectureId`
- `dashboard.instructor.courses.new.tsx` → `/dashboard/instructor/courses/new`
- `auth.login.tsx` → `/auth/login`
- `forum.topics.$topicId.tsx` → `/forum/topics/:topicId`

**Critical rules:**

- Each route file exports a named `Route` constant created via `createFileRoute('/exact/path')`
- The path string must exactly match the file's intended route
- Never have multiple files export the same route path
- Use function declarations for component exports: `function ComponentName() {}`

### Application Structure

**Core domains:**

1. **Courses** (`src/routes/courses.*`):
   - Course listing, detail views, and enrollment
   - Components: `src/components/course/`

2. **Learning Environment** (`src/routes/learn.*`):
   - Video player with HLS streaming (`src/components/course/CoursePlayer.tsx`)
   - Progress tracking and note-taking
   - Video network monitoring (`src/lib/video-service.ts`, `src/lib/network-detection.ts`)

3. **Instructor Dashboard** (`src/routes/dashboard.instructor.*`):
   - Course creation/editing with wizard steps (`src/components/course/wizard-steps/`)
   - Video upload, lecture management
   - Student analytics and communication
   - Components: `src/components/instructor/`

4. **Student Dashboard** (`src/routes/me.*`):
   - Enrolled courses, progress tracking
   - Components: `src/components/dashboard/`

5. **Forum** (`src/routes/forum.*`):
   - Topics, posts, discussions
   - Components: `src/components/forum/`
   - API: `src/lib/api/forum.ts`

6. **Payments & Billing** (`src/routes/billing.*`, `src/routes/payment-*`):
   - Stripe and Lemon Squeezy integrations
   - Payment methods, transactions, subscriptions
   - Components: `src/components/payment/`

7. **Chat** (`src/routes/chat.*`):
   - AI chatbot interface
   - Components: `src/components/chat/`

### State Management Patterns

- **Server state:** TanStack Query (queries/mutations)
- **Local component state:** React `useState`, `useReducer`
- **Global auth state:** React Context (`src/lib/auth-context.tsx`)
- **Form state:** TanStack Form (`src/hooks/demo.form.ts`)

### UI Components

- **Base components:** `src/components/ui/` (Shadcn/UI components)
- **Utility function:** `cn()` from `src/lib/utils.ts` for conditional classes
- **Theming:** CSS variables in `src/styles.css` with `next-themes` for dark mode
- **Custom animations:** Motion library (Framer Motion successor) and GSAP

### Important Utilities

- `src/lib/config.ts` - App configuration from environment variables
- `src/lib/types.ts` - Shared TypeScript types
- `src/lib/error-handling.ts` - Error handling utilities
- `src/lib/resource-service.ts` - Resource management (files, videos)
- `src/hooks/useVideoNetworkMonitoring.ts` - Adaptive video streaming based on network quality

### Database Management

**IMPORTANT:** Do not reset the database. Handle database migrations manually - do not run migration commands automatically.

### Component Patterns

- Use function declarations: `function ComponentName() {}`
- Export components as default when they're the main component
- Use TypeScript interfaces for props
- Prefer destructuring props in function parameters
- Use `type` imports for type-only imports: `import type { User } from './types'`

### Form Handling

- Use TanStack Form with the custom `useAppForm` hook from `src/hooks/demo.form.ts`
- Use Zod for validation schemas
- Leverage custom form components from `src/components/demo.FormComponents.tsx`

### Authorization Guards

- `src/components/Protected.tsx` - Protects routes requiring authentication
- `src/components/InstructorGuard.tsx` - Protects instructor-only routes
- `src/lib/auth-guards.ts` - Guard utilities

### Video Features

- HLS video streaming with adaptive bitrate
- Network quality monitoring and automatic quality adjustment
- Progress tracking tied to watch time
- Note-taking with video timestamps

### Important Notes

- **Do NOT run build** - The project server is already running
- **Shadcn components:** Always use `bunx shadcn@latest add <component>` to install
- **Path aliases:** Configured via `vite-tsconfig-paths` plugin, use `@/` prefix for imports
- **Demo files:** Files prefixed with `demo` can be safely deleted
