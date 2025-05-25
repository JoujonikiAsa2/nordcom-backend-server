import { PaymentStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const OverviewFromDB = async () => {
  //total sales calculation
  const totalEarnings = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  //total order
  const totalPaidOrder = await prisma.order.count();

  //total product totalSelOut
  const totalProductSelOut = await prisma.order.aggregate({
    _sum: {
      totalProduct: true,
    },
    where: {
      paymentStatus: true,
    },
  });

  const result = {
    totalEarnings,
    totalPaidOrder,
    totalProductSelOut,
  };
  return result;
};

export const AnalyticServices = {
  OverviewFromDB,
};
