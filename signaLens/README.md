# SignaLens Frontend

Vite + React + TypeScript frontend structured as a **modular monolith**: one deployable app, feature modules with clear boundaries, and a shared kernel for shell/API/UI.

## Architecture

```
src/
  app/                 # Composition root (App, routes)
  modules/             # Feature modules (auth, users, overview, …)
  shared/              # Shared kernel (layout, ui, lib, hooks, styles)
```

Each feature owns its pages/components. Shared chrome and API live in `shared/`. Routes are composed in `src/app/routes.tsx`.

## Stack

- React 19 + Vite + TypeScript
- React Router (auth gate + shell layout)
- PrimeReact 11 unstyled primitives + Tailwind CSS 4
- `openapi-fetch` + `openapi-typescript`

PrimeReact unstyled primitives require `PrimeReactProvider` (see `src/app/providers.tsx`). Without a license key you may see a console warning; the on-page banner is hidden in CSS. Set `VITE_PRIMEUI_LICENSE` to a free [Community](https://primeui.dev/licenses/community) or Commercial key to clear the warning properly.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open `/login`. Sign in with any valid email and a password of 6+ characters (UI gate until backend auth exists).

Set `VITE_API_BASE_URL` to the ASP.NET Core origin only (for example `http://localhost:5299`). API paths are root-relative (`/Assets`, `/Dashboards`, …) — do not append `/api`.

## Intern guide: feature pages and routing

1. Create or update a page under `src/modules/<feature>/pages/`.
2. Register it in `src/app/routes.tsx` as a child of `AppShell` (inside `RequireAuth`).
3. Keep shared chrome in `src/shared/components/layout/`.
4. Sidebar labels/paths/icons live in `src/shared/navigation.ts`.

## Regenerating API types

```bash
npm run api:generate
```

Types land in `src/shared/lib/api/schema.d.ts`. Client:

```ts
import { apiClient } from '@/shared/lib/api/client'

const { data, error } = await apiClient.GET('/Assets')
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run api:generate` | Regenerate OpenAPI types |
