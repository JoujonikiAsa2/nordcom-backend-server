import { UserStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import httpStatus from "http-status";

const ChangeUserStatusInDB = async (id: string, status: UserStatus) => {
  console.log(id, status);
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!existingUser)
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found.");
  // Update user status
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  }); 

  if (!updatedUser)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user status."
    );

  return updatedUser;
};

const GetAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
};

export const AdminManagementServices = {
  GetAllUsersFromDB,
  ChangeUserStatusInDB,
};
