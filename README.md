# usamakhaki.com

Personal portfolio of Usama Khaki, Senior Software Engineer in Dubai. One static page: hero, selected projects, experience, skills and contact.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. There is no backend, database or CMS: all content lives in typed files under `src/content`, and the page is prerendered at build time.

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:7101](http://localhost:7101).

## Scripts

| Script                            | What it does                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                     | Dev server on port 7101                                      |
| `npm run build`                   | Production build (every route is static)                     |
| `npm start`                       | Serve the production build on port 7101                      |
| `npm run lint`                    | ESLint with the Next.js core web vitals and TypeScript rules |
| `npm run typecheck`               | `tsc --noEmit`                                               |
| `npm test`                        | Vitest and React Testing Library, run once                   |
| `npm run format` / `format:check` | Prettier with the Tailwind class sorter                      |

CI (`.github/workflows/ci.yml`) runs lint, format check, typecheck, tests and build on every push to `main` and on pull requests.

## Editing content

| File                        | Holds                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `src/content/profile.ts`    | Name, role, summary, availability, links, optional CV and photo paths                 |
| `src/content/projects.ts`   | Open-source projects. `featured` puts one in the showcase, `live` adds the Live badge |
| `src/content/products.ts`   | Live products with private code, linked to the live site. `traffic` is optional       |
| `src/content/experience.ts` | Roles, newest first. Wording matches the CV                                           |
| `src/content/skills.ts`     | Skill groups                                                                          |

Screenshots live in `public/projects/`. Open-source ones come from each project's own `docs/screenshots` folder; the live product ones were captured from the live sites.

- **Photo:** `public/usama-khaki.jpg`, set in `profile.photo`. Set it to `null` to show initials instead.
- **CV:** put the PDF in `public/` and set `profile.cvUrl`. Until then the hero shows "Contact me" instead of "Download CV".

`src/content/content.test.ts` guards a few rules: every public project links to its repo, only Tools Hubs is marked live, every screenshot file exists, and the copy has no em dashes or unbacked metrics.

## Design notes

- Light and dark themes. The theme follows the system setting until the visitor picks one with the toggle, and an inline script applies it before first paint so the page does not flash.
- Accessibility: skip link, one `h1`, labelled sections, visible focus rings, 44px touch targets, screen reader text on icon links and on links that open a new tab, and reduced motion respected.
- Two three.js pieces, both in their own scene modules (`src/components/*Scene.ts`):
  - **Project window stack** (Projects): the featured projects and live products as layered browser windows, driven by an accessible tab list (arrow keys, Home and End). Only the front window and three behind it are drawn. Before three.js loads, or without WebGL, the active screenshot shows as a plain image.
  - **Tech-stack graph** (Skills): projects and the technologies on their cards as a 3D network. The layout is a seeded force simulation in `src/lib/stack-graph.ts`, so it is the same on every load and is unit tested. A project list with a live caption gives keyboard and screen reader users the same information.
  - three.js (about 130 KB gzipped) is a separate chunk loaded only when a section scrolls into view, so it adds nothing to the first page load. Rendering pauses off screen and in background tabs, the pixel ratio is capped at 2, colours follow the theme, and reduced motion turns off idle movement.
- Phones get their own layout: a compact photo above the headline, a single swipeable row of featured tabs, and a swipeable row of project cards instead of a long grid.
- SEO: page metadata, a generated Open Graph image, `sitemap.xml`, `robots.txt` and a schema.org `Person` record. Set `NEXT_PUBLIC_SITE_URL` if the site is not served from `https://usamakhaki.com`.

## Deployment

Not deployed yet. The build output is fully static, so any Node host or Vercel works.
