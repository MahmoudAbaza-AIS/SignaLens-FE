# SignaLens Frontend

**SignaLens** is a web app that makes industrial sensor data easy to find, trust, and ask about.

Factories already store readings in systems like **AVEVA Historian**, but those systems are hard for day-to-day users: sensors have technical names (`PLANT.PUMP01.TEMP`), and turning numbers into charts needs specialist skills. SignaLens sits on top of that data so operators, engineers, and admins can:

- Find a machine by a readable name (“Pump 1”), not a technical code
- See trustworthy charts with **unit**, **time range**, and **how recent** the data is
- Save dashboards of charts
- Ask plain-language questions (“Show me Pump 1 temperature for today”) and get an honest answer or chart from an AI assistant

This repository is the **browser frontend** — the charts, chat UI, shell, and settings. It never talks to a database directly; every request goes through the .NET API.

> Companion docs in this folder:  
> `SignaLens - Project Guide.pdf` (what the system is) · `SignaLens - Business Rules.pdf` (what the app must do, and why)

---

## The idea in one paragraph

People who look after factory machines need to know what is happening without memorising sensor codes. SignaLens lets them pick a machine, see trustworthy charts, and ask questions in plain English. The real value is not the chart itself — it is giving the **right answer** about the **right machine**, for the **right time**, while being **honest** about how good and how recent the data is.

### Four promises

| Promise | In practice |
| --- | --- |
| **Find the right thing** | “Pump 1 temperature” leads to the correct sensor, not a similar-looking one. |
| **Show trustworthy data** | Time, unit, quality, and last update are always visible. |
| **Explain, don’t guess** | Unclear question → ask. No data → say “no data”. Never invent values. |
| **Respect access** | People see only what they are allowed to see — in charts **and** in chat. |

### Core data model

| Word | Meaning | Everyday comparison |
| --- | --- | --- |
| **Asset** | A machine or area we monitor | A student |
| **Tag (sensor)** | One measurement channel on an asset | One subject that student takes |
| **Reading** | One value at one moment: time + number + quality | One exam grade with its date |
| **Quality** | Can we trust this reading? Good / uncertain / bad / unknown | A grade marked “provisional” |

---

## Who uses it?

| Role | Can do | Cannot do |
| --- | --- | --- |
| **Viewer** | Find machines and look at charts | Change dashboards or settings |
| **Editor** | Arrange and save dashboards | Change sensor data or control machines |
| **Administrator** | Manage users and who can see what | Change the customer’s original Historian data |

Roles above are a starting point — confirm with the customer what they really need.

### Example journeys

1. **Check a pump** — Operator picks Pump 1 → temperature → today → clear chart with °C and freshness.
2. **Ask a question** — “What happened to Pump 1 temperature this morning?” → correct chart, or an honest “I can’t answer”; if two Pump 1s exist, ask which.
3. **Compare** — Engineer compares Pump 1 and Pump 2 for last week → both lines labelled; units not mixed up.
4. **Missing data** — Chart has a gap → user can tell why (no readings, bad readings, or data not copied yet).

---

## What version 1 does — and does not

**Does**

- List machines and sensors with readable names and units
- Draw line charts for a chosen time range, with freshness
- Let users save dashboards made of charts
- Chat with an AI assistant for text answers or charts
- Keep a record of what the AI did, so a wrong answer can be investigated

**Does not (out of scope)**

- Start, stop, or otherwise **control** machines
- Handle alarms, failure predictions, or live streaming
- Change Historian / source data
- Let the AI run unchecked queries against the database

---

## System architecture

```
AVEVA Historian  →  ETL job  →  SQL Server  →  .NET API  →  Browser (this repo)
                                      ↑
                                 MongoDB (chats / AI records)
                                      ↑
                                   AI / LLM
```

| Part | One job | Must never |
| --- | --- | --- |
| AVEVA Historian | Hold original sensor readings | Be changed by SignaLens |
| ETL | Copy new readings into our database | Mark data as copied if the copy failed |
| SQL Server | Assets, tags, readings, users, dashboards | Pretend old data is live |
| MongoDB | Chat sessions, messages, AI attempt records | Become a second copy of sensor data |
| .NET API | Auth, permissions, every AI query check | Run AI-written queries without checking them |
| **Browser (this repo)** | Charts, chat, settings UI | Connect straight to a database |
| AI model | Understand the question and suggest what to fetch | Have free access to the database |

