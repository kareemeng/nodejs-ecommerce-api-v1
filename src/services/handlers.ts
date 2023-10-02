import express from "express";
import apiError from "../utils/apiError";
import slugify from "slugify";
import apiFeatures from "../utils/apiFeatures";
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const deleteOne =
  (Model: any) =>
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
    res.status(204).json({ result: `${Document.slug}: successfully deleted` });
  };
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const updateOne =
  (Model: any) =>
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
  };
/**
 * @param Model mongoose model ex: ProductModel
 * @returns
 */
export const createOne =
  (Model: any) =>
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
  };
/**
 *
 * @param Model mongoose model ex: ProductModel
 * @param populateOption mongoose populate option ex: {path: "category", select: "name "}
 * @returns
 */
export const getOne =
  (Model: any) =>
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
  };
/**
 * @param Model mongoose model ex: ProductModel
 * @param modelName model name for search in the model in case of different schema ex: name, title
 * @param populateOption mongoose populate option ex: {path: "category", select: "name "}
 * @param additionalFilter option for nested routes
 * @returns
 */
export const getAll =
  (Model: any, modelName: string = "") =>
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
  };

export default {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
