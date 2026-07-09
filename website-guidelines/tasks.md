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

## Phase 10: Admin Panel — Database Schema

- [ ] **admin-schema** — Add UserRole, UserStatus, FeedbackStatus enums to Prisma schema
- [ ] **admin-plan-model** — Create Plan model (name, maxProjects, features JSON, pricing JSON, isDefault)
- [ ] **admin-invite-code-model** — Create InviteCode model (code, assignedPlanId, maxUses, currentUses, expiresAt, isActive)
- [ ] **admin-feedback-model** — Create Feedback model (userId, category, message, status)
- [ ] **admin-feature-flag-model** — Create FeatureFlag model (key, name, description, isEnabled)
- [ ] **admin-announcement-model** — Create Announcement model (title, content, isActive)
- [ ] **admin-user-update** — Add role, status, planId, inviteCodeId, lastActiveAt fields to User model
- [ ] **admin-seed** — Seed default plan and set first user as admin

## Phase 11: Admin Panel — API Routes

- [ ] **admin-auth-middleware** — Update proxy.ts to protect /admin/* routes with role check
- [ ] **admin-api-stats** — GET /api/admin/stats (dashboard statistics)
- [ ] **admin-api-users** — GET/PUT /api/admin/users (list, update role/status/plan)
- [ ] **admin-api-users-id** — GET/PUT/DELETE /api/admin/users/[id] (single user CRUD)
- [ ] **admin-api-invite-codes** — GET/POST /api/admin/invite-codes (list, create)
- [ ] **admin-api-invite-codes-id** — GET/PUT/DELETE /api/admin/invite-codes/[id] (single code CRUD)
- [ ] **admin-api-plans** — GET/POST /api/admin/plans (list, create)
- [ ] **admin-api-plans-id** — GET/PUT/DELETE /api/admin/plans/[id] (single plan CRUD)
- [ ] **admin-api-feedback** — GET /api/admin/feedback (list with filters)
- [ ] **admin-api-feedback-id** — GET/PUT /api/admin/feedback/[id] (update status)
- [ ] **admin-api-feature-flags** — GET/POST /api/admin/feature-flags (list, create)
- [ ] **admin-api-feature-flags-id** — GET/PUT/DELETE /api/admin/feature-flags/[id] (single flag CRUD)
- [ ] **admin-api-announcements** — GET/POST /api/admin/announcements (list, create)
- [ ] **admin-api-announcements-id** — GET/PUT/DELETE /api/admin/announcements/[id] (single announcement CRUD)

## Phase 12: Admin Panel — Layout & Navigation

- [ ] **admin-layout** — Create (admin) route group with separate layout
- [ ] **admin-sidebar** — Admin sidebar with navigation items (Dashboard, Users, Invite Codes, Plans, Feedback, Feature Flags, Announcements)
- [ ] **admin-header** — Admin header with user info and back to app link

## Phase 13: Admin Panel — Pages

- [ ] **admin-dashboard** — Dashboard page with stats cards, recent signups, users by plan chart
- [ ] **admin-users-page** — Users table with columns: Name, Email, Plan, Role, Invite Code Used, Projects, Joined Date, Last Active, Status
- [ ] **admin-users-actions** — User actions: View Profile, Change Plan, Edit Role, Suspend, Delete
- [ ] **admin-invite-codes-page** — Invite codes table with columns: Code, Assigned Plan, Max Uses, Current Uses, Expires, Status
- [ ] **admin-invite-codes-actions** — Invite code actions: Create, Edit, Deactivate, Delete
- [ ] **admin-plans-page** — Plans list/card view with Create/Edit plan dialog
- [ ] **admin-plans-form** — Plan form with Name, Max Projects, Features checkboxes, Pricing fields
- [ ] **admin-feedback-page** — Feedback table with columns: User, Category, Message, Status
- [ ] **admin-feedback-modal** — View feedback entry modal with status change
- [ ] **admin-feature-flags-page** — Feature flags table with toggle switches
- [ ] **admin-feature-flags-actions** — Feature flag actions: Create, Toggle, Edit, Delete
- [ ] **admin-announcements-page** — Announcements table with columns: Title, Content, Active, Created
- [ ] **admin-announcements-actions** — Announcement actions: Create, Edit, Toggle Active, Delete

## Phase 14: User-Side Integration

- [ ] **register-invite-code** — Add invite code field to registration form
- [ ] **register-plan-assignment** — Assign plan on registration (from invite code or default)
- [ ] **settings-plan-display** — Show current plan in settings page
- [ ] **api-plan-enforcement** — Enforce max projects limit in project creation
- [ ] **feature-flag-check** — Utility to check global feature flags
- [ ] **plan-feature-check** — Utility to check plan-specific features
- [ ] **announcements-banner** — Display active announcements in dashboard
- [ ] **announcements-dismiss** — Allow users to dismiss announcements

---

## Reference Files

| Section | Content Source |
|---------|---------------|
| Product Brief | `website-guidelines/product-brief.md` |
| Design System | `website-guidelines/STYLE_GUIDE.md` |
| Requirements | `website-guidelines/PROJECT_REQUIREMENTS.md` |
| Admin Plan | `AGENTS.md` (Phase 10-14 tasks) |
