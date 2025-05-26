import Stripe from "stripe";
import status from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { TPayment } from "./payment.zodvalidations";
import config from "../../../config";
import { PaymentStatus } from "@prisma/client";
import { generateTransactionId } from "./payment.util";
import sendMail from "../../../helpers/sendEmail";

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

  const orderedItems = orderInfo?.orderItems.map((item) => item);

  for (const item of orderedItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });
    if (product === null) {
      throw new ApiError(status.NOT_FOUND, "Product Not Available");
    }
  }

  // transaction id generate
  const trans_Id = generateTransactionId();
  const isPaid = await prisma.payment.findFirst({
    where: {
      orderId: orderInfo.id,
      status: PaymentStatus.PAID,
    },
  });

  if (isPaid !== null) {
    throw new ApiError(status.BAD_REQUEST, "Already Paid");
  }

  const result = await prisma.$transaction(async (tr_client) => {
    const paymentInfo = await tr_client.payment.create({
      data: {
        amount: orderInfo.totalAmount + Number(orderInfo.shippingFee) || 0,
        paidAt: new Date(),
        orderId: orderInfo.id,
        transactionId: payload.transactionId || trans_Id,
        status: PaymentStatus.PAID,
        method: payload.method ?? "card",
      },
    });

    const payment = null;
    if (!payment) {
      await prisma.order.delete({
        where: {
          id: orderInfo.id,
        }
      });

      for (const item of orderedItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: item.product.stock + item.quantity },
        });
      }
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

    await tr_client.order.update({
      where: {
        id: orderInfo.id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
    return paymentInfo;
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
