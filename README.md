# JaliMind

> AI-Powered Guidance and Counselling Platform for University Students Across Africa

**Live Site:** [https://jalimind.netlify.app](https://jalimind.netlify.app)  
**Repository:** [https://github.com/Team-X-Counsellors/JaliMind](https://github.com/Team-X-Counsellors/JaliMind)  
**Status:** Active Development — MVP

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Why We Built This](#2-why-we-built-this)
3. [Core Features](#3-core-features)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Design System](#6-design-system)
7. [Getting Started — Local Development](#7-getting-started--local-development)
8. [Cloning from GitHub](#8-cloning-from-github)
9. [Deployment](#9-deployment)
10. [Pages Reference](#10-pages-reference)
11. [Component Reference](#11-component-reference)
12. [Replacing Image Placeholders](#12-replacing-image-placeholders)
13. [Roadmap](#13-roadmap)
14. [Team](#14-team)
15. [Contributing](#15-contributing)
16. [License](#16-license)

---

## 1. Project Overview

JaliMind is a web-based guidance and counselling platform built specifically for university students in higher education institutions across Africa. It bridges the gap between students who need mental health support and the counsellors and campus resources that can provide it.

The platform combines **AI-powered chat support**, **anonymous counselling sessions**, **peer community forums**, **a resource library**, and **direct access to certified counsellors** — all within a single, accessible, mobile-friendly interface.

**JaliMind does not replace campus counsellors.** It empowers them by extending their reach and giving students a lower-barrier entry point into mental health support.

---

## 2. Why We Built This

The World Health Organization (2021) reports that approximately **75% of people with mental health conditions in Africa receive no treatment at all.** University students are among the most vulnerable populations — navigating academic pressure, financial stress, identity challenges, and social transitions, often far from home.

Our team — built from students and professionals across Nigeria, Kenya, and Ghana — experienced this gap firsthand. We started by collecting feedback from students via surveys and found one consistent theme: students want help, but fear being seen, judged, or identified.

JaliMind was built to solve that. Every feature on this platform started as a response to something a real student told us they needed.

**Key insight that shaped the product:** The anonymous session feature exists because our survey data showed that fear of stigma — not lack of awareness — is the primary barrier to help-seeking on African campuses.

---

## 3. Core Features

### Counselling and Support
- **Online Counselling Sessions** — one-on-one video, voice, or text sessions with verified counsellors
- **Anonymous Sessions** — full counselling access with zero identifying information required
- **AI Chat Support** — 24/7 AI companion with multilingual support (English, Swahili; Igbo, Hausa, Twi, French in development)
- **WhatsApp Integration** — access support through familiar platforms, no new app required
- **24/7 Crisis Line** — immediate connection to trained professionals

### Resources and Tools
- **Resource Library** — curated articles, downloadable workbooks, and guided videos organised by topic
- **Self-Assessment Tools** — validated screening tools with progress tracking
- **Referral System** — connects students to campus resources (academic advisors, career services)

### Community
- **Moderated Forum** — peer-to-peer support threads with category filters and anonymous posting
- **Multilingual Threads** — community posts in English and Swahili

### Platform
- **Multi-role Architecture** — Admin, Counsellor, and Student/User portals (in development)
- **University Partnership System** — institution-level integration with existing guidance departments

---

## 4. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | ^5 |
| UI | React | 19.2.3 |
| Styling | Inline CSS with CSS Variables | — |
| Icons | lucide-react | ^0.577.0 |
| Animation | framer-motion | ^12.36.0 |
| Fonts | Google Fonts (Playfair Display + Poppins) | — |
| Linting | ESLint + eslint-config-next | 16.1.6 |
| Deployment | Netlify | — |

No Tailwind. No UI component libraries (shadcn, MUI, etc.). No CSS frameworks. The entire UI is built with inline styles and CSS custom properties for maximum portability and zero build-step styling dependencies.

---

## 5. Project Structure

```
jalimind/
├── public/                     # Static assets
│   └── images/                 # Add your images here
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout — metadata, global CSS import
│   │   ├── globals.css         # CSS variables, resets, font imports
│   │   ├── page.tsx            # Home / Landing page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── counsellors/
│   │   │   └── page.tsx
│   │   ├── community/
│   │   │   └── page.tsx
│   │   ├── resources/
│   │   │   └── page.tsx
│   │   ├── case-studies/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── accessibility/
│   │       └── page.tsx
│   └── components/             # Shared components
│       ├── Navbar.tsx          # Sticky navigation with scroll transition
│       ├── Footer.tsx          # 4-column footer with social links
│       └── BookingModal.tsx    # Coming Soon appointment modal
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 6. Design System

All design tokens are CSS custom properties defined in `src/app/globals.css`.

### Colour Palette

```css
--cream:            #F9F5F0   /* Page background variant */
--warm-white:       #FDFAF6   /* Primary page background */
--sand:             #EDE8DF   /* Section backgrounds, tags */
--terracotta:       #8B4A3C   /* Primary brand colour, CTAs */
--terracotta-light: #A85B4A   /* Hover states */
--terracotta-dark:  #6B3228   /* Dark hover, footer accents */
--sage:             #4A6741   /* Secondary accent */
--sage-light:       #6B8F68   /* Secondary accent light */
--charcoal:         #2C2C2C   /* Primary body text */
--charcoal-soft:    #3D3D3D   /* Secondary body text */
--muted:            #6B6560   /* Tertiary text, labels */
--border:           #DDD8D0   /* All borders and dividers */
```

### Typography

```css
--font-display: 'Playfair Display', Georgia, serif   /* All headings h1–h4 */
--font-body:    'Poppins', sans-serif                /* All body text */
```

Fonts load via Google Fonts in `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
```

### Scroll Reveal Pattern

Every page uses a `Reveal` wrapper component built on `IntersectionObserver` that animates elements as they enter the viewport:

```tsx
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}
```

Pass a `delay` prop (in milliseconds) to stagger animations in a grid.

---

## 7. Getting Started — Local Development

### Prerequisites

Ensure you have the following installed:

```
Node.js   >= 18.0.0
npm       >= 9.0.0
Git       >= 2.0.0
```

Check your versions:

```bash
node --version
npm --version
git --version
```

### Installation and Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start local dev server with hot reload
npm run build    # Build for production — outputs to .next/
npm run start    # Run the production build locally
npm run lint     # Run ESLint across the codebase
```

### Environment Variables

The current frontend has no required environment variables. When you connect backend services, create a `.env.local` file at the project root:

```env
# API
NEXT_PUBLIC_API_URL=https://api.jalimind.org

# Contact form (e.g. Resend)
RESEND_API_KEY=your_key_here

# AI Chat
OPENAI_API_KEY=your_key_here

# Community Forum Database (e.g. Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+254700000000
```

Never commit `.env.local` to Git. It is already excluded by the default `.gitignore`.

---

## 8. Cloning from GitHub

### Clone the Repository

```bash
# HTTPS
git clone https://github.com/Team-X-Counsellors/JaliMind.git

# SSH (if you have SSH keys configured)
git clone git@github.com:Team-X-Counsellors/JaliMind.git

cd JaliMind
npm install
npm run dev
```

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Auto-deploys to Netlify on every push. |
| `dev` | Active development. Open all PRs against this branch. |
| `feature/[name]` | Individual feature branches — e.g. `feature/ai-chat` |
| `fix/[name]` | Bug fix branches — e.g. `fix/navbar-mobile` |

### Creating a Feature Branch

```bash
# Always branch from dev, not main
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# Do your work, then push
git add .
git commit -m "feat: describe what you built"
git push origin feature/your-feature-name

# Open a Pull Request on GitHub: feature/your-feature-name → dev
```

### Commit Message Convention

```
feat:     New feature
fix:      Bug fix
style:    UI or styling changes with no logic change
refactor: Code restructure — no new feature or bug fix
docs:     Documentation only changes
chore:    Build config, dependencies, tooling
```

Examples:

```bash
git commit -m "feat: add multilingual toggle for Swahili"
git commit -m "fix: mobile navbar not closing on link click"
git commit -m "style: update counsellor card hover border colour"
git commit -m "docs: update README deployment section"
```

### Keeping Your Fork in Sync

If you forked the repo and need to pull in upstream changes:

```bash
# Add the upstream remote (only needed once)
git remote add upstream https://github.com/Team-X-Counsellors/JaliMind.git

# Fetch and merge upstream changes
git fetch upstream
git checkout dev
git merge upstream/dev
```

---

## 9. Deployment

### Live Deployment — Netlify

The project deploys automatically from `main` on every push.

**How the auto-deploy pipeline works:**

1. Push a commit to `main` on GitHub
2. Netlify detects the push via a GitHub webhook
3. Netlify runs `npm run build`
4. If the build passes, the new version goes live within 1–2 minutes
5. If the build fails, the previous version stays live — Netlify never publishes a broken build


---

## 10. Pages Reference

| Route | File | What Is On It |
|---|---|---|
| `/` | `src/app/page.tsx` | Hero, stats bar, services grid, why-us panel, testimonials, counsellor cards, CTA banner, case study teasers, FAQ accordion, booking form, blog teasers, partners strip |
| `/about` | `src/app/about/page.tsx` | Mission / vision / values cards, origin story, full team bios |
| `/services` | `src/app/services/page.tsx` | All 6 services in alternating two-column layouts with feature lists |
| `/counsellors` | `src/app/counsellors/page.tsx` | Live search + specialty filter, counsellor cards with ratings, languages, booking |
| `/community` | `src/app/community/page.tsx` | Forum view with sidebar category nav, searchable thread list, pinned posts |
| `/resources` | `src/app/resources/page.tsx` | Article, workbook, and video library with type and category filters |
| `/case-studies` | `src/app/case-studies/page.tsx` | 3 detailed impact studies with outcomes, challenge, approach, and quotes |
| `/blog` | `src/app/blog/page.tsx` | Featured post + filterable article grid |
| `/contact` | `src/app/contact/page.tsx` | Enquiry type switcher (student / institution / media), form with success state |
| `/privacy` | `src/app/privacy/page.tsx` | Full privacy policy — 8 sections |
| `/terms` | `src/app/terms/page.tsx` | Full terms of service — 8 sections |
| `/accessibility` | `src/app/accessibility/page.tsx` | Accessibility statement and commitments |

---

## 11. Component Reference

### `Navbar.tsx`

- Transparent background on page load
- Transitions to white with `backdrop-filter: blur(12px)` when `scrollY > 50`
- Responsive: nav links hidden below 768px and replaced with a hamburger menu
- Slide-down mobile menu with smooth transform animation
- All links: About, Services, Counsellors, Community, Resources, Case Studies
- CTA button: "Get Started" links to `/contact`

### `Footer.tsx`

- 4-column grid: Brand + social icons, Quick Links, Services, Contact info
- Terracotta crisis support callout box with 24/7 phone number
- Bottom bar: copyright year (dynamic), Privacy Policy, Terms, Accessibility links
- All social icon buttons with hover background transition

### `BookingModal.tsx`

A "Coming Soon" modal triggered by every booking CTA across the site.

```tsx
import BookingModal from '@/components/BookingModal';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<BookingModal isOpen={open} onClose={() => setOpen(false)} />
<button onClick={() => setOpen(true)}>Book a Session</button>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Called when user closes the modal |

When your booking system is ready, replace the modal body in `BookingModal.tsx` with a real booking form or redirect.

---

## 12. Replacing Image Placeholders

All images are currently placeholder `div` elements with gradient backgrounds. Here is how to swap them for real photos.

### Step 1 — Add images to `/public/images/`

```
public/
└── images/
    ├── hero-students.jpg
    ├── about-team.jpg
    ├── counselling-session.jpg
    └── counsellors/
        ├── amara-osei.jpg
        ├── fatima-al-hassan.jpg
        ├── david-kamau.jpg
        └── nadia-bouali.jpg
```

Recommended image sizes:
- Hero: 1600 × 900px minimum
- Section images: 800 × 600px minimum
- Counsellor portraits: 400 × 400px, square crop

### Step 2 — Replace placeholder divs

Placeholders look like this in the code:

```tsx
<div style={{
  borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3',
  background: 'linear-gradient(135deg, var(--sand), #D4C5B0)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  <Users size={56} style={{ color: 'rgba(139,74,60,0.25)' }} />
</div>
```

Replace with Next.js `<Image>`:

```tsx
import Image from 'next/image';

<div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
  <Image
    src="/images/about-team.jpg"
    alt="The JaliMind team"
    fill
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

### Step 3 — Hero image

```tsx
// In src/app/page.tsx, replace the right-side hero placeholder with:
<div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden' }}>
  <Image
    src="/images/hero-students.jpg"
    alt="University students on campus"
    fill
    style={{ objectFit: 'cover', objectPosition: 'center' }}
    priority   // Always set priority on above-the-fold images
  />
  {/* Gradient overlay to blend into the dark hero */}
  <div style={{
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to right, #2C1810 0%, transparent 60%)',
  }} />
</div>
```

---

## 13. Roadmap

### Phase 1 — MVP (Complete)
- [x] Landing page with all sections
- [x] All inner pages built and navigable
- [x] Responsive mobile and desktop design
- [x] Booking modal (coming soon state)
- [x] Deployed to Netlify at jalimind.netlify.app

### Phase 2 — Content and Design Polish
- [ ] Replace all image placeholders with real photography
- [ ] Blog post detail pages (`/blog/[slug]`)
- [ ] Individual counsellor profile pages (`/counsellors/[id]`)
- [ ] Individual case study pages (`/case-studies/[slug]`)
- [ ] Favicon, Apple touch icon, Open Graph meta images
- [ ] Swahili language toggle (next-intl)

### Phase 3 — Backend Integration
- [ ] Contact form wired to email (Resend or SendGrid via Next.js API route)
- [ ] Appointment booking system
- [ ] Student account authentication (NextAuth or Supabase Auth)
- [ ] Counsellor dashboard
- [ ] Admin dashboard

### Phase 4 — Core Product Features
- [ ] AI chat interface (OpenAI GPT-4o or fine-tuned model)
- [ ] Community forum backend (Supabase real-time database)
- [ ] Anonymous session infrastructure
- [ ] Self-assessment tool with result tracking
- [ ] WhatsApp Business API integration (Twilio or Meta Cloud API)

### Phase 5 — Scale and Growth
- [ ] University partnership admin portal
- [ ] React Native mobile app
- [ ] Multilingual AI (Igbo, Hausa, Twi, French)
- [ ] Analytics dashboard for counsellors
- [ ] Peer supporter certification system

---

## 14. Team

| Name | Role | Country |
|---|---|---|
| Kosisochukwu Moronu | Product and Project Management | Nigeria |
| Joy Mwendi | Documentation Engineering and Research | Kenya |
| Florida Korir | Marketing, Communications and Regulatory | Kenya |
| Winnie | UI/UX Design and Frontend Development | Ghana |
| Paul | Full-Stack Development and Frontend | Pan-African |

**General:** hello@jalimind.org  
**Partnerships:** partners@jalimind.org  
**Privacy:** privacy@jalimind.org

---

## 15. Contributing

We welcome contributions from developers, designers, mental health professionals, and African university students.

### How to Contribute

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/JaliMind.git
cd JaliMind

# 3. Branch from dev (never from main)
git checkout dev
git pull origin dev
git checkout -b feature/your-contribution

# 4. Make your changes and commit
git add .
git commit -m "feat: describe your change"

# 5. Push to your fork
git push origin feature/your-contribution

# 6. Open a Pull Request: your fork → Team-X-Counsellors/JaliMind → dev branch
```

### Contribution Rules

- All PRs must target `dev`, not `main`
- Write a clear PR description explaining what you changed and why
- UI changes must follow the existing design system — use CSS variables, no new libraries
- Run `npm run build` locally before submitting — the build must pass with zero errors
- Keep PRs focused — one feature or fix per PR, not multiple unrelated changes

### Reporting Bugs

Open an issue on [GitHub Issues](https://github.com/Team-X-Counsellors/JaliMind/issues) with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser name and version, operating system

---

## 16. License

This project is currently **All Rights Reserved** — Team-X-Counsellors / JaliMind, 2025–2026.

Open-source licensing will be reviewed as the project matures. To request permission to use any part of this codebase, contact hello@jalimind.org.

---

<div align="center">
  <strong>JaliMind</strong><br/>
  Empowering university students across Africa.<br/>
  Built with care by a pan-African team.
</div>