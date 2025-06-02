import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminManagementServices } from "./adminManagement.services";
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
  GetAnalytics,
};
