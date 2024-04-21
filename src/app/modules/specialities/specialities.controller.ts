import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { SpecialitiesServices } from "./specialities.service";

const createSpecialitiesIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SpecialitiesServices.createSpecialitiesIntoDB(req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialities created successfully",
      data: result,
    });
  }
);

export const SpecialitiesControllers = {
  createSpecialitiesIntoDB,
};
