import type z from "zod";
import { users } from "@repo/database/drizzle/drizzle.client";
import { createSelectSchema } from "@repo/database/drizzle/drizzle.client";

export const UserModel = createSelectSchema(users);
export const CreateUserModel = UserModel.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUser = z.infer<typeof CreateUserModel>;
