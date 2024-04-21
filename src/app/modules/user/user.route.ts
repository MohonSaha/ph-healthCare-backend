import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidations } from "./user.validation";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctor.parse(JSON.parse(req.body.data));
    return UserControllers.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createPatient.parse(JSON.parse(req.body.data));
    return UserControllers.createPatient(req, res, next);
  }
);

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllUsers
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidations.updateStatus),
  UserControllers.changeProfileStatus
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserControllers.getMyProfile
);

router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.updateMyProfile(req, res, next);
  }
);

export const UserRoutes = router;
