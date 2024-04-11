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
exports.AdminControllers = void 0;
const admin_service_1 = require("./admin.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const admin_constant_1 = require("./admin.constant");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFilds);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield admin_service_1.AdminServices.getAllAdmins(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admins retrieve successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleAdminData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.getSingleDataFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin retrieve successfully!",
        data: result,
    });
}));
const updateAdminData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.updateAdminDataFromDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data updated successfully!",
        data: result,
    });
}));
const deleteAdminData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.deleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data deleted successfully!",
        data: result,
    });
}));
const softDeleteAdminData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.softDeleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data soft delete successfully!",
        data: result,
    });
}));
exports.AdminControllers = {
    getAllAdmins,
    getSingleAdminData,
    updateAdminData,
    deleteAdminData,
    softDeleteAdminData,
};
