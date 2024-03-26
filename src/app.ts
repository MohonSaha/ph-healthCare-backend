import cors from "cors";
import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import { AdminRoutes } from "./app/modules/admin/admin.route";

const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Ph health care server testing!");
});

app.use("/api/v1", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);

export default app;
