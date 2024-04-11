import express, { Request, Response, NextFunction } from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post("/refreshToken", AuthControllers.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthControllers.changePassword
);

router.post("/forgot-password", AuthControllers.forgotPassword);

router.post("/reset-password", AuthControllers.forgotPassword);

export const AuthRoutes = router;
