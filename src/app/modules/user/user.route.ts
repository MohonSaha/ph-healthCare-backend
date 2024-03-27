import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.createAdmin
);

export const UserRoutes = router;
