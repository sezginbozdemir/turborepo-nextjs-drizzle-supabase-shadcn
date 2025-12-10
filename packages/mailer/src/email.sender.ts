import { EmailService } from "./email.service";
import type { EmailConfig } from "./types";
import { env } from "@repo/env-loader";
import { createLogger } from "@repo/shared/logger";

const logger = createLogger("email sender");

export async function createSender(
  rateLimitMs?: number,
): Promise<EmailService> {
  const host = env.SMTP_HOST;
  const port = Number(env.SMTP_PORT) || 587;
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === "true" : false;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    logger.error("Missing SMTP environment variables.");
    throw new Error("Missing SMTP environment variables.");
  }

  const config: EmailConfig = {
    host,
    port,
    secure,
    auth: { user, pass },
    from,
  };

  logger.info(
    `Creating email sender from env. host: ${host} port: ${port} user: ${user}`,
  );
  return new EmailService(config, rateLimitMs);
}
