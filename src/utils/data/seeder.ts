import fs from "fs";
import colors from "colors/safe";
import dotenv from "dotenv";
import { ProductModel, Product } from "../../models/productModel";
import { db_connection } from "../../config/database";

dotenv.config();

// connect to DB
db_connection();

// Read data
const products = JSON.parse(
  fs.readFileSync("src/utils/data/productsData.json", "utf-8")
);

// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);

    console.log(colors.green("Data Inserted"));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log(colors.red("Data Destroyed"));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  // node seeder.js -i
  insertData();
} else if (process.argv[2] === "-d") {
  // node seeder.js -d
  destroyData();
}
