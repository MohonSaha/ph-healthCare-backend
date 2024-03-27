import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

const globalErrorHanlder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    seccess: false,
    message: err.name || "Something went wrong!",
    Error: err,
  });
};

export default globalErrorHanlder;
