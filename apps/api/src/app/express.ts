import { CORS_OPTIONS } from "#/config/cors.config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import { createServer as createHttpServer } from "http";
import { responseLogger } from "./middlewares/response-logger.middleware.js";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../config/auth.config.js";
import UserRouter from "./routes/user.routes.js";
import * as Sentry from "@sentry/node";
import { csrfMiddleware } from "./middlewares/csrf.middleware.js";

export function createServer() {
  const app = express();
  app.use(requestLogger);
  app.use(responseLogger);
  app.use(cors(CORS_OPTIONS));
  app.use(helmet());
  app.use(hpp());
  app.use(compression());
  app.use(csrfMiddleware);
  app.all("/api/auth", toNodeHandler(auth));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());
  app.set("json spaces", 0);

  // Health check
  app.use("/ping", (_, res) => {
    res.status(200).json({ message: "OK" });
  });
  app.use("/api", UserRouter);
  Sentry.setupExpressErrorHandler(app);
  app.get("/debug-sentry", function mainHandler(_req, _res) {
    throw new Error("My first Sentry error!");
  });
  app.use(errorHandler);

  const server = createHttpServer(app);

  return { app, server };
}
