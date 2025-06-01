import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import config from "../../../config";
import sendResponse from "../../shared/sendResponse";
import { cartServices } from "./cart.services";

const addToCart = catchAsync(async (req, res) => {
  const result = await cartServices.addToCartInDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Added to cart successfully",
    data: result,
  });
});
const getCart = catchAsync(async (req, res) => {
  const result = await cartServices.getCartFromDB(req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart fetched successfully",
    data: result,
  });
});
const removeItemFromCart = catchAsync(async (req, res) => {
  const result = await cartServices.removeItemFromCartInDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart updated successfully",
    data: result,
  });
});
const clearCart = catchAsync(async (req, res) => {
  const result = await cartServices.clearCartFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: result,
    data: {},
  });
});

export const cartControllers = {
  addToCart,
  removeItemFromCart,
  clearCart,
  getCart
};
