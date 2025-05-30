import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.services";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Created Successfully.",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserInDB(req.user, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Updated Successfully.",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const result = await UserServices.getUserProfile(req.params.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Updated Successfully.",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  updateUser,
  getUserProfile,
};
