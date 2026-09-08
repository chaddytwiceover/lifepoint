# LifePoint

Turn real life into progress you can see. LifePoint is a mobile-first life gamification app with a personal corkboard, paper notes, and pinned quests. Progress is saved in your browser.

## Features

- Start with Student, Creator, Fitness, or Personal Growth categories, or build a blank board.
- Create custom categories and one-time or repeatable quests with XP rewards.
- Earn category and overall levels, maintain daily streaks, and unlock achievements.
- Browse recent activity and statistics; search and filter quests by status.
- Edit your profile and reset your board in Settings.
- Use responsive controls, keyboard-accessible dialogs, and reduced-motion support. Quest deletion asks for confirmation and preserves earned XP.

## Run locally

Install Bun and a current Node.js LTS runtime, then run:

```sh
git clone https://github.com/chaddytwiceover/lifepoint.git
cd lifepoint
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000. The development server binds to all network interfaces. The repository tracks `bun.lock`; use Bun to preserve the dependency resolutions.

No API keys, backend, or environment file are required. The optional shell variable `DISABLE_HMR=true` disables Vite hot module replacement and file watching. See `.env.example` for configuration notes.

## Development commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server on port 3000. |
| `bun run lint` | Run TypeScript checking (`tsc --noEmit`); this is not an ESLint check. |
| `bun run test` | Run the Vitest suite once. |
| `bun run build` | Build the static app into `dist/`. |
| `bun run preview` | Preview the production build locally. |

Run the type check, tests, and build before submitting changes. Tests cover leveling, streaks, quest transactions, achievements, and storage normalization. Browser interaction and visual checks are separate from the unit suite.

To host the app, publish the generated `dist/` directory to a static web host. No application server is required.

## Data and privacy

Profile, categories, quests, XP, streaks, achievements, preferences, and recent activity are stored in `localStorage` under `lifepoint:v1`. Data belongs to the current browser profile and site origin; it does not sync between devices or different hostnames. Clearing browser storage or using Clear All Board Data removes that progress. There is currently no account system or built-in export/import flow.

The app does not call a Gemini API or application backend. Google Fonts are loaded externally, so the page still makes network requests for typography. An AI SDK remains in the dependency list from the initial scaffold but is not used by the app.

Repeatable quests remain active after completion. Streaks use local calendar dates and advance at most once per day when a quest is completed.

## Codebase

Built with React, TypeScript, Vite, Tailwind CSS, Motion, and Lucide icons.

| Path | Responsibility |
| --- | --- |
| `src/pages/` | Home, quests, statistics, achievements, and settings views. |
| `src/components/` | Board cards, dialogs, navigation, and onboarding. |
| `src/context/LifePointContext.tsx` | Shared state and application actions. |
| `src/domain/` | Leveling, streak, quest, and achievement rules and tests. |
| `src/storage/` | Browser persistence, normalization, and tests. |
| `src/data/starterTemplates.ts` | Onboarding category presets. |
| `src/index.css` | Board materials, typography, and shared styles. |
| `index.html` | Page title, search description, and social metadata. |
| `metadata.json` | App identity and declared host capabilities. |

Keep the app descriptions in `package.json`, `metadata.json`, and `index.html` consistent when changing product positioning. Social cards currently use a text summary; no social preview image or canonical deployment URL is configured.
