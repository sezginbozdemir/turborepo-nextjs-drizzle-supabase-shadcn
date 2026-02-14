import { createLogger } from "@repo/shared/logger";
import { Request, Response, NextFunction } from "express";

const logger = createLogger("http response");

export function responseLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = new Date();
  const method = req.method;
  const url = req.url;
  let finished = false;

  res.on("finish", () => {
    finished = true;
    const responseTime = new Date().getTime() - start.getTime();
    const status = res.statusCode;
    const log = `${status ? status : ""} ${method} : ${url} in ${responseTime}ms`;
    logger.info(log);
  });

  res.on("close", () => {
    if (finished) return;
    const responseTime = new Date().getTime() - start.getTime();
    const log = ` Aborted ${method} : ${url} in ${responseTime}ms`;

    logger.warn(log);
  });
  next();
}
