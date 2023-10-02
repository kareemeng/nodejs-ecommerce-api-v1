import express from "express";
import categoryRouter from "./categoryRoute";
import subCategoryRouter from "./subcategoryRoute";
import brandRoute from "./brandRoute";
import productRoute from "./productRoute";
import userRoute from "./userRoute";
import authRout from "./authRoute";
import reviewRoute from "./reviewRoute";
import wishlistRoute from "./wishlistRoute";
import addressRoute from "./addressRoute";
import couponRoute from "./couponRoute";
import cartRoute from "./cartRoute";

const mountRouts = (app: express.Application) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRout);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
};

export default mountRouts;
