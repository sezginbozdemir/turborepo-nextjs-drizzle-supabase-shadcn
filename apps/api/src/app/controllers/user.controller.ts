import type { Request, Response } from "express";
import { createLogger } from "@repo/shared/logger";
import { CreateUser } from "#app/models/user.model.js";
import { userService } from "#app/services/user.service.js";

const logger = createLogger("user controller express");

export const signUp = async (req: Request, res: Response) => {
  logger.info("User sign up...");
  const validatedUser = req.validated as CreateUser;
  const user = await userService.signUp(validatedUser);
  return res.status(201).json(user);
};
