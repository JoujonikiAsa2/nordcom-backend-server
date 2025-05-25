import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import config from "../../../config";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.services";
import { generateToken } from "../../../helpers/jwtHelpers";

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body);
  let { name, email, role } = result;
  const tokenData = {
    name,
    email,
    role: role.toLowerCase(),
  };
  console.log(tokenData);
  const accessToken = await generateToken(
    tokenData,
    config.jwt.access_token_secret!,
    "access"
  );
  const refreshToken = await generateToken(
    tokenData,
    config.jwt.refresh_token_secret!,
    "access"
  );
  console.log(accessToken, refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged In Successfully",
    data: {
      ...result,
      redirectUrl: `/dashboard/${role.toLowerCase()}/profile`,
      role: role,
      accessToken,
      refreshToken,
    },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body.email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reset Password Link Sent Successfully",
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password Changed Successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password Reset Successfully",
    data: result,
  });
});

export const AuthControllers = {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
