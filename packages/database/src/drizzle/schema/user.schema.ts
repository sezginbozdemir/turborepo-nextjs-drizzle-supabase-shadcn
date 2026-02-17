import { pgTable, pgEnum, varchar, text, boolean } from "drizzle-orm/pg-core";
import { baseModel } from "./_columns";

export const userEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  ...baseModel,
  name: varchar("name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 14 }).unique(),
  email: text("email").unique().notNull(),
  email_verified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userEnum("role").notNull().default("user"),
});
