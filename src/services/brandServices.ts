import express from "express";
import slugify from "slugify";
import { BrandModel, Brand } from "../models/BrandModel";
import asyncHandler from "express-async-handler";
import apiError from "../utils/apiError";
/**  Get List of All Brands
 * @route GET /api/v1/brands
 * @access public
 */
export const getBrands = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    if (isNaN(+page) || isNaN(+limit)) {
      return next(
        new apiError(`the page:${page} with limit:${limit} not found`, 500)
      );
    } else {
      //+ to cast to a number if possible
      const skip = (+page - 1) * +limit;
      const brands = await BrandModel.find({}).skip(skip).limit(+limit);
      res.status(200).json({ results: brands.length, page, data: brands });
    }
  }
);
/** Get specific Brand
 * @route GET /api/v1/brands/:id
 * @access public
 */
export const getBrand = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);
    if (!brand) {
      return next(new apiError(`no Brand found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: brand });
    }
  }
);
/** Create New Brand
 * @route POST /api/v1/brands
 * @access private
 */
export const createBrand = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { name } = req.body;
    const brand: Brand = {
      name,
      slug: slugify(name),
    };
    const createdBrand = await BrandModel.create(brand);
    res.status(201).json({ data: createdBrand });
  }
);
/** Update Specific brands
 * @route PUT /api/v1/brands/:id
 * @access private
 */
export const updateBrand = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    const brand: Brand = {
      name,
      slug: slugify(name),
    };
    const newBrand = await BrandModel.findOneAndUpdate({ _id: id }, brand, {
      new: true,
    });
    if (!newBrand) {
      return next(new apiError(`no Brand found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: newBrand });
    }
  }
);
/** Delete Specific Brand
 * @route DELETE /api/v1/brands/:id
 * @access privet
 */
export const deleteBrand = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const brand = await BrandModel.findByIdAndDelete(id);
    if (!brand) {
      return next(new apiError(`no Brand found for id:${id}`, 404));
    } else {
      res.status(204).send(`${brand.slug} has been successfully deleted`);
    }
  }
);

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
