import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import categoryRouter from "./routes/categoryRoute";
import { db_connection } from "./config/database";

const app = express();
dotenv.config();

app.use(express.json()); //parsing middleware

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev")); //logger middleware
  console.log(`mode: ${process.env.NODE_ENV}`);
}

db_connection(); //connect to database

app.use("/api/v1/categories", categoryRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
