import asyncHandler from "express-async-handler";
import stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import apiError from "../utils/apiError";
import handler from "./handlers";
import { CartModel, Cart, CartItem } from "../models/CartModel";
import { OrderModel, Order } from "../models/OrderModel";
import { ProductModel } from "../models/productModel";
import { json } from "body-parser";
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});
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

/**
 * @desc    get check out session from stripe and send it as response
 * @route   POST /api/orders/checkout-session/:cartId
 * @access  protected/User
 */
export const getCheckoutSession = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cartId } = req.params;
    //get cart
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return next(new apiError("Cart not found", 404));
    }
    //get total cost
    const totalCost =
      cart.totalCostAfterDiscount +
      parseFloat(process.env.SHIPPING || "0") +
      parseFloat(process.env.TAX || "0");
    if (isNaN(totalCost)) {
      return next(new Error("Invalid total cost"));
    }
    //create stripe session
    const session = await stripeInstance.checkout.sessions.create(
      {
        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "egp",
              product_data: {
                name: req.user.name,
              },
              unit_amount: totalCost * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",

        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,

        customer_email: req.user.email,
        client_reference_id: cartId,

        metadata: req.body.shippingAddress,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY!,
      }
    );

    //send session as response
    res.status(200).json({
      status: "success",
      data: session,
    });
  }
);
