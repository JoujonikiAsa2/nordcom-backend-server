import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Coupon } from "@prisma/client";

const GetCouponsFromDB = async () => {
  const coupon = await prisma.coupon.findMany({
    include: {
      couponUsages: true,
    },
  });
  if (coupon.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No coupon Available");
  }
  return coupon;
};

const GetCouponByIdFromDB = async (id: string) => {
  const uniquecoupon = await prisma.coupon.findUnique({
    where: {
      id,
    },
    include: {
      couponUsages: true,
    },
  });
  if (uniquecoupon === null) {
    throw new ApiError(status.NOT_FOUND, "No coupon Available");
  }
  return uniquecoupon;
};

const CreateCouponIntoDB = async (payload: Coupon) => {
  const { code } = payload;
  const iscouponExists = await prisma.coupon.findFirst({
    where: { code },
  });
  if (iscouponExists !== null) {
    throw new ApiError(status.BAD_REQUEST, "coupon already exists!");
  }
  const result = await prisma.coupon.create({
    data: payload,
  });
  return result;
};

const UpdateCouponIntoDB = async (id: string, payload: Partial<Coupon>) => {
  const iscouponExists = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  if (iscouponExists === null) {
    throw new ApiError(status.NOT_FOUND, "No coupon Available");
  }
  const result = await prisma.coupon.update({
    where: { id },
    data: payload,
  });
  return result;
};

const DeleteCouponFromDB = async (id: string) => {
  const iscouponExists = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  if (iscouponExists === null) {
    throw new ApiError(status.NOT_FOUND, "No coupon Available");
  }
  await prisma.coupon.delete({
    where: { id },
  });
  return null;
};

export const CouponServices = {
  GetCouponsFromDB,
  GetCouponByIdFromDB,
  CreateCouponIntoDB,
  UpdateCouponIntoDB,
  DeleteCouponFromDB,
};
