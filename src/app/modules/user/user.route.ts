import express, { Request, Response } from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post("/user", UserControllers.createAdmin);

export const UserRoutes = router;
