import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import apiError from "../utils/apiError";
import { CartModel, Cart, CartItem } from "../models/CartModel";
import { CouponModel, Coupon } from "../models/CouponModel";
import { ProductModel } from "../models/productModel";
//TODO: add validators and use aggregate to get total cost and total cost after discount
/**
 * @desc    Add Product To Cart
 * @route   POST /api/cart
 * @access  protected/User
 */
export const addProductToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, color, quantity } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product) {
      console.log("product not found", product);
      return next(new apiError("Product not found", 404));
    }
    const price = product.price;
    //1-get cart for logged user
    let userCart = await CartModel.findOne({ user: req.user._id });
    //2-check for cart and create it if not exist
    if (!userCart) {
      userCart = await CartModel.create({
        user: req.user._id,
        cartItems: [{ product: productId, color, price }],
      });
    } else {
      //3-check if product not exist in cart
      const productIndex = userCart.cartItems.findIndex(
        (item) =>
          item.product.toString() === productId.toString() &&
          item.color === color
      );
      if (productIndex != -1) {
        //4-if product exist update quantity
        userCart.cartItems[productIndex].quantity += 1;
      } else {
        //5-if product not exist add it
        userCart.cartItems.push({
          product: productId,
          quantity: quantity,
          color,
          price,
        });
      }
    }
    //6-calculate total cost

    const totalCost = calculateTotalCost(userCart);
    userCart.totalCost = totalCost;

    if (userCart) await userCart.save(); //save cart if userCart exist

    res.status(200).json({
      result: "success",
      message: "Product added to cart successfully",
      data: userCart,
    });
  }
);

/**
 * @desc    Get logged user cart
 * @route   POST /api/cart
 * @access  protected/User
 */
export const getLoggedUserCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCart = await CartModel.findOne({ user: req.user._id });
    if (!userCart) {
      return next(new apiError("Cart not found", 404));
    }
    res.status(200).json({
      result: "success",
      cartItemsCount: userCart.cartItems.length,
      data: userCart,
    });
  }
);

/**
 * @desc    Delete cart item
 * @route   DELETE /api/cart/:itemId
 * @access  protected/User
 */
export const removeCartItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userCart = await CartModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { _id: id } } },
      { new: true }
    );
    if (!userCart) return next(new apiError("Cart not found", 404));

    const totalCost = calculateTotalCost(userCart);
    userCart.totalCost = totalCost;
    await userCart.save();
    res.status(200).json({
      result: "success",
      message: "Cart item deleted successfully",
      data: userCart,
    });
  }
);

/**
 * @desc    clear cart
 * @route   DELETE /api/cart
 * @access  protected/User
 */
export const clearCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCart = await CartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).json({
      result: "success",
      message: "Cart item deleted successfully",
      data: userCart,
    });
  }
);
/**
 * @desc    Update Cart Item Quantity
 * @route   DELETE /api/cart/:itemId
 * @access  protected/User
 */
export const updateQuantity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userCart = await CartModel.findOne({ user: req.user._id });
    if (!userCart) return next(new apiError("Cart not found", 404));
    const productIndex = userCart.cartItems.findIndex(
      (item) => item._id!.toString() === id.toString()
    );
    if (productIndex === -1)
      return next(new apiError("Cart item not found", 404));
    const product = userCart.cartItems[productIndex];
    product.quantity = quantity;
    userCart.totalCost = calculateTotalCost(userCart);
    await userCart.save();
    res.status(200).json({
      result: "success",
      message: "Cart item updated successfully",
      cartItemsCount: userCart.cartItems.length,
      data: userCart,
    });
  }
);
/**
 * @desc    Apply Coupon on Cart
 * @route   Put /api/cart/applyCoupon
 * @access  protected/User
 */
export const applyCouponToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get coupon info
    const { couponName } = req.body;
    const coupon = await CouponModel.findOne({
      name: couponName,
      expire: { $gt: Date.now() },
    });
    if (!coupon) return next(new apiError("Coupon is expired or invalid", 404));
    //get cart
    const userCart = await CartModel.findOne({ user: req.user._id });
    if (!userCart) return next(new apiError("Cart not found", 404));
    //calculate total cost after discount
    const totalCostAfterDiscount = calculateTotalCostAfterDiscount(
      userCart,
      coupon
    );
    userCart.totalCostAfterDiscount = totalCostAfterDiscount;
    await userCart.save();
    res.status(200).json({
      result: "success",
      message: "Coupon applied successfully",
      discountAmount: userCart.totalCost - userCart.totalCostAfterDiscount,
      data: userCart,
    });
  }
);

export const calculateTotalCost = (userCart: Cart) => {
  let totalCost = 0;
  // console.log("userCart", userCart.cartItems);
  if (!userCart) return totalCost;
  userCart.cartItems.forEach((item) => {
    totalCost += item.price * item.quantity;
  });
  userCart.totalCostAfterDiscount = totalCost;
  return totalCost;
};

export const calculateTotalCostAfterDiscount = (
  userCart: Cart,
  coupon: Coupon
) => {
  let totalCost = userCart.totalCost;
  let afterDiscount = 0;
  if (!userCart) return totalCost;
  afterDiscount = totalCost - (totalCost * coupon.discount) / 100;
  // make sure afterDiscount not less than 0
  afterDiscount = afterDiscount < 0 ? 0 : afterDiscount;
  // round afterDiscount to 2 decimal places
  afterDiscount = +afterDiscount.toFixed(2);
  return afterDiscount;
};
