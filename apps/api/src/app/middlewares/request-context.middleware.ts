import { requestContext } from "#app/context/request.context.js";
import { auth } from "#app/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export async function requestContextMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const reqId = randomUUID();
  req.id = reqId;
  res.setHeader("X-Request-ID", reqId);

  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const user = session
      ? {
          id: session.user.id,
          name: session.user.name,
          email_address: session.user.email,
          is_email_address_verified: session.user.emailVerified,
        }
      : undefined;

    const context = {
      reqId,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      user,
      session,
    };

    return requestContext.run(context, next);
  } catch (err) {
    return next(err);
  }
}
