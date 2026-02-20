import { Response, Request, NextFunction } from "express";
import { env } from "#/config/env.config";
import { HttpException } from "../errors/errors";

export const csrfMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (env.NODE_ENV !== "production") return next();

  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const origin = req.headers.origin;

  const host = req.headers.host;

  // NOTE: If behind a reverse proxy/CDN, you may need to use `X-Forwarded-Host`
  // (and possibly `X-Forwarded-Proto`) instead of `Host`.

  if (!origin || !host) {
    return next(new HttpException(403, "no host or origin"));
  }

  try {
    const url: URL = new URL(origin);

    if (url.host !== host) {
      return next(new HttpException(403, "origin missmatch"));
    }
  } catch {
    return next(new HttpException(403, "invalid origin"));
  }

  next();
};
