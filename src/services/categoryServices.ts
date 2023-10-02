import express from "express";
import slugify from "slugify";
import { CategoryModel, Category } from "../models/CategoryModel";
import asyncHandler from "express-async-handler";
import apiError from "../utils/apiError";
/**
 *  Get List of All categories
 * @route GET /api/v1/categories
 * @access public
 */
export const getCategories = asyncHandler(
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
      const categories = await CategoryModel.find({}).skip(skip).limit(+limit);
      res
        .status(200)
        .json({ results: categories.length, page, data: categories });
    }
  }
);
/**
 * Get specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
export const getCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return next(new apiError(`no category found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: category });
    }
  }
);
/**
 * Create New Category
 * @route POST /api/v1/categories
 * @access private
 */
export const createCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const name: string = req.body.name;
    const category: Category = {
      name,
      slug: slugify(name),
    };
    const cat = await CategoryModel.create(category);
    res.status(201).json({ data: cat });
  }
);
/**
 * Update Specific Category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
export const updateCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const id = req.params.id;
    const name: string = req.body.name;
    const category: Category = {
      name,
      slug: slugify(name),
    };
    const newCategory = await CategoryModel.findOneAndUpdate(
      { _id: id },
      category,
      {
        new: true,
      }
    );
    if (!newCategory) {
      return next(new apiError(`no category found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: newCategory });
    }
  }
);
/**
 * Delete Specific Category
 * @route DELETE /api/v1/categories/:id
 * @access privet
 */
export const deleteCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const id = req.params.id;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return next(new apiError(`no category found for id:${id}`, 404));
    } else {
      res.status(204).send(`${category.slug} has been successfully deleted`);
    }
  }
);

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
