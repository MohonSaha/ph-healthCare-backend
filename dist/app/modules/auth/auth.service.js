"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check: if the user available
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // check: if the password correct
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    // Create access token
    const tokenData = { email: userData.email, role: userData.role };
    const accessToken = jwtHelper_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
    // Create refresh token
    const refreshToken = jwtHelper_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_REFRESH_SECRET, config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN);
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Decoded the refresh token and verity
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelpers.verifyToken(refreshToken, config_1.default.JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new Error("You are not authorized!");
    }
    // Check if the user is available in database or not
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // if refresh token is verify and user is exist in database then create access token again
    const tokenData = { email: userData.email, role: userData.role };
    const accessToken = jwtHelper_1.jwtHelpers.generateToken(tokenData, config_1.default.JWT_ACCESS_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // check: if the password correct
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    // hash the password
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    // update the new password
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password Changed successfully",
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPasswordToken = jwtHelper_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.JWT_RESET_PASSWORD_TOKEN, config_1.default.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN);
    const resetPasswordLink = config_1.default.RESET_PASSWORD_LINK +
        `?userId=${userData.id}&token=${resetPasswordToken}`;
    // Send the link to user through email
    yield (0, emailSender_1.default)(userData.email, `<div>
        <p>Dear User,</P>
        <p>
          Your password reset link 
          <a href=${resetPasswordLink}>
            <button>
              Reset Password
            </button>
          </a>
        
        </P>
    </div>`);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is available in database
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // Check if the token is valid or not
    const isTokenValid = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.JWT_RESET_PASSWORD_TOKEN);
    if (!isTokenValid) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "FORBIDDEN");
    }
    // Hash the password
    // update into database
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
