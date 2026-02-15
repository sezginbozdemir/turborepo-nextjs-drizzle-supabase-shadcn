import { requestContext } from "#app/context/request.context.js";
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export function requestContextMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const context = {
    reqId: randomUUID(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  };

  req.id = context.reqId;
  res.setHeader("X-Request-ID", context.reqId);
  requestContext.run(context, next);
}
