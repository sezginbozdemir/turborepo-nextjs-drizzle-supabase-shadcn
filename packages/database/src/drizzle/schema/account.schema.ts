import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { baseModel } from "./_columns";
import { users } from "./user.schema";

export const account = pgTable("account", {
  ...baseModel,

  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  account_id: text("account_id").notNull(),
  provider_id: text("provider_id").notNull(),

  access_token: text("access_token"),
  refresh_token: text("refresh_token"),

  access_token_expires_at: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refresh_token_expires_at: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),

  scope: text("scope"),
  id_token: text("id_token"),

  password: text("password"),
});
