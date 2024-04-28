import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

const patientPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PrescriptionService.patientPrescription(
      user as IAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription fetched successfully",
      data: result,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
  patientPrescription,
};
