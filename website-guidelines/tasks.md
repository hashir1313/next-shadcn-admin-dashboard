# Traqqy — Tasks

Always mark with done when a task is done

## Phase 1: Project Setup

- [x] **verify-core** — Next.js, TypeScript, Tailwind, shadcn/ui already configured
- [x] **verify-ui-deps** — Lucide, Sonner, CVA, clsx, tailwind-merge already installed
- [x] **verify-state-deps** — Zustand, React Hook Form, Zod already installed
- [x] **verify-dnd** — DND Kit already installed
- [x] **install-prisma** — Install Prisma and configure with PostgreSQL
- [x] **install-query** — Install TanStack Query for data fetching
- [x] **install-auth** — Install Better Auth for authentication
- [x] **install-motion** — Install Motion for animations
- [x] **setup-prisma** — Initialize Prisma schema with base models

## Phase 2: Database & API

- [x] **setup-schema** — Create User, Project, Milestone, ActivityLog models
- [x] **api-projects** — CRUD endpoints for projects
- [x] **api-milestones** — CRUD endpoints for milestones with reorder
- [x] **api-public** — Public endpoint for client page data

## Phase 3: Authentication

- [x] **auth-login** — Login page with email/password form
- [x] **auth-register** — Registration page with form validation
- [x] **auth-forgot-password** — Forgot password flow
- [x] **auth-reset-password** — Reset password page

## Phase 4: Dashboard Layout

- [x] **dashboard-shell** — Sidebar + header layout with navigation
- [x] **dashboard-overview** — Stats cards and recent projects
- [x] **dashboard-sidebar** — Navigation menu with icons

## Phase 5: Project Management

- [x] **project-list** — Projects table with filters and sort
- [x] **project-create** — Create project form with validation
- [x] **project-details** — Project detail view with milestones
- [x] **project-edit** — Edit project form
- [x] **project-delete** — Delete confirmation dialog

## Phase 6: Milestone Management

- [x] **milestone-list** — Milestones list with status badges
- [x] **milestone-create** — Add milestone form
- [x] **milestone-edit** — Edit milestone form
- [x] **milestone-reorder** — Drag-and-drop reordering with DND Kit
- [x] **milestone-status** — Toggle milestone status (pending/in_progress/completed)

## Phase 7: Public Client Page

- [x] **public-layout** — Public page layout (no auth)
- [x] **public-header** — Project header with freelancer info
- [x] **public-progress** — Progress bar with percentage
- [x] **public-milestones** — Completed and remaining milestones
- [x] **public-timeline** — Activity timeline
- [x] **public-contact** — Contact button (mailto)

## Phase 8: Settings & Profile

- [x] **settings-page** — User settings form
- [x] **profile-page** — Profile edit with name/email
- [x] **theme-toggle** — Light/dark mode switcher

## Phase 9: Polish

- [x] **loading-states** — Skeleton loaders for all pages
- [x] **error-states** — Error boundaries and fallbacks
- [x] **empty-states** — Empty state components
- [x] **responsive** — Mobile optimization pass
- [x] **animations** — Motion transitions for page changes

---

## Reference Files

| Section | Content Source |
|---------|---------------|
| Product Brief | `website-guidelines/product-brief.md` |
| Design System | `website-guidelines/STYLE_GUIDE.md` |
| Requirements | `website-guidelines/PROJECT_REQUIREMENTS.md` |
