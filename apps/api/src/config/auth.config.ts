import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/database/drizzle/drizzle.client";
import { env } from "#config/env.config.js";
import { schema } from "@repo/database/drizzle/drizzle.client";

export const auth = betterAuth({
  appName: "turborepo app",
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: env.NEXT_PUBLIC_API_URL.replace("/api", ""),
  basePath: "/api/auth",
  trustedOrigins: [env.NEXT_PUBLIC_WEB_URL],
  advanced: {
    generateId: false,
    cookiePrefix: "turborepoapp",
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
      domain: ".turborepoapp.com",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "users",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      emailVerified: "email_verified",
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    modelName: "session",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      userId: "user_id",
      userAgent: "user_agent",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
    },
  },
  account: {
    modelName: "account",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      userId: "user_id",
      accountId: "account_id",
      accessToken: "access_token",
      providerId: "provider_id",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
    },
  },
  verification: {
    modelName: "verification",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      expiresAt: "expires_at",
    },
  },
});
