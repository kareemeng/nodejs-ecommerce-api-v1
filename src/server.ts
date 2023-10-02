import path from "path";

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
// import bodyParser from "body-parser";

//Routes
import mountRouts from "./routes";
// we can use ./routes instead of ./routes/index because index is the default file

//DB configuration
import { db_connection } from "./config/database";
// custom error class to handle API errors
import apiError from "./utils/apiError";
// globalErrorHandler takes APIError instance and returns error in json format
import { globalErrorHandler } from "./middlewares/errorMiddleware";

const app = express();
dotenv.config();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: "50mb" })); //parsing middleware
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

mountRouts(app); //mount all routes
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
