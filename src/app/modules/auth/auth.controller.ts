import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  // Set refresh token to the cookie
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false, // TODO: Change it true in production
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully!",
    data: {
      needPasswordChange: result.needPasswordChange,
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
};
