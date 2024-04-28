import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHanlder from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();
app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// node cron for schedule
cron.schedule("* * * * *", () => {
  try {
    AppointmentService.calcelUnpaidAppointments();
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Ph health care server testing!");
});

app.use("/api/v1", router);

app.use(globalErrorHanlder);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
