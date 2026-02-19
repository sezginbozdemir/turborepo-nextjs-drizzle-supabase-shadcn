import { describe, it, expect, beforeEach } from "vitest";
import { app } from "./setup.js";
import { SignUpUser } from "#/app/models/user.model.js";
import request from "supertest";
import { makeEmail } from "./setup";

export const makeSignUpPayload = (
  overrides?: Partial<SignUpUser>,
): SignUpUser => ({
  email: makeEmail(),
  password: "Password123!",
  name: "User",
  phone: null,
  ...overrides,
});
describe("POST /api/auth/sign-up", () => {
  let uniquePayload: SignUpUser;

  beforeEach(() => {
    uniquePayload = makeSignUpPayload();
  });
  it("creates a user with valid payload", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up")
      .send(uniquePayload);

    expect(res.status).toBe(201);
  });

  it("rejects invalid payload", async () => {
    const invalidPayload = makeSignUpPayload({ email: "not-an-email" });

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send(invalidPayload);

    expect([400, 422]).toContain(res.status);
  });

  it("rejects missing empty body", async () => {
    const res = await request(app).post("/api/auth/sign-up");

    expect([400, 415, 422]).toContain(res.status);
  });

  it("rejects duplicate email", async () => {
    const email = makeEmail();
    const payload = makeSignUpPayload({ email: email, name: "Alice" });
    await request(app).post("/api/auth/sign-up").send(payload);
    const res = await request(app).post("/api/auth/sign-up").send(payload);

    expect([409, 422]).toContain(res.status);
  });
});
