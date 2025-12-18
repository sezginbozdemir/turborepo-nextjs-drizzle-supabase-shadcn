## @repo/env-loader

Utility package for centralized environment variable loading and validation in the monorepo.

It:

- Resolves environment files from the project root (via `resolveEnvs`)
- Validates env variables using [`@t3-oss/env-core`](https://github.com/t3-oss/t3-env) and [`zod`](https://zod.dev)
- Exposes a shared, type‑safe `env` object for server and client usage

---

### Usage

```ts
import { resolveEnvs, env } from "@repo/env";

// Initialize at app startup.
resolveEnvs();

// Then use your typed variables

console.log(env.NODE_ENV);
```

---
