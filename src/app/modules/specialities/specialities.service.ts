import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createSpecialitiesIntoDB = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialities.create({
    data: req.body,
  });

  return result;
};

export const SpecialitiesServices = {
  createSpecialitiesIntoDB,
};
