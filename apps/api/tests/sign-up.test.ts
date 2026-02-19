import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, makeSignUpPayload } from "./setup.js";
import { SignUpUser } from "#/app/models/user.model.js";
import request from "supertest";

describe("POST /api/auth/sign-up", () => {
  let payload: SignUpUser;

  beforeAll(() => {
    payload = makeSignUpPayload();
  });

  afterAll(async () => {
    const del = await request(app)
      .delete("/api/users")
      .query({ email: payload.email });
    expect(del.status).toBe(200);
  });

  it("creates a user with valid payload", async () => {
    const res = await request(app).post("/api/auth/sign-up").send(payload);

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
    const res = await request(app).post("/api/auth/sign-up").send(payload);
    expect([409, 422]).toContain(res.status);
  });
});
