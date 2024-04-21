import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SpecialitiesRoutes } from "../modules/specialities/specialities.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },

  {
    path: "/specialities",
    route: SpecialitiesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
