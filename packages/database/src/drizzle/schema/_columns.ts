import { text, timestamp } from "drizzle-orm/pg-core";

export const baseModel = {
  id: text("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};
