"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHanlder = (err, req, res, next) => {
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        seccess: false,
        message: err.message || "Something went wrong!",
        Error: err,
    });
};
exports.default = globalErrorHanlder;
