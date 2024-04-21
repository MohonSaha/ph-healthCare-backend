import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { DoctorServices } from "./doctor.service";

const updateDoctorIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.updateDoctorIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dcotor data successfully",
    data: result,
  });
});

export const DoctorControllers = {
  updateDoctorIntoDB,
};
