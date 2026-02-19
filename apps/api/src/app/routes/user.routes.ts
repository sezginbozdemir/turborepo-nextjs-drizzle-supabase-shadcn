import { Router } from "express";
import * as UserController from "#/app/controllers/user.controller.js";
import { validatePayload } from "#/app/middlewares/validate-payload.middleware.js";
import { SignInUserModel, SignUpUserModel } from "#/app/models/user.model.js";

const UserRouter = Router();

UserRouter.post(
  "/auth/sign-up",
  validatePayload(SignUpUserModel),
  UserController.signUp,
);
UserRouter.post(
  "/auth/sign-in",
  validatePayload(SignInUserModel),
  UserController.signIn,
);
UserRouter.get("/users/:id", UserController.getUserById);
UserRouter.get("/users", UserController.getUserByEmail);
UserRouter.delete("/users/:id", UserController.deleteUserById);
UserRouter.delete("/users", UserController.deleteUserByEmail);

export default UserRouter;
