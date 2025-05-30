import ApiError from "../../errors/ApiError";
import status from "http-status";
import prisma from "../../shared/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import httpStatus from "http-status";
import { getAvailableStatus } from "./orders.helper";
import { randomUUID } from "crypto";
import { JwtPayload } from "jsonwebtoken";
// new branch created
const createOrderInDB = async (email: string) => {
  // Check is user already exists
  const isUserExists = await prisma.user.findFirst({
    where: { email },
  });
  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  // Fetch this user's cart from cart table.
  const cart = await prisma.cart.findFirst({
    where: { userId: isUserExists.id },
    include: {
      items: true,
    },
  });

  if (!cart) throw new ApiError(status.NOT_FOUND, "Cart Not Found.");

  // Check if cart is empty
  const { items } = cart;
  if (items.length === 0) {
    throw new ApiError(
      status.BAD_REQUEST,
      "Cart is empty. Cannot create order."
    );
  }
  const items_withProducts: {
    productId: string;
    quantity: number;
    price: number;
  }[] = items.map((item) => ({ ...item, price: 0 })); // Initialize price to 0
  console.log("Cart Details: ", items);
  const totalProduct = items.reduce((acc, item) => acc + item.quantity, 0);
  let totalAmount = 0;
  let currentIndex = 0;
  const result = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const isProductExists = await prisma.product.findUnique({
        where: { id: item.productId, isDeleted: false },
      });
      if (!isProductExists)
        throw new ApiError(status.NOT_FOUND, "Product Not Found.");

      // Check if product is in stock
      if (isProductExists.stock < item.quantity) {
        throw new ApiError(
          status.BAD_REQUEST,
          `${isProductExists.name} is out of stock.`
        );
      }

      totalAmount += isProductExists.price * item.quantity;
      items_withProducts[currentIndex].price =
        isProductExists.price * item.quantity;
      currentIndex++;

      // Update product stock
      const stockUpdated = await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: isProductExists.stock - item.quantity,
        },
      });
      if (!stockUpdated) {
        throw new ApiError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to update product stock."
        );
      }
    }

    // Create order
    const orderCreated = await prisma.order.create({
      data: {
        userId: isUserExists.id,
        totalAmount,
        totalProduct,
        status: OrderStatus.PENDING,
        shippingId: randomUUID(),
        shippingFee: 70,
      },
    });

    if (!orderCreated) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to create order."
      );
    }

    // Create order items

    const orderItems = items_withProducts.map((item) => ({
      orderId: orderCreated.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    // console.log("Order Items: ", orderItems);

    const orderItemsCreated = await prisma.orderItem.createMany({
      data: orderItems,
    });
    if (!orderItemsCreated) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to create order items."
      );
    }

    // Clear cart items
    const cartItemsDeleted = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    if (!cartItemsDeleted) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to clear cart items."
      );
    }

    return orderCreated;
  });

  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await prisma.order.findMany();
  if (!result || result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found.");
  }
  const orderWithAvailableStatus = result.map((order) => {
    return {
      ...order,
      availableStatus: getAvailableStatus(order.status),
    };
  });
  return orderWithAvailableStatus;
};

const changeOrderStatusInDB = async (id: string, status: OrderStatus) => {
  // Check if order exists
  const isOrderExists = await prisma.order.findUnique({
    where: { id },
  });
  if (!isOrderExists)
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found.");
  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status,
    },
  });
  if (!updatedOrder)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update order status."
    );

  return { updatedOrder };
};

const getMyOrdersFromDB = async (user: JwtPayload) => {
  const isUserExists = await prisma.user.findFirst({
    where: { email: user?.email },
  });
  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");
  const result = await prisma.order.findMany({
    where: {
      userId: isUserExists?.id,
    },
    include: {
      orderItems: true,
      Payment: true,
      user: true,
    },
  });

  return result;
};

export const orderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  changeOrderStatusInDB,
  getMyOrdersFromDB,
};
