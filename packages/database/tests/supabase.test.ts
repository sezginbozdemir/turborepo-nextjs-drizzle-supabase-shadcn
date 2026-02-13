import { describe, it, expect } from "vitest";
import { execa } from "execa";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";

describe("supabase integration", () => {
  it("imports supabase browser client and it has expected shape", async () => {
    const cwd = process.cwd();
    const typesFile = join(cwd, "src/supabase/supabase.types.ts");
    if (!existsSync(typesFile)) {
      throw new Error(`Missing placeholder file: ${typesFile}`);
    }
    const placeholder = readFileSync(typesFile, "utf8");

    try {
      await execa("npm", ["run", "sb:types"], {
        stdio: "inherit",
      });

      const generated = readFileSync(typesFile, "utf8");
      expect(generated.length).toBeGreaterThan(0);
      expect(generated).toContain("export type Database");
      expect(generated).not.toBe(placeholder);

      const { browserSupabase } = await import("@/supabase/supabase.client");
      expect(browserSupabase).toBeTruthy();
      expect(typeof browserSupabase.from).toBe("function");
    } finally {
      writeFileSync(typesFile, placeholder, "utf8");
    }

    const restored = readFileSync(typesFile, "utf8");
    expect(restored).toBe(placeholder);
  });
});
