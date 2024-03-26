import express, { Request, Response } from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getSingleAdminData);

router.patch("/:id", AdminControllers.updateAdminData);

router.delete("/:id", AdminControllers.deleteAdminData);

export const AdminRoutes = router;
