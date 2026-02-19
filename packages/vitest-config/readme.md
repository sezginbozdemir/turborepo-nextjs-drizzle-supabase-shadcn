## @repo/vitest-config

This package is powered by [shadcn/ui](https://ui.shadcn.com/)

Shared [Vitest](https://vitest.dev/) configuration for all apps/packages in this monorepo.

---

### Usage

1. Create vitest.config.ts in your app/package:

```ts
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "@repo/vitest-config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
    },
  }),
);
```

2. Add script:

```bash
{
  "scripts": {
    "test": "vitest run",
  }
}
```
