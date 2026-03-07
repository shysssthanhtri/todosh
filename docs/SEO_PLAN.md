# SEO review and improvement plan

**Last updated:** After moving `/` to landing and app home to `/today`.

---

## Current route structure

| Route | Access | Purpose |
|-------|--------|---------|
| **`/`** (LANDING) | Public | Landing page — app name, tagline, Sign up / Log in. **Primary indexable page.** |
| **`/login`** | Public | Log in. |
| **`/signup`** | Public | Sign up. |
| **`/today`** (HOME) | Auth required | App home — My Todos list, sync, add. Post-login redirect target. |
| **`/upcoming`** | Auth required | Upcoming tasks. |
| **`/browse`** | Auth required | Browse tasks. |

**Constants:** [constants/routes.ts](constants/routes.ts) — `ROUTES.LANDING`, `ROUTES.HOME` (= `/today`), `publicRoutes = [LANDING, ...authRoutes]`.

---

## Current SEO state

**In place**

- Root metadata in [app/layout.tsx](app/layout.tsx): title, description, metadataBase, openGraph, twitter, manifest, icons, viewport.
- Landing page metadata in [app/page.tsx](app/page.tsx): title "Todosh", description for search.
- Public `/` so crawlers can index the landing page when searching "Todosh".
- Manifest, OG image, `html lang="en"`.

**Still missing**

- **Sitemap** — no `app/sitemap.ts`.
- **Robots.txt** — no `app/robots.ts`.
- **Per-page metadata** — only root + landing; login/signup/today/upcoming/browse have no page-specific title/description.
- **Title template** — e.g. `"%s | Todosh"` in root layout.
- **Twitter image** — not set explicitly (optional).
- **Canonical URLs** — not set (optional).
- **Structured data** — no JSON-LD (optional).
- **Theme color** — manifest vs viewport alignment (optional).

---

## Recommended improvements (with new routes)

### 1. Add `app/robots.ts`

- Allow all user agents on public routes.
- Disallow `/api/` (or other non-public paths) if desired.
- Set `sitemap` to `metadataBase + "/sitemap.xml"`.

### 2. Add `app/sitemap.ts`

- **Include (public, indexable):**
  - `/` (landing) — priority 1, changeFrequency e.g. weekly.
  - `/login` — lower priority.
  - `/signup` — lower priority.
- **Exclude:** `/today`, `/upcoming`, `/browse` (auth required; no unique indexable content for crawlers).
- Use `metadataBase` (or `NEXT_PUBLIC_SITE_URL`) for absolute URLs.

### 3. Root layout metadata tweaks

- Add **title template**: `title: { default: "Todosh", template: "%s | Todosh" }`.
- Optionally add **keywords** and set **twitter.images** explicitly.

### 4. Per-page metadata

- **`/`** — Already has metadata in [app/page.tsx](app/page.tsx).
- **`/login`** — Add metadata: title "Log in", short description.
- **`/signup`** — Add metadata: title "Sign up", short description.
- **`/today`**, **`/upcoming`**, **`/browse`** — Optional: title (and description) for in-app UX (tab title, bookmarks); low SEO impact (auth-only).

### 5. Optional

- Canonical URLs for `/`, `/login`, `/signup`.
- JSON-LD WebApplication in root layout.
- Align manifest `theme_color` with viewport.

---

## Files to add or change

| Action | File |
|--------|------|
| Add | `app/robots.ts` |
| Add | `app/sitemap.ts` — list `/`, `/login`, `/signup` only |
| Edit | `app/layout.tsx` — title template, optional twitter.images, keywords |
| Edit | `app/(public)/(auth)/login/page.tsx` — export metadata |
| Edit | `app/(public)/(auth)/signup/page.tsx` — export metadata |
| Edit (optional) | `app/(authed)/today/page.tsx`, `upcoming/page.tsx`, `browse/page.tsx` — metadata for UX |
| Edit (optional) | `public/manifest.json` — theme_color |
| Add (optional) | JSON-LD in `app/layout.tsx` |

No new dependencies; use Next.js `Metadata`, `MetadataRoute.Sitemap`, and `MetadataRoute.Robots`.
