import ApiError from "../../errors/ApiError";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import status from "http-status";
import sendMail from "../../../Helpers/sendEmail";
import { jwtHelpers } from "../../../Helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../shared/prisma";

// new branch created
const addToCartInDB = async (payload: any) => {
  console.log("Creating order in DB with payload:", payload);
  const { userId, items } = payload;

  if (!userId) throw new ApiError(status.BAD_REQUEST, "User ID is required.");
  if (!items) throw new ApiError(status.BAD_REQUEST, "Items are required.");
  // Check cart already exists for the user
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });
  if (existingCart) {
    throw new ApiError(
      status.BAD_REQUEST,
      "Cart already exists for this user."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const addToCartTable = await tx.cart.create({
      data: {
        userId,
      },
    });

    if (!addToCartTable) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to add to cart."
      );
    }

    const addCartIdToItemsArray = items.map((item: any) => ({
      ...item,
      cartId: addToCartTable.id,
    }));

    const addToCartItemsTable = await tx.cartItem.createMany({
      data: addCartIdToItemsArray,
    });

    if (!addToCartItemsTable) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to add to cart items."
      );
    }

    return addToCartTable;
  });

  if (!result)
    throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to add to cart.");

  return result;
};

const updateCartInDB = async (id: string, payload: any) => {
  console.log("Updating cart in DB with ID:", id, "and payload:", payload);
  const { items } = payload;
  if (!id) throw new ApiError(status.BAD_REQUEST, "Cart ID is required.");
  const findExsitingCart = await prisma.cart.findUnique({
    where: {
      id,
    },
  });
  if (!findExsitingCart) {
    throw new ApiError(status.NOT_FOUND, "Cart not found.");
  }

  if (!items || items.length === 0) {
    throw new ApiError(
      status.BAD_REQUEST,
      "Items are required to update cart."
    );
  }

  // Update the cart items
  const updatedItems = items.map((item: any) => ({
    ...item,
    cartId: id, // Ensure the cart ID is set for each item
  }));
  let updateCartItems;
  for (const item of updatedItems) {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: id,
        productId: item.productId,
      },
    });
    if (existingItem) {
      const updatedQuantity = existingItem.quantity + item.quantity;

      if (updatedQuantity > 0) {
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: updatedQuantity,
          },
        });
      } else {
        await prisma.cartItem.delete({
          where: {
            id: existingItem.id,
          },
        });
      }
    } else {
      if (item.quantity > 0) {
        await prisma.cartItem.create({
          data: {
            cartId: id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
  }

  if (!updateCartItems) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to update cart items."
    );
  }
  return {
    message: "Cart updated successfully",
    updatedItems,
  };
  // Implement the logic to update the cart in the database
  // For example, you might use Prisma to update a cart item
};

export const cartServices = {
  addToCartInDB,
  updateCartInDB,
};
