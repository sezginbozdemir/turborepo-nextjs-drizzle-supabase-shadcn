import {
  DatabaseError,
  HttpException,
  UnknownError,
} from "#app/errors/errors.js";
import { DrizzleQueryError } from "@repo/database/drizzle/drizzle.client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { createLogger } from "@repo/shared/logger";

const logger = createLogger("express error handler");

export const errorHandler: ErrorRequestHandler = function (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof DrizzleQueryError) {
    const databaseError = new DatabaseError(error);
    if (databaseError?.code === "23505") {
      logger.error(databaseError.message, { err: databaseError });
      return res.status(409).json({ message: databaseError.message });
    }
    if (databaseError?.code === "ECONNREFUSED") {
      logger.error("Database refused to connect", { err: databaseError });
      return res.status(500).json({ message: databaseError.message });
    }
    logger.error("database error", { err: databaseError });
    return res.status(500).json({ message: databaseError.message });
  }

  if (error instanceof HttpException) {
    logger.error("HttpException", { error });
    return res.status(error.status).json({ message: error.errorMessage });
  }

  const unknownError = new UnknownError(error);

  logger.error(unknownError.message, { err: unknownError });
  return res.status(500).json({ message: unknownError.message });
};
