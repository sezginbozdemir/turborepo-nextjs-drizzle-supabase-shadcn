import { env } from "../env.js";
import { createLogger } from "@repo/shared/logger";
import { execSync } from "child_process";
const logger = createLogger("database module");

const PROJECT_REF = env.SUPABASE_PROJECT_REF;
const outputFile = "./src/supabase/supabase.types.ts";

if (!PROJECT_REF) logger.error("project ref is not set in your environment");

logger.info("generating supabase types...");

try {
  execSync(
    `npx supabase gen types typescript --project-id ${PROJECT_REF} --schema public > ${outputFile}`,
    { stdio: "inherit" },
  );

  logger.info("supabase types was generated successfully");
} catch (err) {
  logger.error("failed to generate supabase typescript", { Error: err });
  process.exit(1);
}
