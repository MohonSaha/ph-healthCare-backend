import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

export const PrescriptionRoutes = router;
