import express from "express";
import slugify from "slugify";
import { CategoryModel, Category } from "../models/CategoryModel";

const getCategories = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  res.send("cat");
};

const createCategory = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const name: string = req.body.name;
  const category: Category = {
    name,
    slug: slugify(name),
  };
  CategoryModel.create(category)
    .then((cat) => {
      res.status(201).json({ data: cat });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export default { getCategories, createCategory };
