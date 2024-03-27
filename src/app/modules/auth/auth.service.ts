import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import { UserStatus } from "@prisma/client";
import config from "../../../config";

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

export const AuthServices = {
  loginUser,
  refreshToken,
};
