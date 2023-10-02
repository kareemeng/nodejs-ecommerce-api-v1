import fs from "fs";
import express from "express";
import slugify from "slugify";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import apiError from "../utils/apiError";
import apiFeatures from "../utils/apiFeatures";

export const resizeImage = (
  width: number = 500,
  hight: number = 500,
  ext: keyof typeof sharp.format = "jpeg",
  servicesName: string
) =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (fs.existsSync(`uploads/${servicesName}`) === false) {
        fs.mkdirSync(`uploads/${servicesName}`);
      }
      if (!req.file && !req.files) {
        return next();
      } else if (req.file) {
        //if the request contain one file
        const fileName = `${servicesName}-${uuidv4()}-${Date.now()}.${ext}`;
        await sharp(req.file.buffer)
          .resize(width, hight, { fit: "contain" })
          .toFormat(ext)
          .jpeg({ quality: 90 })
          .toFile(`uploads/${servicesName}/${fileName}`);
        //pass the filename in the req.body to be stored in the database
        req.body.image = fileName;
        next();
      } else if (req.files) {
        // if the request contain multiple files or mixed files
        const files: any = req.files;
        const images: any[] = [];
        //loop through the files and resize them (cover, images,....)
        // files => {cover: [file], images: [file, file, file],.....}
        Object.keys(files).forEach((key: string) => {
          // files[key] => [file, file, file] => loop through the array
          files[key].map(async (file: any, index: number) => {
            const field = file.fieldname;
            const fileName = `${servicesName}-${uuidv4()}-${Date.now()}-${field}-${
              index + 1
            }.${ext}`;
            //push the file name in the images array to be stored in the database
            //! need to be before (await) as await will block the loop
            images.push({ field, fileName });
            //resize the file and save it in the uploads folder with a unique name
            await sharp(file.buffer)
              .resize(width, hight, { fit: "contain" })
              .toFormat(ext)
              .jpeg({ quality: 90 })
              .toFile(`uploads/${servicesName}/${fileName}`);
          });
        });
        // gather the images withe the field name in one array
        const result = images.reduce((acc, obj) => {
          const key = obj.field;
          const value = obj.fileName;

          //? if the key is unique we will enter the first if statement and create the key with the value
          //? if the key is not unique we will create an array and push the value in it in second if statement and else statement
          if (!acc[key]) {
            //if the key not exist in the acc object create it
            acc[key] = value;
          } else if (Array.isArray(acc[key])) {
            //if the key is an array push the value in it (not unique key)
            acc[key].push(value);
          } else {
            //if the key is not an array convert it to array and push the value in it (not unique key)
            acc[key] = [acc[key], value];
          }

          return acc;
        }, {});

        console.log(result);
        //pass the result in the req.body to be stored in the database
        req.body = { ...req.body, ...result };
        // console.log(req.body);

        next();
      }
      //TODo: delete the old image from the uploads folder
    }
  );
export const resizeProductImages = () =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      const files = req.files;

      if (!files || !("images" in files) || !("cover" in files)) {
        return next();
      }
      if (fs.existsSync(`uploads/products`) === false) {
        fs.mkdirSync(`uploads/products`);
      }

      // 1) Cover image
      const coverFiles = Array.isArray(files.cover)
        ? files.cover
        : [files.cover];
      req.body.cover = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(coverFiles[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${req.body.cover}`);

      // 2) Images
      req.body.images = [];
      const imageFiles = Array.isArray(files.images)
        ? files.images
        : [files.images];
      await Promise.all(
        imageFiles.map(async (file: Express.Multer.File, i: number) => {
          const filename = `products-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
          await sharp(file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${filename}`);
          req.body.images.push(filename);
        })
      );

      next();
    }
  );
/**
 * @param Model mongoose model ex: ProductModel
 * @param modelName model name for search in the model in case of different schema ex: name, title
 * @param populateOption mongoose populate option ex: {path: "category", select: "name "}
 * @param additionalFilter option for nested routes
 * @returns
 */
export const getAll = (Model: any, modelName: string = "") =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      //grab additional filter from req.body if exist
      let additionalFilter = {};
      req.body.filter
        ? (additionalFilter = req.body.filter)
        : (additionalFilter = {});
      //build query
      const documentsCount = await Model.countDocuments();
      const documentsFeatures = new apiFeatures(
        Model.find(additionalFilter),
        req.query
      )
        .filter()
        .paginate(documentsCount)
        .sort()
        .limitFields()
        .search(modelName);
      const { mongooseQuery, pagination } = documentsFeatures;
      //execute query
      const document = await mongooseQuery;
      //send response
      res.status(200).json({
        results: document.length,
        pagination,
        data: document,
      });
    }
  );
/**
 * @param Model mongoose model ex: ProductModel
 * @param populateOption mongoose populate option ex: {path: "category", select: "name "}
 * @returns
 */
export const getOne = (Model: any) =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      //! populate make another query to get the data of the mainCategory from the CategoryModel use populate only if you need the data of the mainCategory
      const { id } = req.params;
      const Document = await Model.findById(id);
      if (!Document) {
        return next(new apiError(`no Document found for id:${id}`, 404));
      } else {
        res.status(200).json({ data: Document });
      }
    }
  );
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const createOne = (Model: any) =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      //add slug to req.body if name or title is present
      req.body.slug = req.body.name
        ? slugify(req.body.name)
        : slugify(req.body.title);
      const Document = await Model.create(req.body);
      res.status(201).json({ data: Document });
    }
  );
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const updateOne = (Model: any) =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      //add slug to req.body if name or title is present
      req.body.slug = req.body.name
        ? slugify(req.body.name)
        : req.body.title
        ? slugify(req.body.title)
        : undefined;
      const newDocument = await Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!newDocument) {
        return next(new apiError(`no Product found for id:${id}`, 404));
      } else {
        res.status(200).json({ data: newDocument });
      }
    }
  );
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const deleteOne = (Model: any) =>
  asyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const Document = await Model.findByIdAndDelete(id);
      if (!Document) {
        return next(new apiError(`no Document found for id:${id}`, 404));
      }
      res
        .status(204)
        .json({ result: `${Document.slug}: successfully deleted` });
    }
  );
export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  resizeImage,
  resizeProductImages,
};
