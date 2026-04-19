# ICEN — International Council for Emerging Nations

## Problem Statement
A world-class institutional website for ICEN. Premium marketing + membership application + admin dashboard + email notifications + editorial content.

## Architecture
- **Frontend**: React + Tailwind + framer-motion + react-simple-maps (d3-geo) + react-helmet-async + flagcdn.com
- **Backend**: FastAPI + Motor (MongoDB) + JWT + Resend + multipart upload (MongoDB base64 media)
- **Collections**: `users`, `applications`, `blog`, `research`, `media`

## Sprints

### Sprints 1–5 — MVP · Light Theme · Content · Atlas · Clickable cards + filters + phone
- 8-page public site + JWT admin + Resend email
- Refined UN-style emblem + full-name wordmark
- Blog (Insights) + Research Library with admin CRUD + seeded content
- Per-pillar deep-dive pages
- Impact mosaic with premium photography
- SEO / sitemap / robots
- Flat editorial WorldMap (replacing 3D globe)
- Flags marquee (50 nations)
- Tag/pillar filters + pagination on Blog & Research
- Clickable home cards
- Phone field on applications

### Sprint 6 — Media · Interactive Map · Secret Admin · Mobile Polish (current)
- **Image upload** (`POST /api/admin/upload` multipart → MongoDB base64, served via `GET /api/media/{id}` with immutable cache headers). Admin editor now has a native "Upload" button with thumbnail preview.
- **Interactive WorldMap**: member-nation countries are highlighted (light blue fill + blue border), hover turns solid blue, click navigates to `/nation/:slug`. 48 member-nation profiles defined in `content/nations.js`.
- **`/nation/:slug` page**: flag image (flagcdn), capital, region, fellows, chapters, focus pillars, stat tiles, CTA back to chapters + Apply.
- **Admin link removed** from Navbar (desktop + mobile) and Footer. `/admin/login` only accessible via direct URL — the secret entry.
- **Mobile polish**: global CSS tightens overline + buttons at <640px. Verified iPhone viewport renders beautifully (nation profile, hero, map, flags, blog, admin).
- Testing agent validated all flows. Zero bugs.

## Current Functionality
- Public: Home, About, Pillars, Pillars/:slug, Membership, Chapters, Governance, Programs, Apply, Blog, Blog/:slug, Research, Research/:slug, Nation/:slug
- Admin (via direct URL): `/admin/login` → `/admin/dashboard` with tabs Applications / Insights / Research, drawer-based CRUD with image upload
- Email: applicant confirmation + admin notify via Resend

## Prioritized Backlog

### P1
- Verify Resend custom domain for reliable applicant email delivery
- Search across Blog + Research

### P2
- RSS feed for Insights
- Applicant self-service status lookup
- Multilingual (FR, ES, AR)
- Events calendar with RSVP
- Per-nation page richer content (quotes from ministers, active initiatives)

### P3
- Founding Nation Spotlight carousel on Home
- Newsletter capture + list management
- Partner logo wall
- Full-text search across content

## Next Tasks
- Connect Resend custom domain for production email
- Enrich nation profile pages with editorial content
- Add search across editorial content
