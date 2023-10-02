import express from "express";
import slugify from "slugify";
import { SubCategoryModel, SubCategory } from "../models/SubCategoryModel";
import { CategoryModel, Category } from "../models/CategoryModel";
import asyncHandler from "express-async-handler";
import apiError from "../utils/apiError";

/**  Get List of All SubCategories or SubCategories of a specific MainCategory
 * @route GET /api/v1/subcategories
 * @nestedRoute GET /api/v1/categories/:mainCategory/subcategories
 * @access public
 */
export const getSubCategories = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    /**
     * //let filter = {};
     * //if (req.params.mainCategory)
     * //filter = { mainCategory: req.params.mainCategory };
     **/

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    if (isNaN(+page) || isNaN(+limit)) {
      return next(
        new apiError(`the page:${page} with limit:${limit} not found`, 500)
      );
    } else {
      //+ to cast to a number if possible
      const skip = (+page - 1) * +limit;
      //! populate make another query to get the data of the mainCategory from the CategoryModel use populate only if you need the data of the mainCategory
      const subCategories = await SubCategoryModel.find(req.body.filter)
        .skip(skip)
        .limit(+limit);
      //? .populate({ path: "mainCategory", select: "name -_id" }); //not needed here because we only need the id of the mainCategory

      res
        .status(200)
        .json({ results: subCategories.length, page, data: subCategories });
    }
  }
);
/** Get specific SubCategory
 * @route GET /api/v1/subcategories/:id
 * @access public
 */
export const getSubCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    //!use populate only if you need the data of the mainCategory
    const subcategory = await SubCategoryModel.findById(id);
    //? .populate({path: "mainCategory",select: "name -_id", });//not needed here because we only need the id of the mainCategory
    if (!subcategory) {
      return next(new apiError(`no subcategory found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: subcategory });
    }
  }
);
/** Create New SubCategory
 * @route POST /api/v1/subcategories
 * @nestedRoute post /api/v1/categories/:mainCategory/subcategories
 * @access private
 */
export const createSubCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    // if (!req.body.mainCategory) req.body.mainCategory = req.params.mainCategory; //*not needed here because we use the middleware setMainCategoryIdToBody
    const { name, mainCategory } = req.body;
    const subcategory: SubCategory = {
      name,
      slug: slugify(name),
      mainCategory,
    };
    const sub = await SubCategoryModel.create(subcategory);
    res.status(201).json({ data: sub });
  }
);
/** Update Specific SubCategory
 * @route PUT /api/v1/subcategories/:id
 * @access private
 */
export const updateSubCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const { name, mainCategory } = req.body;
    const subcategory: SubCategory = {
      name,
      slug: slugify(name),
      mainCategory,
    };
    if (mainCategory) {
      console.log("mainCategory");
      const category = await CategoryModel.findById(mainCategory);
      if (!category) {
        return next(
          new apiError(`no category found for id:${mainCategory}`, 404)
        );
      }
    }
    const newSubCategory = await SubCategoryModel.findOneAndUpdate(
      { _id: id },
      subcategory,
      {
        new: true,
      }
    );
    if (!newSubCategory) {
      return next(new apiError(`no SubCategory found for id:${id}`, 404));
    } else {
      res.status(200).json({ data: newSubCategory });
    }
  }
);
/** Delete Specific SubCategory
 * @route DELETE /api/v1/subcategories/:id
 * @access privet
 */
export const deleteSubCategory = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findByIdAndDelete(id);
    if (!subcategory) {
      return next(new apiError(`no SubCategory found for id:${id}`, 404));
    } else {
      res.status(204).send(`${subcategory.slug} has been successfully deleted`);
    }
  }
);

export default {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
