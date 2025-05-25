import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import config from "../../../config";
import sendResponse from "../../shared/sendResponse";
import { orderServices } from "./orders.services";

const createOrder = catchAsync(async (req, res) => {
  const result = await orderServices.createOrderInDB(req.user.email);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order Created Successfully",
    data: result,
  });
});

export const orderControllers = {
  createOrder,
};
