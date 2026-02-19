import * as Sentry from "@sentry/node";
import { env } from "#/config/env.config";

Sentry.init({
  dsn: env.SENTRY_KEY!,
  environment: process.env.NODE_ENV || "development",
  enableLogs: true,
  sendDefaultPii: true,
});
