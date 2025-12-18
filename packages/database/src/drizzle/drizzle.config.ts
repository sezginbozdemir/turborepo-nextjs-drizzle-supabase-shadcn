import { defineConfig } from "drizzle-kit";
import { env } from "../env";

// Replace pooling port with standart postgres port

const nonPoolingUrl = env.DATABASE_URL.replace(":6543", ":5432");

// Export the drizzle configuration, this is read by drizzle-kit cli commands

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema/index.ts",
  schemaFilter: ["public"],
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
});
