import ApiError from "../../errors/ApiError";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import status from "http-status";
import sendMail from "../../../helpers/sendEmail";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";

type TLogin = {
  email: string;
  password: string;
};

// new branch created
const prismaWithPassword = new PrismaClient();
const login = async (payload: TLogin) => {
  const { email, password } = payload;
  const isUserExists = await prismaWithPassword.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  if (isUserExists.status === "BLOCKED")
    throw new ApiError(status.FORBIDDEN, "User is Blocked.");
  const isPasswordValid = await bcrypt.compare(
    password,
    isUserExists?.password!
  );

  if (!isPasswordValid)
    throw new ApiError(status.UNAUTHORIZED, "Invalid Credentials.");
  const loggedInUser = {
    name: isUserExists.name,
    email: isUserExists.email,
    role: isUserExists.role,
  };
  console.log(loggedInUser);
  return loggedInUser;
};

const forgotPassword = async (email: string) => {
  const isUserExists = await prismaWithPassword.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  if (isUserExists.status === "BLOCKED")
    throw new ApiError(status.FORBIDDEN, "User is Blocked.");
  const generateToken = await jwtHelpers.generateToken(
    {
      name: isUserExists.name,
      email: isUserExists.email,
      role: isUserExists.role,
    },
    config.jwt.access_token_secret as string,
    "forgotPassword"
  );

  // Set temporary forgot password token in user extension table
  const addForgetPassswordToken = await prismaWithPassword.user.update({
    where: {
      email: isUserExists.email,
    },
    data: {
      forgotPasswordToken: generateToken,
    },
  });
  // Send email to user with reset password link
  const sendResetPasswordLink = sendMail(
    {
      email: isUserExists.email,
      subject: "Reset Password",
      token: generateToken,
      name: isUserExists.name,
      expiresIn: "1",
    },

    "forgotPassword"
  );
  if (!sendResetPasswordLink)
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to send reset password link."
    );
  const resetLink = `${config.client_url}/reset-password?token=${generateToken}&email=${email}`;
  return {
    resetLink,
  };
};
const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  console.log({
    token,
    password,
  });
  const decodedToken = jwtHelpers.verifyToken(
    token,
    config.jwt.access_token_secret as string
  );

  if (!decodedToken) throw new ApiError(status.UNAUTHORIZED, "Invalid Token.");
  // console.log("decodedToken", decodedToken);
  const isUserExists = await prismaWithPassword.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  if (isUserExists.status === "BLOCKED")
    throw new ApiError(status.FORBIDDEN, "User is Blocked.");

  // Check if the token in the database matches the token provided
  const decodedTokenInDataBase = jwtHelpers.verifyToken(
    isUserExists.forgotPasswordToken as string,
    config.jwt.access_token_secret as string
  );
  if (decodedTokenInDataBase.email !== decodedToken.email) {
    throw new ApiError(status.UNAUTHORIZED, "Invalid Reset Password Token.");
  }
  // Change user password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashedPassword", hashedPassword);
  const updatedUser = await prismaWithPassword.user.update({
    where: {
      email: isUserExists.email,
    },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null, // Clear the forgot password token after resetting the password
    },
  });
  if (!updatedUser)
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to reset password."
    );

  return true;
};
const changePassword = async (email: string) => {};

export const AuthServices = {
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
