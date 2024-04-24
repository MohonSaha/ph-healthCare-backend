import express from "express";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.insertIntoDB);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedules
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);

export const DoctorSchesulesRoutes = router;
