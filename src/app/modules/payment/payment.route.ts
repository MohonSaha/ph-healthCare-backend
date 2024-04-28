import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post("/init-payment/:appointmentId", paymentController.initPayment);

router.get("/ipn", paymentController.validatePayment);

export const PaymentRoutes = router;
