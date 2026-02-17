import { createLogger } from "@repo/shared/logger";
import { env } from "#config/env.config.js";
import { createServer } from "#app/express.js";

const PORT = Number(env.SERVER_PORT) || 9000;

const logger = createLogger("express entry");

export async function startServer() {
  const { server } = createServer();
  server.on("error", (err) => {
    logger.error("HTTP server error", { err });
    process.exit(1);
  });

  server.listen(PORT, () => {
    logger.info(`Server Listening on port: ${PORT}`);
  });

  async function shutdown(signal: string) {
    logger.info(`${signal} received. Gracefully shutting down...`);
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info("Http server closed.");
        resolve();
      });
    });
    logger.info("Shutdown completed.");
    process.exit(0);
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
startServer().catch((err) => {
  logger.error("Failed to start server:", { err });
  process.exit(1);
});
