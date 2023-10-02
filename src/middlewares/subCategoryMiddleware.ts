import { Request, Response, NextFunction } from "express";
//*nested route to create subCategory for a specific mainCategory
export const setMainCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.mainCategory) {
    req.body.mainCategory = req.params.mainCategory;
  }
  next();
};
export const setFilter = (req: Request, res: Response, next: NextFunction) => {
  let filter = {};
  if (req.params.mainCategory)
    filter = { mainCategory: req.params.mainCategory };
  req.body.filter = filter;
  next();
};

export const removeDuplicateSubCategories = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.subcategories) {
    const set = new Set(req.body.subcategories);
    req.body.subcategories = Array.from(set);
    // console.log(req.body.subcategories);
  }
  next();
};
