import express from "express";
import apiError from "../utils/apiError";

/**
 * global error handler (to handle errors caught by express)
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const globalErrorHandler = (
  err: apiError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.operational = err.operational || true;
  if (process.env.NODE_ENV === "development") {
    developmentError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    productionError(err, req, res);
  }
};
//more detailed error handler for development
const developmentError = (
  err: apiError,
  req: express.Request,
  res: express.Response
): express.Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
//less detailed error handler for production
const productionError = (
  err: apiError,
  req: express.Request,
  res: express.Response
): express.Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
