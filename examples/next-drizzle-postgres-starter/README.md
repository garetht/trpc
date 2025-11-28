# Drizzle + tRPC

## Features

- 🧙‍♂️ E2E typesafety with [tRPC](https://trpc.io)
- ⚡ Full-stack React with Next.js
- ⚡ Database with Drizzle ORM
- ⚙️ VSCode extensions
- 🎨 ESLint + Prettier
- 💚 CI setup using GitHub Actions:
  - ✅ E2E testing with [Playwright](https://playwright.dev/)
  - ✅ Linting
- 🔐 Validates your env vars on build and start

## Setup

```bash
pnpm create next-app --example https://github.com/trpc/trpc --example-path examples/next-drizzle-postgres-starter trpc-drizzle-starter
cd trpc-drizzle-starter
pnpm
pnpm dx
```

### Requirements

- Node >= 18.0.0
- Postgres

## Development

### Local database workflow

```bash
docker compose up -d        # start Postgres on localhost:5499
pnpm db-migrate             # create/update database schema
pnpm db-seed                # populate baseline data
pnpm dev                    # run the Next.js dev server
```

### Start project

```bash
pnpm create next-app --example https://github.com/trpc/trpc --example-path examples/next-drizzle-postgres-starter trpc-drizzle-starter
cd trpc-drizzle-starter
pnpm
pnpm dx
```

### Commands

```bash
pnpm build       # runs next build
pnpm db-migrate  # runs idempotent database migrations
pnpm db-seed     # seeds local db
pnpm dev         # seeds and starts next.js locally
pnpm dx          # runs all dx:* scripts (migrate + seed + dev server)
pnpm test-start  # runs e2e + unit tests
pnpm test-unit   # runs normal Vitest unit tests
pnpm test-e2e    # runs e2e tests
```

## Deployment

### Using [Render](https://render.com/)

The project contains a [`render.yaml`](./render.yaml) [_"Blueprint"_](https://render.com/docs/blueprint-spec) which makes the project easily deployable on [Render](https://render.com/).

Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) and connect to this Blueprint and see how the app and database automatically gets deployed.

## Files of note

<table>
  <thead>
    <tr>
      <th>Path</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="./src/server/db/schema.ts"><code>./src/server/db/schema.ts</code></a></td>
      <td>Drizzle schema</td>
    </tr>
    <tr>
      <td><a href="./src/pages/api/trpc/[trpc].ts"><code>./src/pages/api/trpc/[trpc].ts</code></a></td>
      <td>tRPC response handler</td>
    </tr>
    <tr>
      <td><a href="./src/server/routers"><code>./src/server/routers</code></a></td>
      <td>Your app's different tRPC-routers</td>
    </tr>
  </tbody>
</table>

---

Created by [@alexdotjs](https://twitter.com/alexdotjs).
