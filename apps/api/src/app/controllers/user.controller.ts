import type { Request, Response } from "express";
import { createLogger } from "@repo/shared/logger";
import { SignUpUser, SignInUser } from "#/app/models/user.model.js";
import { userService } from "#/app/services/user.service.js";
import { HttpException } from "#/app/errors/errors.js";

const logger = createLogger("user controller express");

export const signUp = async (req: Request, res: Response) => {
  logger.info("User sign up...");
  const validated = req.validated as SignUpUser;
  const user = await userService.signUp(validated);
  return res.status(201).json(user);
};

export const signIn = async (req: Request, res: Response) => {
  logger.info("User sign in...");
  const validated = req.validated as SignInUser;
  const user = await userService.signIn(validated);
  return res.status(201).json(user);
};
export const getUserById = async (req: Request, res: Response) => {
  logger.info("Retrieving user by id...");
  const id = typeof req.params.id === "string" ? req.params.id : "";
  if (!id) throw new HttpException(400, "id is required");
  const user = await userService.getUserById(id);
  if (!user) throw new HttpException(404, "user not found");

  return res.status(200).json(user);
};

export const getUserByEmail = async (req: Request, res: Response) => {
  logger.info("Retrieving user by email...");
  const email = typeof req.query.email === "string" ? req.query.email : "";
  if (!email) throw new HttpException(400, "email is required");
  const user = await userService.getUserByEmail(email);
  if (!user) throw new HttpException(404, "user not found");

  return res.status(200).json(user);
};
export const deleteUserById = async (req: Request, res: Response) => {
  logger.info("Deleting user by id...");
  const id = typeof req.params.id === "string" ? req.params.id : "";
  if (!id) throw new HttpException(400, "id is required");
  const user = await userService.deleteUserById(id);
  if (!user) throw new HttpException(404, "user not found");

  return res.status(200).json(user);
};

export const deleteUserByEmail = async (req: Request, res: Response) => {
  logger.info("Deleting user by email...");
  const email = typeof req.query.email === "string" ? req.query.email : "";
  if (!email) throw new HttpException(400, "email is required");
  const user = await userService.deleteUserByEmail(email);
  if (!user) throw new HttpException(404, "user not found");

  return res.status(200).json(user);
};
