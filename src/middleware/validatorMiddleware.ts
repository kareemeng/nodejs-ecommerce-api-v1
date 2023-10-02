import express from "express";
import { validationResult } from "express-validator";
/** find validation errors and wrap them in object
 * @param req
 * @param res
 * @param next
 * @returns response with errors if exists
 */
export const validatorMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
