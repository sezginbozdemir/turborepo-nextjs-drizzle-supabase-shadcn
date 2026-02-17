import { Router } from "express";
import * as UserController from "#app/controllers/user.controller.js";
import { validatePayload } from "#app/middlewares/validate-payload.middleware.js";
import { CreateUserModel } from "#app/models/user.model.js";

const UserRouter = Router();

UserRouter.post(
  "/sign-up",
  validatePayload(CreateUserModel),
  UserController.signUp,
);

export default UserRouter;
