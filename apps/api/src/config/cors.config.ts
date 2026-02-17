import { env } from "./env.config";
import type { CorsOptions } from "cors";

const IS_DEV = env.NODE_ENV === "development" || env.NODE_ENV === "test";
const CORS_ORIGINS = [env.NEXT_PUBLIC_WEB_URL];

const corsOrigin: CorsOptions["origin"] = (origin, callback) => {
  if (IS_DEV) return callback(null, true);
  if (!origin) return callback(new Error("Cors: origin header required"));
  if (CORS_ORIGINS.includes(origin)) return callback(null, true);

  return callback(new Error(`Cors: origin not allowed: ${origin}`));
};

export const CORS_OPTIONS: CorsOptions = {
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
