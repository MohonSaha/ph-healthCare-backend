import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.createAdminIntoDB(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

export const UserControllers = {
  createAdmin,
};
