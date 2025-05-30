import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Category } from "@prisma/client";

const GetCategorysFromDB = async () => {
  const category = await prisma.category.findMany({
    include: {
      Products: true,
      children: true,
      parent: true,
    },
  });
  if (category.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No Category Available");
  }
  return category;
};

const GetCategoryByIdFromDB = async (id: string) => {
  const uniqueCategory = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      Products: true,
      children: {
        include: {
          Products: true,
        },
      }
    },
  });
  if (uniqueCategory === null) {
    throw new ApiError(status.NOT_FOUND, "No Category Available");
  }
  return uniqueCategory;
};

const CreateCategoryIntoDB = async (payload: Category) => {
  const { name } = payload;
  const isCategoryExists = await prisma.category.findFirst({
    where: { name: name },
  });
  if (isCategoryExists !== null) {
    throw new ApiError(status.BAD_REQUEST, "Category already exists!");
  }
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const UpdateCategoryIntoDB = async (id: string, payload: Partial<Category>) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (isCategoryExists === null) {
    throw new ApiError(status.NOT_FOUND, "No Category Available");
  }
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const DeleteCategoryFromDB = async (id: string) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (isCategoryExists === null) {
    throw new ApiError(status.NOT_FOUND, "No Category Available");
  }
  await prisma.category.delete({
    where: { id },
  });
  return null;
};

export const CategoryServices = {
  GetCategorysFromDB,
  GetCategoryByIdFromDB,
  CreateCategoryIntoDB,
  UpdateCategoryIntoDB,
  DeleteCategoryFromDB,
};

