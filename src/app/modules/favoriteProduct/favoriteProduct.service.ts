import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Favorite } from "@prisma/client";

const GetFavoriteProductsFromDB = async () => {
  const FavoriteProduct = await prisma.favorite.findMany();
  if (FavoriteProduct.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No FavoriteProduct Available");
  }
  return FavoriteProduct;
};

const GetFavoriteProductByUserIdFromDB = async (id: string) => {
  const uniqueFavoriteProduct = await prisma.favorite.findMany({
    where: {
      userId: id,
    },
    include: {
      product: true,
      user: true,
    },
  });
  if (uniqueFavoriteProduct.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No FavoriteProduct Available");
  }
  return uniqueFavoriteProduct;
};

const CreateFavoriteProductIntoDB = async (payload: Favorite) => {
  const { userId, productId } = payload;
  const isFavoriteProductExists = await prisma.favorite.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });
  if (isFavoriteProductExists !== null) {
    throw new ApiError(status.BAD_REQUEST, "FavoriteProduct already exists!");
  }
  const result = await prisma.favorite.create({
    data: payload,
  });
  return result;
};

const RemoveFavoriteProductFromDB = async (id: string) => {
  const isFavoriteProductExists = await prisma.favorite.findUnique({
    where: {
      id,
    },
  });
  if (isFavoriteProductExists === null) {
    throw new ApiError(status.NOT_FOUND, "No FavoriteProduct Available");
  }
  const result = await prisma.favorite.delete({
    where: {
      id,
    },
  });
  return result;
};

export const FavoriteProductServices = {
  GetFavoriteProductsFromDB,
  GetFavoriteProductByUserIdFromDB,
  CreateFavoriteProductIntoDB,
  RemoveFavoriteProductFromDB,
};
