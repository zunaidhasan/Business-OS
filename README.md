# Corevo Business OS

Corevo is a business operations dashboard prototype that brings sales, compliance, and team workflows into one workspace. It includes a public product site and a data-backed dashboard populated with sample company records.

## What is included

- **Company dashboard** with pipeline, lead, KYC, and operations summaries.
- **Lead management** with stages, ownership, lead values, and activity.
- **Sales pipeline** for tracking deals from discovery through close.
- **KYC review** with case statuses, risk levels, and document records.
- **Operations board** for assigning and tracking team tasks.
- **Reports, team, and settings** views for the demo workspace.
- **Sample data** seeded automatically when the landing page or dashboard loads and the database is empty.

## Built with

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- PostgreSQL with Drizzle ORM

## Run locally

### Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database

The checked-in Drizzle config targets a local database at `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Start PostgreSQL and create that database (or update the URL in `drizzle.config.json` to match your local setup).

```bash
createdb app_db
```

### 3. Configure the application connection

Set `DATABASE_URL` to the same PostgreSQL connection string. For the default local configuration:

```bash
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db"
```

On Windows PowerShell, use `$env:DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/app_db"`.

### 4. Create the tables and start the app

```bash
npx drizzle-kit push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/dashboard` to explore the seeded workspace. Demo records are inserted on first load when the `organizations` table is empty.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |
| `npx drizzle-kit push` | Apply the Drizzle schema to PostgreSQL |

## Routes

| Path | Description |
| --- | --- |
| `/` | Product landing page |
| `/login` | Sign-in screen |
| `/dashboard` | Company overview |
| `/dashboard/leads` | Lead board |
| `/dashboard/sales` | Sales pipeline |
| `/dashboard/kyc` | KYC cases and document review |
| `/dashboard/operations` | Operations tasks |
| `/dashboard/reports` | Reports |
| `/dashboard/team` | Team directory |
| `/dashboard/settings` | Workspace settings and demo data controls |
| `/api/health` | Database connectivity check |
| `/api/leads`, `/api/deals`, `/api/kyc`, `/api/tasks` | Dashboard resource APIs |
| `/api/seed` | `POST` endpoint to regenerate demo records |

The seed endpoint clears and recreates the demo dataset. Use it only with a development database; do not point it at data you need to keep.

## Project structure

```text
src/
  app/          App Router pages and API routes
  components/   Shared dashboard UI and landing-page sections
  db/           PostgreSQL schema and Drizzle connection
  lib/          Data queries, formatting, API helpers, and demo seeding
```

## Notes

- The runtime database connection is read from `DATABASE_URL`.
- The Drizzle CLI reads its connection URL from `drizzle.config.json`; keep it aligned with `DATABASE_URL` when changing database credentials.
- This repository is a demo/prototype. Its sample records are not production data, and the reset endpoint is destructive.