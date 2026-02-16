import "express-serve-static-core";
import { AuthUser } from "#app/models/user.model.ts";

declare module "express-serve-static-core" {
  interface Request {
    validated?: unknown;
    id?: string;
    user?: AuthUser;
  }
}
