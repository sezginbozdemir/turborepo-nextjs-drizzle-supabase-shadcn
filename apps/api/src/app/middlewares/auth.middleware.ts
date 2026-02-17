import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "#config/auth.config.js";
import { HttpException } from "#app/errors/errors.js";
import { SessionUser } from "#app/models/user.model.js";

function toAuthUser(session: any): SessionUser {
  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    email_verified: session.user.emailVerified,
  } satisfies SessionUser;
}
export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return next(new HttpException(401, "Unauthorized request"));
    }

    const user = toAuthUser(session);

    if (user.role !== "admin") {
      return next(new HttpException(403, "Forbidden: Admin access required"));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return next(new HttpException(401, "Unauthorized request"));
    }

    req.user = toAuthUser(session);
    return next();
  } catch (err) {
    return next(err);
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    req.user = session ? toAuthUser(session) : undefined;
    return next();
  } catch (err) {
    req.user = undefined;
    return next();
  }
}
