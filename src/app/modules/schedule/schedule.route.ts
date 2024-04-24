import express from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), ScheduleControllers.getAllFromDB);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleControllers.insertIntoDB
);

export const SchesulesRoutes = router;
