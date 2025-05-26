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
  const { userId, item } = payload;

  if (!userId) throw new ApiError(status.BAD_REQUEST, "User ID is required.");
  if (!item) throw new ApiError(status.BAD_REQUEST, "Items are required.");
  // Check cart already exists for the user
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!existingCart) {
    // add new cart and then add items to it
    if (item.quantity <= 0) {
      throw new ApiError(
        status.BAD_REQUEST,
        "Quantity must be greater than 10."
      );
    }
    const addToCartTable = await prisma.cart.create({
      data: {
        userId,
      },
    });
    // check if quantity is negative
    // add item to cart items table
    const addToCartItemsTable = await prisma.cartItem.create({
      data: {
        cartId: addToCartTable.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    });
    if (!addToCartTable || !addToCartItemsTable) {
      throw new ApiError(
        status.INTERNAL_SERVER_ERROR,
        "Failed to add to cart."
      );
    }
    return addToCartTable;
  } else {
    // find if the item is new to add
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: existingCart.id,
        productId: item.productId,
      },
    });
    if (existingItem) {
      // if item exists, update the quantity
      const udpatedQuantity = existingItem.quantity + item.quantity;
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
          productId: existingItem.productId,
        },
        data: {
          quantity: udpatedQuantity,
        },
      });
      if (!updatedCartItem) {
        throw new ApiError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to update cart item."
        );
      }
      return updatedCartItem;
    } else {
      // if item does not exist, check if quantity is negative
      if (item.quantity <= 0) {
        throw new ApiError(
          status.BAD_REQUEST,
          "Quantity must be greater than 0..."
        );
      }
      // if item does not exist, add it to the cart items
      const addToCartItemsTable = await prisma.cartItem.create({
        data: {
          cartId: existingCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
      if (!addToCartItemsTable) {
        throw new ApiError(
          status.INTERNAL_SERVER_ERROR,
          "Failed to add item to cart."
        );
      }
      return addToCartItemsTable;
    }
  }
};

const removeItemFromCartInDB = async (id: string) => {
  const findCartItem = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!findCartItem) {
    throw new ApiError(status.NOT_FOUND, "Cart item not found.");
  }
  const deletedCartItem = await prisma.cartItem.delete({
    where: { id },
    select: { product: true },
  });
  if (!deletedCartItem) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to delete cart item."
    );
  }
  return `${deletedCartItem.product.name} removed successfully.`;
};

const clearCartFromDB = async (cartId: string) => {
  const findCart = await prisma.cart.findUnique({
    where: { id: cartId },
  });
  if (!findCart) {
    throw new ApiError(status.NOT_FOUND, "Cart not found.");
  }
  const deletedCartItems = await prisma.cartItem.deleteMany({
    where: { cartId },
  });
  if (!deletedCartItems) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to delete cart items."
    );
  }

  await prisma.cart.delete({
    where: { id: cartId },
  });

  return "Cart cleared successfully.";
};

export const cartServices = {
  addToCartInDB,
  removeItemFromCartInDB,
  clearCartFromDB,
};
