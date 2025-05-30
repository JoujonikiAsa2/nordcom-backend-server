import ApiError from "../../errors/ApiError";
import status from "http-status";
import prisma from "../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";

const getCartFromDB = async (user: JwtPayload) => {
  const { role, email } = user;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");
  const userId = isUserExists.id;

  const data = await prisma.cart.findFirst({
    where: {
      userId: isUserExists.id,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });
  console.log(data);

  const subtotal = data?.items?.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (!data === null) {
    throw new ApiError(status.NOT_FOUND, "Cart not found.");
  }

  return { data, subtotal};
};

// new branch created
const addToCartInDB = async (payload: any) => {
  const { email, item } = payload;
  console.log(item, email)
  const isUserExists = await prisma.user.findFirst({
    where:{
      email
    }
  })
  if (!isUserExists) throw new ApiError(status.BAD_REQUEST, "User ID is required.");
  if (!item) throw new ApiError(status.BAD_REQUEST, "Items are required.");

  // Check cart already exists for the user
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: isUserExists?.id,
    },
  });

  if (!existingCart) {
    // add new cart and then add items to it
    if (item.quantity <= 0) {
      throw new ApiError(
        status.BAD_REQUEST,
        "Quantity must be greater than 0."
      );
    }
    const addToCartTable = await prisma.cart.create({
      data: {
        userId: isUserExists?.id,
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

    console.log(addToCartItemsTable);
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
      const udpatedQuantity = item.quantity;
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
          "Quantity must be greater than 0."
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

      console.log(addToCartItemsTable)
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
  getCartFromDB,
  addToCartInDB,
  removeItemFromCartInDB,
  clearCartFromDB,
};
