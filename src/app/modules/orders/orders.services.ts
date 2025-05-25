import ApiError from "../../errors/ApiError";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import status from "http-status";
import sendMail from "../../../Helpers/sendEmail";
import { jwtHelpers } from "../../../Helpers/jwtHelpers";
import config from "../../../config";

type TLogin = {
  email: string;
  password: string;
};

// new branch created
const createOrderInDB = async (payload: TLogin) => {};

export const AuthServices = {
  createOrderInDB,
};
