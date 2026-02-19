import z from "zod";
import { users } from "@repo/database";
import { createSelectSchema } from "@repo/database";
export const UserModel = createSelectSchema(users);
export type User = z.infer<typeof UserModel>;
export const SessionUserModel = UserModel.omit({
  image: true,
  phone: true,
  created_at: true,
  updated_at: true,
});
export type SessionUser = z.infer<typeof SessionUserModel>;

export const SignUpUserModel = UserModel.omit({
  id: true,
  created_at: true,
  updated_at: true,
  role: true,
  image: true,
  email_verified: true,
}).extend({
  image: z.string().optional(),
  password: z.string().min(8),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});
export type SignUpUser = z.infer<typeof SignUpUserModel>;

export const SignInUserModel = z.object({
  email: z.string(),
  password: z.string(),
  callbackURL: z.string().optional(),
  rememberMe: z.boolean().optional(),
});
export type SignInUser = z.infer<typeof SignInUserModel>;

export const UserResponseModel = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string(),
  image: z.string().nullable(),
  role: z.string(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponse = z.infer<typeof UserResponseModel>;
