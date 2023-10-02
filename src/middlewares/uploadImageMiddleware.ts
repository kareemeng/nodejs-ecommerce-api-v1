import { Request } from "express";
import multer from "multer";

import apiError from "../utils/apiError";

interface Field {
  name: string;
  maxCount: number;
}

const multerOptions = () => {
  //* memoryStorage engine gives you full control on storing files to memory. if image processing is required
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Not an image! Please upload only images.", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter }); //? multer will store the file in the uploads folder4
  return upload;
};

export const uploadSingleImage = (fieldName: string) =>
  multerOptions().single(fieldName); //? this will store the image in the req.file object

export const uploadMixedImage = (fields: Field[]) =>
  multerOptions().fields(fields); //? this will store the image in the req.file object

/**  diskStorage engine gives you full control on storing files to disk. if no image processing is required
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    // const id = uuidv4();
    const ext = file.mimetype.split("/")[1];
    const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;

    cb(null, fileName);
  },
}); */
