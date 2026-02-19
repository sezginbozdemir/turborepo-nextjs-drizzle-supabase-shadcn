import { beforeEach, afterEach, describe, it, expect } from "vitest";
import { app, makeEmail } from "./setup.js";
import request from "supertest";
import { makeSignUpPayload } from "./sign-up.test.js";

describe("DELETE /api/users", () => {
  let email: string;
  let userId: string | undefined;

  beforeEach(async () => {
    email = makeEmail();
    const payload = makeSignUpPayload({ email });
    const res = await request(app).post("/api/auth/sign-up").send(payload);
    expect(res.status).toBe(201);

    userId = res.body.id ?? res.body.user?.id;
    expect(userId).toBeTruthy();
  });

  afterEach(async () => {
    if (!userId) return;
    await request(app).delete(`/api/users/${userId}`);
    userId = undefined;
  });

  it("deletes user by id, then GET returns 404", async () => {
    const del = await request(app).delete(`/api/users/${userId}`);
    expect(del.status).toBe(200);

    const get = await request(app).get(`/api/users/${userId}`);
    expect(get.status).toBe(404);
  });

  it("deletes user by email, then GET returns 404", async () => {
    const del = await request(app).delete("/api/users").query({ email });
    expect(del.status).toBe(200);

    const get = await request(app).get("/api/users").query({ email });
    expect(get.status).toBe(404);
  });
});
