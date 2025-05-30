import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CouponServices } from "./coupon.service";

const GetCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.GetCouponsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Coupons Fetched Successfully.",
    data: result,
  });
});

const GetCouponById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CouponServices.GetCouponByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Coupon Fetched Successfully.",
    data: result,
  });
});

const CreateCoupon = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await CouponServices.CreateCouponIntoDB(data);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Coupon Created Successfully.",
    data: result,
  });
});

const UpdateCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CouponServices.UpdateCouponIntoDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Coupon Updated Successfully.",
    data: result,
  });
});

const DeleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CouponServices.DeleteCouponFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Coupon Deleted Successfully.",
    data: result,
  });
});

export const CouponControllers = {
  GetCoupons,
  GetCouponById,
  CreateCoupon,
  UpdateCoupon,
  DeleteCoupon
};
