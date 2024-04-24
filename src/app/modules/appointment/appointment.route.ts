import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { AppointmentController } from "./appointment.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
