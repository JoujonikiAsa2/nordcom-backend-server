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
const updateCart = catchAsync(async (req, res) => {
  const result = await cartServices.updateCartInDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart updated successfully",
    data: {},
  });
});

export const cartControllers = {
  addToCart,
  updateCart,
};
