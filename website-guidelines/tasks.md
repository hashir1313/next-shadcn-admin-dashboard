# Trakki — Tasks

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

- [ ] **auth-login** — Login page with email/password form
- [ ] **auth-register** — Registration page with form validation
- [ ] **auth-forgot-password** — Forgot password flow
- [ ] **auth-reset-password** — Reset password page

## Phase 4: Dashboard Layout

- [ ] **dashboard-shell** — Sidebar + header layout with navigation
- [ ] **dashboard-overview** — Stats cards and recent projects
- [ ] **dashboard-sidebar** — Navigation menu with icons

## Phase 5: Project Management

- [ ] **project-list** — Projects table with filters and sort
- [ ] **project-create** — Create project form with validation
- [ ] **project-details** — Project detail view with milestones
- [ ] **project-edit** — Edit project form
- [ ] **project-delete** — Delete confirmation dialog

## Phase 6: Milestone Management

- [ ] **milestone-list** — Milestones list with status badges
- [ ] **milestone-create** — Add milestone form
- [ ] **milestone-edit** — Edit milestone form
- [ ] **milestone-reorder** — Drag-and-drop reordering with DND Kit
- [ ] **milestone-status** — Toggle milestone status (pending/in_progress/completed)

## Phase 7: Public Client Page

- [ ] **public-layout** — Public page layout (no auth)
- [ ] **public-header** — Project header with freelancer info
- [ ] **public-progress** — Progress bar with percentage
- [ ] **public-milestones** — Completed and remaining milestones
- [ ] **public-timeline** — Activity timeline
- [ ] **public-contact** — Contact button (mailto)

## Phase 8: Settings & Profile

- [ ] **settings-page** — User settings form
- [ ] **profile-page** — Profile edit with name/email
- [ ] **theme-toggle** — Light/dark mode switcher

## Phase 9: Polish

- [ ] **loading-states** — Skeleton loaders for all pages
- [ ] **error-states** — Error boundaries and fallbacks
- [ ] **empty-states** — Empty state components
- [ ] **responsive** — Mobile optimization pass
- [ ] **animations** — Motion transitions for page changes

---

## Reference Files

| Section | Content Source |
|---------|---------------|
| Product Brief | `website-guidelines/product-brief.md` |
| Design System | `website-guidelines/STYLE_GUIDE.md` |
| Requirements | `website-guidelines/PROJECT_REQUIREMENTS.md` |
