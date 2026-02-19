import {
  DatabaseError,
  HttpException,
  UnknownError,
} from "#/app/errors/errors.js";
import { DrizzleQueryError } from "@repo/database";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { createLogger } from "@repo/shared/logger";
import { APIError } from "better-auth";
import { ZodError } from "zod";

const logger = createLogger("express error handler");

export const errorHandler: ErrorRequestHandler = function (
  err,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  let error = err as any;
  if (res.headersSent) return next(error);
  if (error?.type === "entity.parse.failed") {
    error = new HttpException(400, "Invalid JSON payload");
  }

  if (error instanceof APIError) {
    logger.error(error.message, {
      name: error.name,
      status: error.status,
      code: error.statusCode,
    });
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    logger.error("Unproccesable entity", {
      name: error.name,
      issues: error.issues,
      cause: error.cause,
    });
    return res.status(422).json({ message: "Unproccesable entity" });
  }

  if (error instanceof DrizzleQueryError) {
    const databaseError = new DatabaseError(error);
    if (databaseError?.code === "23505") {
      logger.error(databaseError.message, {
        name: databaseError.name,
        code: databaseError.code,
      });
      return res.status(409).json({ message: databaseError.message });
    }
    if (databaseError?.code === "ECONNREFUSED") {
      logger.error("Database refused to connect", {
        name: databaseError.name,
        message: databaseError.message,
        code: databaseError.code,
      });
      return res.status(500).json({ message: databaseError.message });
    }
    logger.error("database error", {
      name: databaseError.name,
      message: databaseError.message,
      code: databaseError.code,
    });
    return res.status(500).json({ message: databaseError.message });
  }

  if (error instanceof HttpException) {
    logger.error(error.errorMessage, {
      name: error.name,
      status: error.status,
      code: error.message,
    });
    return res.status(error.status).json({ message: error.errorMessage });
  }

  const unknownError = new UnknownError(error);

  logger.error(unknownError.message, {
    name: unknownError.name,
    code: unknownError.message,
  });
  return res.status(500).json({ message: unknownError.message });
};
