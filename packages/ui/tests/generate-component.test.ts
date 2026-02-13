// tests/shadcn-add-component.test.ts
import { describe, it, expect } from "vitest";
import { execa } from "execa";
import fs from "node:fs";
import path from "node:path";

describe("shadcn add", () => {
  it("adds a component and it exists (and can be imported)", async () => {
    const cwd = process.cwd();
    const component = "input";
    const componentFile = path.join(
      cwd,
      "src",
      "components",
      `${component}.tsx`,
    );

    await execa("npm", ["exec", "shadcn", "add", component], {
      cwd,
      stdio: "inherit",
    });

    expect(fs.existsSync(componentFile)).toBe(true);
  });
});
