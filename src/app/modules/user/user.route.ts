import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import { Secret } from "jsonwebtoken";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidations } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res);
  }
);

export const UserRoutes = router;
