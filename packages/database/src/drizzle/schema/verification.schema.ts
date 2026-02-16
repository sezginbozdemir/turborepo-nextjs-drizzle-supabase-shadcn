import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseModel } from "./_columns";

export const verification = pgTable("verification", {
  ...baseModel,

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
});
