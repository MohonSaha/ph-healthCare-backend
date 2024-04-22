import express, { NextFunction, Request, Response } from "express";
import { DoctorControllers } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// task 3
router.get("/", DoctorControllers.getAllFromDB);

//task 4
router.get("/:id", DoctorControllers.getByIdFromDB);

router.patch("/:id", DoctorControllers.updateDoctorIntoDB);

//task 5
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorControllers.softDelete
);

export const DoctorRoutes = router;
