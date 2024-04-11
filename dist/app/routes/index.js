"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
