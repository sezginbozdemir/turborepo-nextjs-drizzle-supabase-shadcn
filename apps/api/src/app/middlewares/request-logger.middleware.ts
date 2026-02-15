import type { Request, Response, NextFunction } from "express";
import { createLogger } from "@repo/shared/logger";

const logger = createLogger("http request");

export function requestLogger(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  logger.info("Request received");
  next();
}
