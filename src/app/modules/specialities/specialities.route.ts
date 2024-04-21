import express, { NextFunction, Request, Response } from "express";
import { SpecialitiesControllers } from "./specialities.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialitiesValidations } from "./specialities.validation";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialitiesValidations.createSpecialities.parse(
      JSON.parse(req.body.data)
    );
    return SpecialitiesControllers.createSpecialitiesIntoDB(req, res, next);
  }
);

export const SpecialitiesRoutes = router;
