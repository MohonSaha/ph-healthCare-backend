import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import { AdminRoutes } from "./app/modules/admin/admin.route";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHanlder from "./app/middlewares/globalErrorHandler";

const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
