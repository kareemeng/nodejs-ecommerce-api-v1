import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import apiError from "../utils/apiError";
import handler from "./handlers";
import { CartModel, Cart, CartItem } from "../models/CartModel";
import { OrderModel, Order } from "../models/OrderModel";
import { ProductModel } from "../models/productModel";

/**
 * @desc    Create Cash Order
 * @route   POST /api/orders/:cartId
 * @access  protected/User
 */
export const createCashOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //app settings
    const tax = 0.05;
    const shipping = 10;
    //1-get cart
    const { cartId } = req.params;
    const cart = await CartModel.findById(cartId);
    //2-check for cart
    if (!cart) {
      return next(new apiError("Cart not found", 404));
    }
    //3-create order
    const { cartItems, totalCostAfterDiscount } = cart;

    const order = await OrderModel.create({
      user: req.user._id,
      cartItems: cartItems,
      tax,
      shipping,
      shippingAddress: req.body.shippingAddress,
      totalCost: totalCostAfterDiscount + tax + shipping,
      paymentMethod: "cash",
    });
    if (!order) {
      return next(new apiError("Order not created", 400));
    }
    //4-decreasing quantity of products
    const bulkOptions = cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {}); //bulk is better than forEach for performance and network overhead
    //5-empty cart
    await CartModel.findByIdAndDelete(cartId);

    res.status(201).json({
      status: "success",
      data: order,
    });
  }
);

/**
 * @desc    Get logged user orders
 * @route   GET /api/orders/myOrders
 * @access  protected/User
 */
export const getLoggedUserOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.user.role !== "admin") {
      filter = { user: req.user._id };
    }
    req.body.filter = filter;
    next();
  }
);

/**
 * @desc    Get all orders
 * @route   GET /api/orders/
 * @access  private/Admin
 */
export const getOrders = handler.getAll(OrderModel, "Order");
/**
 * @desc    Get specific order
 * @route   GET /api/orders/:id
 * @access  private/Admin
 */
export const getOrder = handler.getOne(OrderModel);

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/delivered
 * @access  private/Admin
 */

export const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(
        new apiError(`there is no order with this ID:${req.params.id} `, 404)
      );
    }
    order.isDelivered = true;
    order.deliveredAt = new Date();
    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  }
);
/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/paid
 * @access  private/Admin
 */

export const updateOrderToPaid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(
        new apiError(`there is no order with this ID:${req.params.id} `, 404)
      );
    }
    order.isPaid = true;
    order.paidAt = new Date();
    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  }
);
