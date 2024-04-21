import express, { NextFunction, Request, Response } from "express";
import { DoctorControllers } from "./doctor.controller";

const router = express.Router();

router.patch("/:id", DoctorControllers.updateDoctorIntoDB);

export const DoctorRoutes = router;
