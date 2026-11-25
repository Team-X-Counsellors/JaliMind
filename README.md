# JaliMind Frontend

Next.js 16 (App Router) frontend for JaliMind: free, private support for African university students. See the [root README](../README.md) for the product and [../backend/README.md](../backend/README.md) for the API.

**Live:** https://jalimind.netlify.app

## Stack

| | |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 3 with design tokens (CSS variables) |
| UI | Radix primitives (Dialog), lucide-react icons, `react-markdown` + `remark-gfm` for bot replies |
| Data | Axios with JWT interceptors and auto-refresh |
| Auth | React Context, Google sign-in, middleware route protection |
| Real-time | Browser WebSockets (anonymous chat, call signalling) and WebRTC |
| Fonts | Lexend (display) and Figtree (body) |

## Run

```bash
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
npm run dev            # http://localhost:3000
npm run build && npm run start
npx tsc --noEmit && npx eslint src
```

The backend must be running (see its README). Google sign-in also needs the Google client ID configured and your origin authorised.

## Routes

| Area | Routes |
|---|---|
| Marketing | `/`, `/about`, `/services`, `/counsellors`, `/blog`, `/case-studies`, `/community`, `/resources`, `/contact`, `/privacy`, `/terms`, `/accessibility` |
| Auth | `/auth/login`, `/auth/register` |
| Talk (anonymous) | `/talk`: pick a topic, chat with whoever is free, wipe the chat any time |
| Student app `/dashboard/…` | home, `counselors` (choose and book), `appointments`, `jalibot`, `assessments` (check-ins), `library`, `circle`, `referrals` (campus help), `memories`, `more` |
| Counsellor workspace `/counselor/…` | home, `chats` (queue and live chat), `sessions`, `schedule`, `students`, `profile` |
| Calls | `/call/[id]`: pre-join (auto camera/mic permission prompt), video, chat drawer |

## JaliBot page

`src/app/dashboard/jalibot/`: a chat-app layout.

- Greeting with the breathing orb and four starter prompts; bot replies are unbubbled Markdown, yours are lilac pills.
- **Collapsible history:** a searchable panel grouped by date, with delete. On desktop it folds away completely (state remembered in `localStorage`); below 1024px it is a slide-in drawer. The app navigation shrinks to a slim rail on this page and expands over the chat when asked.
- Copy and Listen (text-to-speech) per reply, optional voice input, and the helpline card pinned above the chat when a crisis is detected.

## Design system

Warm brown and cream, calm by default.

| Token | Use |
|---|---|
| night (deep brown) `#3B2118` | navigation, hero, text on light |
| terracotta (named `indigo` in code) `#8B4A3C` | primary actions |
| marigold `#FFB224` | the single call-to-action colour (never decoration) |
| sage (named `lagoon`) `#4A6741` | positive and calm accents |
| hibiscus `#E5405E` | alerts and crisis only |
| sand (`lilac`) `#EDE8DF`, cream (`mist`) `#F9F5F0` | surfaces |

Helpers: `.tap` (44px touch targets), `.pb-safe` (safe-area padding), `.h-dvh-screen`, `.shadow-soft` / `.shadow-pop`, `.bg-orb` and the `Orb` component. Mobile-first, with a tab bar on phones and a collapsible sidebar on desktop.

## Structure

```
src/
├── app/               routes (see above), globals.css, layout.tsx
├── components/
│   ├── student/       Orb, Markdown, CrisisCard, BookSheet, useShadowChat, ui
│   ├── counselor/     CounselorShell, ApptRow, Sheet, CrisisCard
│   ├── call/          PreJoin, CallScreen, VideoTile, ChatDrawer
│   ├── marketing/     page shells, CrisisLines, WhatsAppLink
│   ├── ui/            small shadcn-style primitives
│   └── DevServiceWorkerReset.tsx   dev only: removes service workers left by other localhost apps
├── contexts/AuthContext.tsx
├── lib/               api.ts (Axios + JWT), shadow.ts, utils.ts
└── middleware.ts      protects /dashboard and /counselor
```

## Notes

- Replies from the bot are rendered as Markdown without raw HTML, and links are limited to safe protocols.
- Next 16 warns that `middleware` is deprecated in favour of `proxy`; renaming is planned.
- Deployed on Netlify; set `NEXT_PUBLIC_API_URL` to the production API.