---

## Core business rules (summary)

Full detail: `SignaLens - Business Rules.pdf`. Learn these first.

1. Every chart must say exactly which machine and sensor it shows.
2. If a question is unclear, **ask — never guess**.
3. Every number must have a **unit**, or say “unit unknown”.
4. Bad-quality readings must not count as normal values.
5. **“No data” is not the same as “zero”.**
6. Show how recent the data is, and warn when it is stale.
7. Every chart must show its time range and time zone.
8. Never hide gaps. Never invent values.
9. Users only see what they are allowed to see — in charts **and** chat.
10. A private chat stays private, even if someone knows its ID.
11. The app never controls machines.
12. A general question gets a general answer — not fake site data.

---

## This repository (frontend)

Vite + React + TypeScript frontend structured as a **modular monolith**: one deployable app, feature modules with clear boundaries, and a shared kernel for shell / API / UI.

```
src/
  app/                 # Composition root (App, routes, providers)
  modules/             # Feature modules (auth, users, overview, …)
  shared/              # Shared kernel (layout, ui, lib, hooks, styles)
```

| Area | Routes / notes |
| --- | --- |
| Auth | `/login` — UI session gate until backend auth exists |
| Shell | Sidebar + topbar (LLM / refresh / theme / account menu) |
| Overview, Dashboards, AI Chat, Assets & Tags, ETL Health | Feature stubs for interns to fill |
| Users & Settings | Users, LLM providers, preferences (live API with seed fallback) |

### Stack

- React 19 + Vite + TypeScript
- React Router (auth gate + shell layout)
- PrimeReact 11 unstyled primitives + Tailwind CSS 4
- `openapi-fetch` + `openapi-typescript`

PrimeReact unstyled primitives require `PrimeReactProvider` (`src/app/providers.tsx`). Without a license key you may see a console warning; the on-page banner is hidden in CSS. Set `VITE_PRIMEUI_LICENSE` to a free [Community](https://primeui.dev/licenses/community) or Commercial key to clear the warning properly.

---

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

1. Open `/login`.
2. Sign in with any valid email and a password of **6+ characters** (layout-only gate until backend auth exists).
3. Set `VITE_API_BASE_URL` to the ASP.NET Core **origin only** (for example `http://localhost:5299`).

API paths are root-relative (`/Assets`, `/Dashboards`, `/Users`, …) — **do not** append `/api`.

If the API is unreachable, Users & Settings falls back to wireframe sample data after a short timeout.

### Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin (no trailing path) |
| `VITE_PRIMEUI_LICENSE` | Optional PrimeUI Community/Commercial key |

---

## Intern guide: feature pages and routing

1. Create or update a page under `src/modules/<feature>/pages/`.
2. Register it in `src/app/routes.tsx` as a child of `AppShell` (inside `RequireAuth`).
3. Keep shared chrome in `src/shared/components/layout/`.
4. Sidebar labels / paths / icons live in `src/shared/navigation.ts`.

Unknown routes render a SignaLens-styled **404** (“signal lost”).

---

## Regenerating API types

```bash
npm run api:generate
```

Types land in `src/shared/lib/api/schema.d.ts`.

```ts
import { apiClient } from '@/shared/lib/api/client'

const { data, error } = await apiClient.GET('/Assets')
```

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run api:generate` | Regenerate OpenAPI types from `openapi/openapi.json` |

---

## Safety & honesty (frontend mindset)

When you build screens, keep these product rules visible:

- Prefer “no data”, “stale”, or “I can’t answer” over a pretty but wrong chart
- Never invent sensor values or smooth over gaps
- Respect access — hide what the user must not see (including in chat UX)
- SignaLens is **read-only** — refuse control-style requests in copy and UI

Open customer questions (names, roles, stale thresholds, time zone, AI hosting) are listed in the Business Rules guide — **don’t invent answers**; mark them as ask-the-customer.
