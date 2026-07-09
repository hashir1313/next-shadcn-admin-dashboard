# Traqqy

**Progress tracking for freelancers** - Share real-time project progress with clients through public milestone pages.

<img src="https://github.com/hashir1313/traqqy/blob/main/media/dashboard.png?version=5" alt="Traqqy Dashboard">

Traqqy helps freelancers keep clients updated on project progress without sending repetitive messages. Create projects, break them into milestones, and share a unique public page with your clients that shows real-time progress.

> **Live demo:** [traqqy-eta.vercel.app](https://traqqy-eta.vercel.app)

## Features

- **Authentication** - Email/password login, registration, password reset
- **Project Management** - Create, edit, delete projects with client info
- **Milestone Tracking** - Drag-and-drop reordering, status toggles (Pending/In Progress/Completed)
- **Public Client Pages** - Unique shareable URL per project with progress bar, milestone list, and activity timeline
- **Dashboard** - Overview stats, project list with inline status editing
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Theme Support** - Light/dark mode with customizable presets

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Authentication | Better Auth |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Validation | Zod |
| Forms | React Hook Form |
| Drag & Drop | DND Kit |
| Package Manager | Bun |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- PostgreSQL database (e.g., Neon, Vercel Postgres)

### Clone & Install

```bash
git clone https://github.com/hashir1313/traqqy.git
cd traqqy
bun install
```

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (optional)
RESEND_API_KEY="..."
```

### Setup Database

```bash
bunx prisma db push
```

### Run Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |
| `bun run check` | Check with Biome |
| `bun run check:fix` | Auto-fix with Biome |

## Project Structure

```
src/
├── app/
│   ├── (main)/dashboard/    # Dashboard pages
│   ├── (main)/auth/         # Auth pages (login, register, etc.)
│   ├── api/                 # API routes
│   └── p/[slug]/            # Public client pages
├── components/ui/           # shadcn/ui components
├── lib/                     # Utilities, auth, prisma
├── hooks/                   # Custom hooks
└── styles/presets/          # Theme presets
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | List user projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/projects/[id]/milestones` | Add milestone |
| PUT | `/api/milestones/[id]` | Update milestone |
| DELETE | `/api/milestones/[id]` | Delete milestone |
| PATCH | `/api/milestones/[id]/reorder` | Reorder milestones |
| GET | `/p/[slug]` | Public project page |

## Contributing

Contribations are welcome! Feel free to open issues or submit pull requests.

## License

MIT
