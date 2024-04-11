"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    ENV: process.env.node_env,
    PORT: process.env.PORT,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_RESET_PASSWORD_TOKEN: process.env.JWT_RESET_PASSWORD_TOKEN,
    JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
    RESET_PASSWORD_LINK: process.env.RESET_PASSWORD_LINK,
    emailSender: {
        EMAIL: process.env.EMAIL,
        EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    },
};
