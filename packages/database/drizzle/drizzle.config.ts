import { defineConfig } from "drizzle-kit";
import { env } from "@repo/env-loader";

// Replace pooling port with standart postgres port

const nonPoolingUrl = env.DATABASE_URL.replace(":6543", ":5432");

// Export the drizzle configuration, this is read by drizzle-kit cli commands

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema/index.ts",
  schemaFilter: ["public"],
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
});
