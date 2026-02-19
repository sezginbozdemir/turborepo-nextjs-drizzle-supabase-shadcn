import "express-serve-static-core";
import { SessionUser } from "#/app/models/user.model.ts";

declare module "express-serve-static-core" {
  interface Request {
    validated?: unknown;
    id?: string;
    user?: SessionUser;
  }
}
