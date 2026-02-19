import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, makeEmail, makeSignUpPayload } from "./setup";
import request from "supertest";

describe("GET  /api/user", () => {
  let email: string;
  let userId: string;
  beforeAll(async () => {
    const randomEmail = makeEmail();
    email = randomEmail;
    const payload = makeSignUpPayload({ email: email });
    const res = await request(app).post("/api/auth/sign-up").send(payload);
    userId = res.body.id;
    expect(res.status).toBe(201);
  });
  afterAll(async () => {
    const del = await request(app).delete("/api/users").query({ email });
    expect(del.status).toBe(200);
  });

  it("gets user by email", async () => {
    const res = await request(app).get("/api/users").query({ email });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
    expect(res.body.id).toBe(userId);
  });

  it("gets user by id", async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe(email);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/users/non-existing-id");
    expect([400, 404]).toContain(res.status);
  });

  it("returns 400 if email query param missing", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(400);
  });
});
