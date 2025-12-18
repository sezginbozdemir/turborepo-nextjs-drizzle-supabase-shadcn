## @repo/database

This package provides shared database clients for the monorepo. It exports:

- **Drizzle client**
- **Supabase browser client**
- Shared **types**, **schema**, and **configuration**

---

It relies on **`@repo/shared`** for environment variable loading.

---

### Drizzle Client

Located in `drizzle/drizzle.client.ts`.  
Exports a configured Drizzle instance that connects using your environment variables.

Schemas live under `drizzle/schema`.

`db:push` Pushes schema changes to the database using Drizzle Kit.
`db:up` Applies pending migrations to the database.
`db:generate` Generates migration files from your current schema.
`db:pull` Introspects the database and updates local schema definitions.
`db:migrate` Runs pending migration scripts.
`db:studio` Opens Drizzle Studio for visual database management.
`sb:types` Generates TypeScript types for Supabase using `generate-types.ts`.

---

### Supabase Browser Client

Located in `supabase/supabase.client.ts`.  
Exports a browser-safe Supabase client for use in frontend apps.

Supabase types are not included by default.A placeholder file is provided at `supabase/supabase.types.ts`
Before using the client you need to generate your own types.

1. Login to Supabase CLI (this will redirect you to browser)

```bash
npx supabase login

```

2. Initialize your project

```bash
npx supabase init

```

3. Generate types by calling to script

```bash
npm run sb:types

```

---

### Usage

Import from the package in any app:

```ts
import { db } from "@repo/database/drizzle/drizzle.client";
import { browserSupabase } from "@repo/database/supabase/supabase.client";
```

---
