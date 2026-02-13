import { join, resolve } from "path";
import { resolveEnvs } from "@/env-loader/resolve.env";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { existsSync, unlinkSync, writeFileSync } from "fs";

const root = resolve(process.cwd(), "../..");
const envPath = join(root, ".env.test");

describe("env-loader", () => {
  const original = process.env;

  beforeAll(() => {
    process.env = { ...original };

    if (existsSync(envPath)) unlinkSync(envPath);
  });

  afterAll(() => {
    if (existsSync(envPath)) unlinkSync(envPath);

    process.env = original;
  });

  it("loads values from env and resolves to process.env", () => {
    writeFileSync(envPath, `TEST_VALUE=test-env`, "utf8");

    resolveEnvs();

    expect(process.env.TEST_VALUE).toBe("test-env");
  });
});
