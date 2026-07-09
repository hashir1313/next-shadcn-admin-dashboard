# Project Requirements — Traqqy

## Overview

Traqqy is a SaaS platform enabling freelancers to share real-time project progress with clients through public milestone pages, reducing communication overhead and building trust.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide |
| Animations | Motion |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Forms | React Hook Form |
| State | Zustand |
| Drag & Drop | DND Kit |
| Data Fetching | TanStack Query |
| Authentication | Better Auth |
| Notifications | Sonner |
| Package Manager | Bun |

---

## Core Features

### 1. Authentication

- Email/password registration and login
- Forgot password flow
- Password reset via email link
- Session management
- Protected dashboard routes

### 2. Project Management

- Create, edit, delete projects
- Project fields: name, description, status, client info
- Unique shareable slug per project
- Project status: Draft, Active, Paused, Completed

### 3. Milestone Tracking

- Create milestones within projects
- Fields: title, description, status, order
- Statuses: Pending, In Progress, Completed
- Drag-and-drop reordering (DND Kit)
- Bulk status updates

### 4. Public Client Page

- Unique public URL per project
- Project header with freelancer info
- Progress bar with percentage
- Completed/remaining milestones list
- Activity timeline
- Last updated timestamp
- Contact button (mailto link)

### 5. Dashboard

- Overview with project stats
- Project list with filters/sort
- Create/edit project forms
- Client view preview
- Settings and profile management

---

## Data Models

### User

```
id            UUID
email         String (unique)
name          String
passwordHash  String
createdAt     DateTime
updatedAt     DateTime
```

### Project

```
id            UUID
userId        UUID (FK → User)
name          String
description   String?
status        Enum (draft, active, paused, completed)
slug          String (unique, auto-generated)
clientName    String?
clientEmail   String?
createdAt     DateTime
updatedAt     DateTime
```

### Milestone

```
id            UUID
projectId     UUID (FK → Project)
title         String
description   String?
status        Enum (pending, in_progress, completed)
position      Int (for ordering)
createdAt     DateTime
updatedAt     DateTime
```

### ActivityLog

```
id            UUID
projectId     UUID (FK → Project)
type          String (milestone_completed, status_changed, etc.)
description   String
createdAt     DateTime
```

---

## API Routes

### Protected (requires auth)

| Method | Route | Action |
|--------|-------|--------|
| GET | `/api/projects` | List user projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/[id]` | Get project details |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/projects/[id]/milestones` | Add milestone |
| PUT | `/api/milestones/[id]` | Update milestone |
| DELETE | `/api/milestones/[id]` | Delete milestone |
| PATCH | `/api/milestones/[id]/reorder` | Reorder milestones |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |

### Public

| Method | Route | Action |
|--------|-------|--------|
| GET | `/p/[slug]` | Get public project page |

---

## Validation Rules

### Project

- `name`: Required, 1-100 characters
- `description`: Optional, max 500 characters
- `clientName`: Optional, max 100 characters
- `clientEmail`: Optional, valid email format

### Milestone

- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `status`: Required, enum value

---

## UI Requirements

### Layout

- Sidebar navigation (collapsible)
- Fixed header (48px height)
- Responsive: mobile-first approach
- Content max-width: `max-w-screen-2xl`

### Components

- Use shadcn/ui components exclusively
- Consistent spacing with `--spacing` tokens
- Focus states: `ring-3 ring-ring/50`
- Animations: `transition-colors duration-100`

### Responsive Breakpoints

- Mobile: `< 768px` (single column)
- Desktop: `>= 768px` (multi-column)
- Large: `>= 1024px` (full layout)

---

## Performance

- Initial load: < 3s on 3G
- LCP: < 2.5s
- CLS: < 0.1
- Server components by default
- Client components only when needed (interactivity)

---

## Security

- CSRF protection via Better Auth
- Input sanitization on all forms
- Rate limiting on API routes
- Secure session management
- No sensitive data in client pages
- SQL injection prevention via Prisma

---

## File Structure

```
src/
├── app/
│   ├── (main)/
│   │   └── dashboard/
│   │       ├── _components/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── p/[slug]/
│   │   └── page.tsx
│   └── api/
├── components/
│   ├── ui/
│   └── shared/
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── hooks/
└── styles/
    └── presets/
```

---

## Dependencies

### Core

- `next` — Framework
- `react` / `react-dom` — UI library
- `typescript` — Language

### UI

- `tailwindcss` — Styling
- `class-variance-authority` — Variants
- `clsx` + `tailwind-merge` — Class utilities
- `lucide-react` — Icons
- `motion` — Animations
- `sonner` — Toasts

### Data

- `prisma` — ORM
- `@tanstack/react-query` — Data fetching
- `zod` — Validation
- `react-hook-form` + `@hookform/resolvers` — Forms

### State & Interaction

- `zustand` — Client state
- `@dnd-kit/*` — Drag and drop

### Auth

- `better-auth` — Authentication
