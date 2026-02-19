import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { execa } from "execa";
import { db, pool, eq } from "@/drizzle/drizzle.client";
import { pgTable, text } from "drizzle-orm/pg-core";

const table = "some_table";
const __vitestTable = pgTable(table, {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

const schemaDir = join(process.cwd(), "src/drizzle/schema");
const schemaFile = join(schemaDir, "index.ts");
const tableFile = join(schemaDir, `${table}.ts`);
const exportLine = `export * from "./${table}";`;

const tableFileContent = `
import { pgTable, text } from "drizzle-orm/pg-core";
export const __vitestTable = pgTable("${table}", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
`;

function ensureExportLine() {
  const current = readFileSync(schemaFile, "utf8");
  if (!current.split(/\r?\n/).some((l) => l.trim() === exportLine)) {
    writeFileSync(schemaFile, `${exportLine}\n${current}`, "utf8");
  }
}

function removeExportLine() {
  const current = readFileSync(schemaFile, "utf8");
  const next = current
    .split(/\r?\n/)
    .filter((l) => l.trim() !== exportLine)
    .join("\n");
  writeFileSync(schemaFile, next, "utf8");
}

describe("drizzle integration", () => {
  beforeAll(async () => {
    mkdirSync(schemaDir, { recursive: true });
    if (!existsSync(schemaFile)) writeFileSync(schemaFile, "", "utf8");

    writeFileSync(tableFile, tableFileContent.trimStart(), "utf8");
    ensureExportLine();

    await execa("npm", ["run", "db:push"], {
      stdio: "inherit",
    });
  });

  afterAll(async () => {
    try {
      await pool.query(`drop table if exists "${table}"`);
    } catch {}

    // file cleanup
    try {
      removeExportLine();
    } catch {}
    try {
      if (existsSync(tableFile)) unlinkSync(tableFile);
    } catch {}

    try {
      await pool.end();
    } catch {}
  });

  it("inserts/selects", async () => {
    await db.delete(__vitestTable).where(eq(__vitestTable.id, "1"));

    await db.insert(__vitestTable).values({ id: "1", name: "alice" });

    const rows = await db
      .select()
      .from(__vitestTable)
      .where(eq(__vitestTable.id, "1"));

    expect(rows).toHaveLength(1);
    expect(rows[0]!.name).toBe("alice");

    await db.delete(__vitestTable).where(eq(__vitestTable.id, "1"));
  });
});
