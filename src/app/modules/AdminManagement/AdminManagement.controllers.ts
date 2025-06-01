import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminManagementServices } from "./AdminManagement.services";
import { UserStatus } from "@prisma/client";

const ChangeUserStatus = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.ChangeUserStatusInDB(
    req.params.id,
    req.query.status! as UserStatus
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Status Updated Successfully.",
    data: result,
  });
});

const GetAllUsers = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users Fetched successfully.",
    data: result,
  });
});

const GetOrdersByStatus = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetOrdersByStatusFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Orders Fetched successfully.",
    data: result,
  });
});

const GetMonthlySales = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetMonthlySalesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Sales Fetched successfully.",
    data: result,
  });
});

const GetTopSellingProducts = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetTopSellingProductsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products Fetched successfully.",
    data: result,
  });
});

const GetSalesByCategory = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetSalesByCategoryFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Sales Fetched successfully.",
    data: result,
  });
});

const GetUsersGrowth = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetUsersGrowthFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users Fetched successfully.",
    data: result,
  });
});
const GetAnalytics = catchAsync(async (req, res) => {
  const result = await AdminManagementServices.GetAnalyticsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users Fetched successfully.",
    data: result,
  });
});

export const AdminMangementControllers = {
  GetAllUsers,
  ChangeUserStatus,
  GetOrdersByStatus,
  GetMonthlySales,
  GetTopSellingProducts,
  GetSalesByCategory,
  GetUsersGrowth,
  GetAnalytics,
};
