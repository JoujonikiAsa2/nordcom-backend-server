import Stripe from "stripe";
import status from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { TPayment } from "./payment.zodvalidations";
import config from "../../../config";
import { PaymentStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { generateTransactionId } from "./payment.util";
import sendMail from "../../../helpers/sendEmail";
import { userInfo } from "os";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10; custom_checkout_beta=v1" as any,
});

const CreateChechoutSession = async (payload: {
  name: string;
  email: string;
  amount: number;
}) => {
  const createCustomer = await stripe.customers.create({
    email: payload?.email,
    name: payload?.name,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(payload.amount) * 100,
    currency: "bdt",
    payment_method_types: ["card"],
    customer: createCustomer.id,
  });
  return { clientSecret: paymentIntent.client_secret };
};

const CreatePaymentInDB = async (payload: TPayment & { email: string }) => {
  const userInfo = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User does not exist");
  }

  const orderInfo = await prisma.order.findUnique({
    where: { id: payload?.orderId },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!orderInfo) {
    throw new ApiError(status.NOT_FOUND, "Order does not exist");
  }

  const orderedItems = orderInfo?.orderItems.map((item) => item.productId);

  orderedItems?.forEach(async (item) => {
    const product = await prisma.product.findUnique({
      where: {
        id: item,
      },
    });
    if (product === null) {
      throw new ApiError(status.NOT_FOUND, "User Not Available");
    }
    console.log("I got it");
  });

  // transaction id generate
  const trans_Id = generateTransactionId();

  const result = await prisma.$transaction(async (tr_client) => {
    const paymentInfo = await prisma.payment.create({
      data: {
        amount: orderInfo.totalAmount || 0,
        paidAt: new Date(),
        orderId: orderInfo.id,
        transactionId: payload.transactionId || trans_Id,
        status: PaymentStatus.PAID,
        method: payload.method ?? "card",
      },
    });

    if (paymentInfo === null) {
      await prisma.order.update({
        where: {
          id: orderInfo.id,
        },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });
      throw new ApiError(status.BAD_REQUEST, "Payment Failed");
    }

    const emailInfo = {
      name: userInfo.name,
      email: userInfo.email,
      subject: "Payment Confirmation",
      transactionId: paymentInfo.transactionId,
      orderId: orderInfo.id,
      amount: orderInfo.totalAmount,
      total_products: orderInfo.totalProduct,
      paidAt: paymentInfo.paidAt,
    };

    sendMail(emailInfo, "payment");

    await prisma.order.update({
      where: {
        id: orderInfo.id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return result;
};

const GetPaymentByTransId = async (transId: string) => {
  const result = await prisma.payment.findFirst({
    where: {
      transactionId: transId,
    },
  });

  if (result === null) {
    throw new ApiError(status.NOT_FOUND, "No Payment Available");
  }
  return result;
};

const GetPaymentsByUserEmail = async (email: string, orderId: string) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "No User Available");
  }

  const result = await prisma.payment.findMany({
    where: {
      order: {
        user: {
          email: userInfo.email,
        },
      },
    },
  });
  if (result.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No Payment Available");
  }
  return result;
};

const GetPaymentById = async (id: string) => {
  const result = await prisma.payment.findFirst({
    where: {
      id: id,
    },
  });
  if (result === null) {
    throw new ApiError(status.NOT_FOUND, "No Payment Available");
  }
  return result;
};

const GetAllPaymentsFromDB = async () => {
  const result = await prisma.payment.findMany({});

  if (result.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No Payments Available");
  }
  return result;
};

export const PaymentServices = {
  CreateChechoutSession,
  CreatePaymentInDB,
  GetPaymentByTransId,
  GetPaymentsByUserEmail,
  GetPaymentById,
  GetAllPaymentsFromDB,
};
