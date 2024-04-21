import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialitiesRoutes } from "../modules/specialities/specialities.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialities",
    route: SpecialitiesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
