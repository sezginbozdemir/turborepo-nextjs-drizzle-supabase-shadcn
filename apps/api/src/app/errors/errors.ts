import type { DrizzleQueryError } from "@repo/database/drizzle/drizzle.client";
import { DatabaseError as PostgresError } from "@repo/database/drizzle/drizzle.client";

export class DatabaseError extends Error {
  params?: string[];
  query?: string;
  code?: string;
  constructor(error: DrizzleQueryError) {
    super(error.message, { cause: error.cause });
    if (error.cause instanceof PostgresError)
      this.message = error.cause.message;
    if (error.cause && typeof (error.cause as any).code === "string") {
      this.code = (error.cause as any).code;
    }
    this.params = error.params;
    this.query = error.query;

    if (Error.captureStackTrace) Error.captureStackTrace(this, DatabaseError);
  }
}

export class HttpException extends Error {
  public status: number;
  public errorMessage: string;

  constructor(status: number, errorMessage: string) {
    super(errorMessage ?? "HttpException");
    this.name = "HttpException";
    this.status = status;
    this.errorMessage = errorMessage;
    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpException);
  }
}

export class UnknownError extends Error {
  constructor(error: unknown) {
    const defined = error instanceof Error;
    const msg = defined ? error.message : String(error);
    super(`Unknown Error: ${msg}`, {
      cause: defined ? error.cause : undefined,
    });
    this.name = "UnknownError";
    if (Error.captureStackTrace) Error.captureStackTrace(this, DatabaseError);
  }
}
