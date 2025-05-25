import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import config from "../../../config";
import sendResponse from "../../shared/sendResponse";

const createOrder = catchAsync(async (req, res) => {

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order Created Successfully",
    data: {},
  });
});

export const orderControllers = {
  createOrder,
};
