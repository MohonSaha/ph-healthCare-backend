import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      // retrive the token from headers
      const token = req.headers.authorization;

      // If there is no token available
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      // Check if the token is verified
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.JWT_ACCESS_SECRET as Secret
      );

      // set verified user data to the request
      req.user = verifiedUser;

      // If there is any role available and that roles are matched with token role
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
