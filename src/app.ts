import cors from "cors";
import express, { Application, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";

const app: Application = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Ph health care server testing!");
});

app.use("/api/v1", UserRoutes);

export default app;