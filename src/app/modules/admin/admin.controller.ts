import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFilds } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFilds);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllAdmins(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins retrieve successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdminData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleDataFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieve successfully!",
    data: result,
  });
});

const updateAdminData: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateAdminDataFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data updated successfully!",
    data: result,
  });
});

const deleteAdminData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.deleteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data deleted successfully!",
    data: result,
  });
});

const softDeleteAdminData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.softDeleteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data soft delete successfully!",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdminData,
  updateAdminData,
  deleteAdminData,
  softDeleteAdminData,
};
