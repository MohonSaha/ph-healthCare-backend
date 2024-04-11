import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import { strict } from "assert";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  // check: if the user available
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // check: if the password correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  // Create access token

  const tokenData = { email: userData.email, role: userData.role };

  const accessToken = jwtHelpers.generateToken(
    tokenData,
    config.JWT_ACCESS_SECRET as Secret,
    config.JWT_ACCESS_TOKEN_EXPIRES_IN as string
  );

  // Create refresh token
  const refreshToken = jwtHelpers.generateToken(
    tokenData,
    config.JWT_REFRESH_SECRET as Secret,
    config.JWT_REFRESH_TOKEN_EXPIRES_IN as string
  );

  return {
    needPasswordChange: userData.needPasswordChange,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  // Decoded the refresh token and verity
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      refreshToken,
      config.JWT_REFRESH_SECRET as Secret
    );
  } catch (error) {
    throw new Error("You are not authorized!");
  }

  // Check if the user is available in database or not
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // if refresh token is verify and user is exist in database then create access token again
  const tokenData = { email: userData.email, role: userData.role };
  const accessToken = jwtHelpers.generateToken(
    tokenData,
    config.JWT_ACCESS_SECRET as Secret,
    config.JWT_ACCESS_TOKEN_EXPIRES_IN as string
  );

  return {
    needPasswordChange: userData.needPasswordChange,
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  // Check if the user is available in database
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // check: if the password correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  // hash the password
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  // update the new password
  await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password Changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  // Check if the user is available in database
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.JWT_RESET_PASSWORD_TOKEN as Secret,
    config.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN as string
  );

  const resetPasswordLink =
    config.RESET_PASSWORD_LINK +
    `?userId=${userData.id}&token=${resetPasswordToken}`;

  // Send the link to user through email
  await emailSender(
    userData.email,
    `<div>
        <p>Dear User,</P>
        <p>
          Your password reset link 
          <a href=${resetPasswordLink}>
            <button>
              Reset Password
            </button>
          </a>
        
        </P>
    </div>`
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // Check if the user is available in database
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  // Check if the token is valid or not
  const isTokenValid = jwtHelpers.verifyToken(
    token,
    config.JWT_RESET_PASSWORD_TOKEN as Secret
  );

  if (!isTokenValid) {
    throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN");
  }

  // Hash the password
  // update into database
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
