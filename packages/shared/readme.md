## @repo/shared

Shared utilities for your monorepo. Currently includes:

- centralized environment variable loading
- A configurable console/file logger
- A CSV parser utility

---

### Logger

#### Usage

Create a logger instance and use it in your services:

```ts
import { createLogger } from "@repo/shared/logger";

const config = {
  // optional overrides
  minLevel: "debug", // "debug" | "info" | "warn" | "error"
  enableConsole: true,
  enableFile: true,
  logDir: "logs", // directory for log files
  maxSizeMB: 10, // rotate files when size exceeded
  maxFiles: 30, // keep up to N log files
};

const logger = createLogger("USER SERVICE", config);

// Basic usage
logger.debug("User fetched", { userId: 123 });
logger.info("Service started");
logger.warn("Something looks odd", { detail: "..." });
logger.error("Unexpected error", { err: someError });

// Optional default context (merged into every log)
logger.setContext({ service: "user-service" });
logger.info("With default context");
logger.clearContext();

// Simple timing helpers
logger.startTimer("expensive-operation");
// ... do work ...
logger.endTimer("expensive-operation"); // logs duration in ms
```

#### Behavior

- In non-production `minLevel` defaults to "debug"
- In production `minLevel` defautls to "warn"
- Console logs are colorized by level
- If `enableFile` is true, logs are written to daily files
- Files are rotated when they exceed `maxSizeMB`.
- Old files are cleaned up, keeping at most `maxFiles` .

---

### Parser

Utility to parse files from disk using [PapaParse](https://www.papaparse.com/)

#### Usage

```ts
import { parseCsv } from "@repo/shared/parser";

const rows = await parseCsv("path/to/file");

// rows is an array of objects
```

---

### env-loader

Utility package for centralized environment variable loading and validation in the monorepo.

#### Usage

```ts
import { resolveEnvs } from "@repo/env";

// Initialize at app startup.
resolveEnvs();

// Then use your typed variables

console.log(env.NODE_ENV);
```
