import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.insertIntoDB);

export const ReviewRoutes = router;
