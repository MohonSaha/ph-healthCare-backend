import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

const globalErrorHanlder = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation error!";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      (message = "Duplicate key error"), (error = err.meta);
    }
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHanlder;
