import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Cloudinary
cloudinary.config({
  cloud_name: "dj6v9llcg",
  api_key: "531756144181732",
  api_secret: "ct6JkfWunAqb-Oz2FHgTAuhMCW4",
});

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  // Create a promise: kind of try catch
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
