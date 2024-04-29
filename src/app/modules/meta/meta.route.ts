import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  MetaController.fetchDashboardMetaData
);

export const MetaRoutes = router;
