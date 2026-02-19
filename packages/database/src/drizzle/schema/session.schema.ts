import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { baseModel } from "./_columns";
import { users } from "./user.schema";

export const session = pgTable("session", {
  ...baseModel,

  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),

  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),

  ip_address: varchar("ip_address", { length: 45 }),
  user_agent: text("user_agent"),
});
