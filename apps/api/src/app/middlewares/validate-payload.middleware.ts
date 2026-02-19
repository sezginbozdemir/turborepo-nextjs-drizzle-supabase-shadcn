import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { HttpException } from "#/app/errors/errors.js";

export function validatePayload<T extends z.ZodType>(schema: T) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new HttpException(400, "Validation error"));
    } else {
      req.validated = parsed.data as z.infer<T>;
      next();
    }
  };
}
