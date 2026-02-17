import {
  DatabaseError,
  HttpException,
  UnknownError,
} from "#app/errors/errors.js";
import { DrizzleQueryError } from "@repo/database/drizzle/drizzle.client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { createLogger } from "@repo/shared/logger";
import {
  APIError,
  ZodError as AuthZodError,
  BetterAuthError,
  BetterCallError,
} from "better-auth";
import { ZodError } from "zod/v3";
import z from "zod/v3";

const logger = createLogger("express error handler");
function isZodError(err: unknown): err is z.ZodError {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as any).name === "ZodError" &&
    Array.isArray((err as any).issues)
  );
}

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

  if (isZodError(error)) {
    error = new HttpException(422, "Zod Validation Error");
  }

  if (error instanceof APIError) {
    logger.error(error.message, { err: error });
    return res.status(Number(error.status)).json({ message: error.message });
  }
  if (error instanceof BetterAuthError) {
    logger.error(error.message, { err: error });
    return res.status(500).json({ message: error.message });
  }
  if (error instanceof BetterCallError) {
    logger.error(error.message, { err: error });
    return res.status(Number(500)).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    error = new HttpException(422, "Unprocessable Entity");
    logger.error(error.message, { err: error });
    return res.status(error.status).json({ message: error.message });
  }

  if (error instanceof AuthZodError) {
    error = new HttpException(422, "Unprocessable Entity");
    logger.error(error.message, { err: error });
    return res.status(error.status).json({ message: error.message });
  }

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
