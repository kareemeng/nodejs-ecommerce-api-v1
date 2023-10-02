import path from "path";

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

//Routes
import categoryRouter from "./routes/categoryRoute";
import subCategoryRouter from "./routes/subcategoryRoute";
import brandRoute from "./routes/brandRoute";
import productRoute from "./routes/productRoute";
//DB configuration
import { db_connection } from "./config/database";
// custom error class to handle API errors
import apiError from "./utils/apiError";
// globalErrorHandler takes APIError instance and returns error in json format
import { globalErrorHandler } from "./middleware/errorMiddleware";

const app = express();
dotenv.config();

app.use(express.json()); //parsing middleware
app.use(express.static(path.join(__dirname, "../uploads"))); //static files middleware (images

// decide whether to use logger or not depending on node environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //logger middleware
  console.log(`mode: ${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
  console.log(`no logs for: ${process.env.NODE_ENV}`);
}

db_connection(); //connect to database

//Mount Routs
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

//*sending unknown routes error message to error handler
app.all(
  "*",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new Error(`Can't Find This Route: ${req.originalUrl}`);
    next(new apiError(err.message, 404));
  }
);

//*Global Error handler middleware for express
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listening on ${port}`);
});

//* handling any Rejection outside express (any uncaught exceptions)
// Event => listen => callback(err)
process.on("unhandledRejection", (err: Error) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  //*close the server to handle unfinished requests before exiting
  server.close(() => {
    console.log(`server shutdown`);
    //exit close all pending requests os we use it in close method
    process.exit(1);
  });
});
