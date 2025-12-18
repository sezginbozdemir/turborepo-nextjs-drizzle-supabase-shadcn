import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
import { Pool, type ClientConfig } from "pg";
import * as schema from "./schema/index";

// Define config for postgres client

const config: ClientConfig = {
  connectionString: env.DATABASE_URL,
};

// Create a new conenction pool using the config above

export const pool = new Pool(config);

// Create drizzle instance using the pool and provided schema
// 'db' will be used to run typed queries against the database
export const db = drizzle(pool, { schema });

// Re-export helpfull stuff

export type { PgColumn, PgTable, IndexColumn } from "drizzle-orm/pg-core";
export * from "drizzle-orm";
export * from "./schema";
