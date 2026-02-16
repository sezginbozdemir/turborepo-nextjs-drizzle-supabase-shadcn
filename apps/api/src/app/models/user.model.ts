import type z from "zod";
import { users } from "@repo/database/drizzle/schema/user.schema";
import { createSelectSchema } from "@repo/database/drizzle/drizzle.client";

export const UserModel = createSelectSchema(users);
export const AuthUserModel = UserModel.omit({
  image: true,
  phone: true,
  created_at: true,
  updated_at: true,
});

export const CreateUserModel = UserModel.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateUser = z.infer<typeof CreateUserModel>;
export type User = z.infer<typeof UserModel>;
export type AuthUser = z.infer<typeof AuthUserModel>;
