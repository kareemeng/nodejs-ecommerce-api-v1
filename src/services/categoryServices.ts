import express from "express";
import slugify from "slugify";
import { CategoryModel, Category } from "../models/CategoryModel";

/**
 *  Get List of All categories
 * @route GET /api/v1/categories
 * @access public
 */
export const getCategories = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  try {
    if (isNaN(+page) || isNaN(+limit)) {
      res.status(400).send(`the page:${page} with limit:${limit} not found`);
    } else {
      const skip = (+page - 1) * +limit;
      const categories = await CategoryModel.find({}).skip(skip).limit(+limit);
      res
        .status(200)
        .json({ results: categories.length, page, data: categories });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
/**
 * Get specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
export const getCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const id = req.params.id;
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      res.status(404).json({ msg: `no category found for id:${id}` });
    } else {
      res.status(200).json({ data: category });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
/**
 * Create New Category
 * @route POST /api/v1/categories
 * @access private
 */
export const createCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const name: string = req.body.name;
  const category: Category = {
    name,
    slug: slugify(name),
  };
  try {
    const cat = await CategoryModel.create(category);
    res.status(201).json({ data: cat });
  } catch (err) {
    res.status(400).send(err);
  }
};
/**
 * Update Specific Category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
export const updateCategory = async (
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
  try {
    const newCategory = await CategoryModel.findOneAndUpdate(
      { _id: id },
      category,
      {
        new: true,
      }
    );
    if (!newCategory) {
      res.status(404).json({ msg: `no category found for id:${id}` });
    } else {
      res.status(200).json({ data: newCategory });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
/**
 * Delete Specific Category
 * @route DELETE /api/v1/categories/:id
 * @access privet
 */
export const deleteCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const id = req.params.id;
  try {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      res.status(404).json({ msg: `no category found for id:${id}` });
    } else {
      res.status(204).send(`${category.slug} has been successfully deleted`);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
