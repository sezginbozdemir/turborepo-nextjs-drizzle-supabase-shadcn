import { describe, it, expect, beforeAll } from "vitest";
import { app, makeEmail } from "./setup";
import { SignInUser } from "#/app/models/user.model.js";
import request from "supertest";
import { makeSignUpPayload } from "./sign-up.test";

describe("POST /api/auth/sign-in", () => {
  let payload: SignInUser;
  let email: string;
  beforeAll(async () => {
    const randomEmail = makeEmail();
    email = randomEmail;
    const payload = makeSignUpPayload({ email: email });
    const res = await request(app).post("/api/auth/sign-up").send(payload);
    expect(res.status).toBe(201);
  });

  it("signs in user with valid payload", async () => {
    payload = { email: email, password: "Password123!" };
    const res = await request(app).post("/api/auth/sign-in").send(payload);

    expect(res.status).toBe(201);
  });

  it("rejects invalid payload", async () => {
    const invalidPayload = {
      email: email,
      password: "Password321!",
    };

    const res = await request(app)
      .post("/api/auth/sign-in")
      .send(invalidPayload);

    expect([401, 422]).toContain(res.status);
  });

  it("rejects missing empty body", async () => {
    const res = await request(app).post("/api/auth/sign-in");

    expect([400, 415, 422]).toContain(res.status);
  });
});
