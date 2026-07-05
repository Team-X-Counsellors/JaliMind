# JaliMind Frontend

Next.js 16 frontend for the JaliMind guidance and counselling platform — a privacy-first, AI-powered mental health support system for African university students.

**Live Site:** [https://jalimind.netlify.app](https://jalimind.netlify.app)
**Backend API:** See [../backend/README.md](../backend/README.md)
**Status:** Active Development — MVP

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Prerequisites](#4-prerequisites)
5. [Installation](#5-installation)
6. [Environment Variables](#6-environment-variables)
7. [Running the App](#7-running-the-app)
8. [Pages and Features](#8-pages-and-features)
9. [User Flows](#9-user-flows)
10. [Design System](#10-design-system)
11. [Component Library](#11-component-library)
12. [API Integration](#12-api-integration)
13. [Authentication Architecture](#13-authentication-architecture)
14. [Shadow Chat — Anonymous Flow](#14-shadow-chat--anonymous-flow)
15. [Replacing Image Placeholders](#15-replacing-image-placeholders)
16. [Deployment](#16-deployment)
17. [Team](#17-team)

---

## 1. Overview

The JaliMind frontend has two distinct layers:

### Marketing Site (public)
Public-facing pages (home, about, services, blog, case studies, contact) built with inline CSS, CSS variables, and scroll-reveal animations. No Tailwind, no component library — maximum portability.

### Application Dashboard (authenticated)
Functional student dashboard built with **shadcn/ui** + **Tailwind CSS v3**, fully integrated with the Django REST API. Covers AI chat, anonymous sessions, appointments, library, forum, and counsellor booking.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 + shadcn/ui (dashboard) · Inline CSS (marketing) |
| UI Primitives | Radix UI |
| HTTP Client | Axios (JWT interceptors + auto-refresh) |
| Icons | lucide-react |
| Fonts | Plus Jakarta Sans (body) · Bricolage Grotesque (headings) |
| Auth State | React Context API |
| Route Protection | Next.js Middleware |

---

## 3. Project Structure

```
jalimind/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout — fonts, AuthProvider
│   │   ├── globals.css              # Tailwind directives + CSS variables
│   │   ├── page.tsx                 # Marketing home page
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx       # Sign-in form
│   │   │   └── register/page.tsx    # Registration with consent checkbox
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           # Sidebar nav + auth guard
│   │   │   ├── page.tsx             # Dashboard home (quick-link cards)
│   │   │   ├── jalibot/page.tsx     # JaliBot AI chat interface
│   │   │   ├── shadow/page.tsx      # Anonymous Shadow Chat
│   │   │   ├── appointments/page.tsx
│   │   │   ├── library/page.tsx     # Searchable resource grid
│   │   │   ├── circle/page.tsx      # Peer forum + thread creation
│   │   │   └── counselors/page.tsx  # Counsellor directory + booking modal
│   │   │
│   │   └── [about, services, blog, ...]/   # Marketing pages (13 routes)
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components (dashboard only)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── label.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── Navbar.tsx               # Marketing sticky nav
│   │   ├── Footer.tsx               # Marketing footer
│   │   └── BookingModal.tsx         # Coming-soon modal
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state, login, logout, cookie sync
│   │
│   ├── lib/
│   │   ├── api.ts                   # Axios instance + JWT interceptors
│   │   └── utils.ts                 # cn() Tailwind merge utility
│   │
│   └── middleware.ts                # Route protection for /dashboard
│
├── tailwind.config.ts               # Terracotta palette + shadcn token mapping
├── postcss.config.mjs
├── components.json                  # shadcn/ui configuration
├── next.config.ts
└── .env.local                       # API base URL (never commit this)
```

---

## 4. Prerequisites

- **Node.js** 18+
- **npm** 9+ (or yarn / pnpm)
- **JaliMind backend** running on `http://localhost:8000` — see [backend setup](../backend/README.md)

Check your versions:

```bash
node --version
npm --version
```

---

## 5. Installation

### 1. Navigate to the frontend directory

```bash
cd jalimind
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

```bash
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

That's all that's required for local development.

---

## 6. Environment Variables

Create a `.env.local` file in the `jalimind/` directory:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, point this to your deployed backend URL.

Never commit `.env.local` — it is already in `.gitignore`.

---

## 7. Running the App

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The backend must also be running. In a separate terminal:
> ```bash
> cd backend
> .\venv\Scripts\activate        # Windows
> source venv/bin/activate       # macOS / Linux
> python manage.py runserver --settings=core.settings.development
> ```

### Available scripts

```bash
npm run dev      # Development server with hot reload
npm run build    # Production build (outputs to .next/)
npm run start    # Serve production build locally
npm run lint     # Run ESLint
```

---

## 8. Pages and Features

### Marketing Site (public — no login required)

| Route | What Is On It |
|---|---|
| `/` | Hero, stats bar, services grid, testimonials, counsellor cards, FAQ, CTA |
| `/about` | Mission, vision, team bios |
| `/services` | All 6 platform features in detail |
| `/counsellors` | Counsellor directory (marketing view) |
| `/community` | Community forum overview |
| `/resources` | Resource hub overview |
| `/case-studies` | 3 impact case studies |
| `/blog` | Mental health articles |
| `/contact` | Enquiry form (student / institution / media) |
| `/privacy` | Full privacy policy |
| `/terms` | Terms of service |
| `/accessibility` | Accessibility statement |

### Auth Pages

| Route | Description |
|---|---|
| `/auth/login` | Username + password. Returns JWT on success. |
| `/auth/register` | Full registration form with privacy consent checkbox. |

### Dashboard (requires login)

| Route | Description |
|---|---|
| `/dashboard` | Home — quick-link cards to all features |
| `/dashboard/jalibot` | JaliBot AI chat — real-time Gemini-powered conversation |
| `/dashboard/shadow` | Shadow Chat — fully anonymous support sessions |
| `/dashboard/appointments` | Upcoming and past counselling appointments |
| `/dashboard/library` | Searchable mental health resource library |
| `/dashboard/circle` | Peer support forum — browse and post threads |
| `/dashboard/counselors` | Counsellor profiles + session booking modal |

---

## 9. User Flows

### New User — Registration

```
/ (Landing page)
  → Navbar "Get Started" or hero "Get Started — It's Free"
  → /auth/register
  → Fill form: first name, last name, username, email,
               university, password, confirm password,
               consent checkbox (required)
  → Submit → POST /api/auth/register/
  → Backend returns { access, refresh, user }
  → Tokens saved to localStorage, session cookie set
  → Redirect → /dashboard
```

### Returning User — Login

```
Navbar "Sign In" or /auth/login
  → Enter username + password
  → POST /api/auth/login/
  → Tokens saved, session cookie set
  → Redirect → /dashboard
```

### JaliBot AI Chat

```
/dashboard/jalibot
  → Type message → press Enter or click "Send"
  → POST /api/jalibot/chat/ { message, language }
  → AI reply rendered as chat bubble
  → If crisis_detected: true →
      Red alert box shown with African crisis hotlines:
      Kenya (Befrienders), Nigeria (SURPIN),
      Ghana (MHA), South Africa (SADAG)
  → Full conversation history persisted per user on the server
```

### Shadow Chat (Anonymous)

```
/dashboard/shadow
  → "Start anonymous session" button (no JWT needed for this step)
  → POST /api/shadow/start/ (no auth header)
  → Response: { session_id, pseudonym, token, expires_at }
  → Pseudonym shown as identity badge (e.g. "BoldHarambee_7392")
  → Token saved in sessionStorage only (lost when tab closes)
  → Each message: POST /api/shadow/session/{id}/message/
                  Header: X-Shadow-Token: <token>
  → "End session" button clears sessionStorage → session terminated
  → Nothing is ever linked back to the user's account
```

### Finding and Booking a Counsellor

```
/dashboard/counselors
  → Browse counsellor cards
    (name, specialties, rating, session count, availability badge)
  → "Book session" → booking modal
  → Select: date/time, session type (video / text / voice / anonymous)
            optional notes
  → POST /api/counselors/{id}/book/
  → Appointment created → visible at /dashboard/appointments
```

---

## 10. Design System

### Colour Palette

The dashboard uses a terracotta/brownish palette mapped to shadcn/ui CSS variables.

| CSS Variable | HSL | Hex | Usage |
|---|---|---|---|
| `--primary` | `9 42% 39%` | `#8B4A3C` | Buttons, active nav, links |
| `--background` | `40 30% 98%` | `#FDFAF6` | Page background |
| `--card` | `36 35% 97%` | `#F9F5F0` | Card backgrounds |
| `--accent` | `120 18% 34%` | `#4A6741` | Sage accent elements |
| `--muted` | `36 18% 90%` | `#EDE8DF` | Muted backgrounds |
| `--border` | `36 18% 85%` | `#DDD8D0` | Borders, dividers |
| `--secondary` | `36 20% 88%` | `#E8DFD4` | Secondary buttons |

The marketing site uses the same colours as raw CSS variables (`var(--terracotta)`, `var(--cream)`, etc.) defined in `globals.css`.

### Fonts

| Font | CSS Variable | Usage |
|---|---|---|
| Plus Jakarta Sans | `--font-jakarta` | Body text, UI labels, navigation |
| Bricolage Grotesque | `--font-bricolage` | Headings (h1–h6), display text |

Loaded via `next/font/google` in `layout.tsx` — zero layout shift, automatic subsetting.

### Scroll Reveal (Marketing Pages)

Marketing pages use an `IntersectionObserver`-based `Reveal` component for scroll animations:

```tsx
<Reveal delay={150}>
  <YourContent />
</Reveal>
```

Pass `delay` in milliseconds to stagger grid items.

---

## 11. Component Library

All shadcn/ui components live in `src/components/ui/`. They are used exclusively in the dashboard.

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
```

### Button variants

```tsx
<Button>Default (terracotta)</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>
```

---

## 12. API Integration

All API calls go through the Axios instance at `src/lib/api.ts`.

```typescript
import api from '@/lib/api'

// GET with automatic JWT header
const { data } = await api.get('/api/auth/me/')

// POST
const { data } = await api.post('/api/jalibot/chat/', {
  message: 'I am feeling overwhelmed',
  language: 'en',
})
```

### JWT Interceptor Behaviour

1. **Request** — reads `access_token` from `localStorage` and adds `Authorization: Bearer <token>` automatically
2. **Response 401** — silently calls `POST /api/auth/refresh/` with the stored `refresh_token`
3. **Refresh success** — stores new `access_token`, retries the original request
4. **Refresh failure** — clears all tokens, deletes the session cookie, redirects to `/auth/login`

### Shadow Chat — Raw Axios

Shadow Chat uses raw Axios (bypassing the JWT interceptor) because it is unauthenticated:

```typescript
import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Start session (no auth)
const { data } = await axios.post(`${BASE}/api/shadow/start/`)

// Send message (X-Shadow-Token header)
await axios.post(
  `${BASE}/api/shadow/session/${sessionId}/message/`,
  { content: text },
  { headers: { 'X-Shadow-Token': token } }
)
```

---

## 13. Authentication Architecture

### Token Storage

| Item | Location | Lifetime |
|---|---|---|
| `access_token` | `localStorage` | 1 hour (auto-refreshed) |
| `refresh_token` | `localStorage` | 7 days |
| `jalimind_session` | Cookie (SameSite=Lax) | Browser session |

The cookie is a simple flag (`=1`) that lets Next.js middleware gate `/dashboard` server-side without exposing the JWT. All actual authentication uses tokens in `localStorage`.

### AuthContext

`src/contexts/AuthContext.tsx` wraps the entire app:

```typescript
const { user, loading, login, logout, isAuthenticated } = useAuth()
```

| Property | Type | Description |
|---|---|---|
| `user` | `User \| null` | Profile: id, username, email, role, university |
| `loading` | `boolean` | True during initial token validation |
| `isAuthenticated` | `boolean` | True when user is loaded |
| `login(username, password)` | `async` | Posts to `/api/auth/login/`, stores tokens |
| `logout()` | `void` | Blacklists refresh token, clears everything |

### Middleware

`src/middleware.ts` runs on every request to `/dashboard/*`, `/counselor/*`, `/admin/*`:

- No `jalimind_session` cookie → redirect to `/auth/login`
- Has cookie on `/auth/*` → redirect to `/dashboard`

The dashboard layout also has a client-side guard using `useAuth()` as a second layer of protection.

---

## 14. Shadow Chat — Anonymous Flow

Shadow Chat is the platform's fully anonymous support channel. Key design decisions in the frontend:

- **Session token lives in `sessionStorage` only** — survives page refreshes within the tab, but is permanently deleted when the tab closes. Never written to `localStorage` or cookies.
- **Pseudonym identity** — the user sees an African pseudonym (e.g. `CalmBaobab_4851`) as their displayed identity in the session
- **No account link** — the start endpoint requires no JWT. The session has no FK to any user table on the backend.
- **Crisis detection still active** — if crisis keywords are detected, the session is flagged for counsellor review server-side without identifying the user
- **Graceful expiry** — sessions expire after 24 hours. Expired sessions show an expired state rather than an error.

---

## 15. Replacing Image Placeholders

All images in the marketing site are placeholder `div` elements with gradient backgrounds. To swap them for real photos:

### 1. Add images to `/public/images/`

Recommended sizes:
- Hero: 1600 × 900px minimum
- Section images: 800 × 600px
- Counsellor portraits: 400 × 400px (square crop)

### 2. Replace placeholder divs with Next.js Image

Placeholders look like:
```tsx
<div style={{ background: 'linear-gradient(135deg, var(--sand), #D4C5B0)', ...}}>
  <Users size={56} />
</div>
```

Replace with:
```tsx
import Image from 'next/image'

<div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden' }}>
  <Image
    src="/images/about-team.jpg"
    alt="The JaliMind team"
    fill
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

Always add `priority` to above-the-fold images (hero section).

---

## 16. Deployment

### Netlify (Marketing Site)

The project auto-deploys from `main` on every push to GitHub.

**Build settings in Netlify:**

| Setting | Value |
|---|---|
| Base directory | `jalimind` |
| Build command | `npm run build` |
| Publish directory | `jalimind/.next` |
| Node version | 18 |

Add environment variables in Netlify → Site settings → Environment variables.

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — auto-deploys to Netlify |
| `dev` | Active development — open all PRs here |
| `feature/[name]` | Feature branches |
| `fix/[name]` | Bug fix branches |

### Commit Convention

```bash
feat:      New feature
fix:       Bug fix
style:     UI/styling changes, no logic change
refactor:  Code restructure
docs:      Documentation only
chore:     Build config, dependencies
```

---

## 17. Team

| Name | Role |
|---|---|
| Kosisochukwu Moronu | Product & Project Management |
| Joy Mwendi | Documentation & Research |
| Florida Korir | Marketing, Communications & Regulatory |
| Winnie | UI/UX Design & Frontend Development |
| Paul | Full-Stack Development |

**General:** hello@jalimind.org
**Partnerships:** partners@jalimind.org
**Privacy:** privacy@jalimind.org

---

<div align="center">
  <strong>JaliMind</strong><br/>
  Empowering university students across Africa.<br/>
  Built with care by a pan-African team.
</div>
