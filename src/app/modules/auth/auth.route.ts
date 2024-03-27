import express, { Request, Response, NextFunction } from "express";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post("/refreshToken", AuthControllers.refreshToken);

export const AuthRoutes = router;
