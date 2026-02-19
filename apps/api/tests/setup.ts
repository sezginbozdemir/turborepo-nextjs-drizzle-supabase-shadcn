import { createServer } from "#/app/express.js";
import type { Server } from "node:http";
import { beforeAll, afterAll } from "vitest";
import { Express } from "express";
import { SignUpUser } from "#/app/models/user.model";

let server: Server;
export let app: Express;

export const makeEmail = (prefix = "user"): string =>
  `${prefix}-${Math.random().toString(16).slice(2)}@example.com`;

export const makeSignUpPayload = (
  overrides?: Partial<SignUpUser>,
): SignUpUser => ({
  email: makeEmail(),
  password: "Password123!",
  name: "User",
  phone: null,
  ...overrides,
});

beforeAll(async () => {
  const { app: expressApp, server: httpServer } = createServer();

  app = expressApp;

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(0, "127.0.0.1", () => resolve());
  });

  server = httpServer;

  const addr = server.address();
  if (!addr || typeof addr === "string") {
    throw new Error("Failed to get server address");
  }
});

afterAll(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});
