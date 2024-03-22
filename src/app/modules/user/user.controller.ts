import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const result = await UserServices.createAdminIntoDB();
  res.send(result);
};

export const UserControllers = {
  createAdmin,
};
