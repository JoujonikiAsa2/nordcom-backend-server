import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import config from "../../../config";
import sendResponse from "../../shared/sendResponse";
import { orderServices } from "./orders.services";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const createOrder = catchAsync(async (req, res) => {
  const result = await orderServices.createOrderInDB(req.user.email);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order Created Successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrdersFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Orders Fetched Successfully",
    data: result,
  });
});

const changeOrderStatus = catchAsync(async (req, res) => {
  const result = await orderServices.changeOrderStatusInDB(
    req.params.id,
    req.body.status
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Status Changed Successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res: Response & {user?: JwtPayload}) => {
  const user = req.user
  const result = await orderServices.getMyOrdersFromDB(user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My Orders Fetched Successfully",
    data: result,
  });
})

const getOrderById = catchAsync(async (req, res: Response & {user?: JwtPayload}) => {
  const id = req.params.id
  const user = req.user
  const result = await orderServices.getOrderById(id, user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Order Fetched Successfully",
    data: result,
  });
})

export const orderControllers = {
  createOrder,
  getAllOrders,
  changeOrderStatus,
  getMyOrders,
  getOrderById
};
