import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFilds } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFilds);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await AdminServices.getAllAdmins(filters, options);

    res.status(200).json({
      success: true,
      message: "Admins retrieve successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

const getSingleAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.getSingleDataFromDB(id);

    res.status(200).json({
      success: true,
      message: "Admin retrieve successfully!",
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

const updateAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.updateAdminDataFromDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Admin data updated successfully!",
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

const deleteAdminData = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteFromDB(id);

    res.status(200).json({
      success: true,
      message: "Admin data deleted successfully!",
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

export const AdminControllers = {
  getAllAdmins,
  getSingleAdminData,
  updateAdminData,
  deleteAdminData,
};
