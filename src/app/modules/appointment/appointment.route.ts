import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { AppointmentController } from "./appointment.controller";

const router = express.Router();

router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);

router.patch(
  "/status/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  AppointmentController.changeAppointmentStatus
);

export const AppointmentRoutes = router;
