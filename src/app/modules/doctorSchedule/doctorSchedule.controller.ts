import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorSchesulesService } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorSchesulesService.insertIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dcotor schedule created successfully",
      data: result,
    });
  }
);

const getMySchedules = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;

    const result = await DoctorSchesulesService.getMySchedules(
      filters,
      options,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My schedule retrived successfully",
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorSchesulesService.deleteFromDB(
      user as IAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My schedule deleted successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedules,
  deleteFromDB,
};
