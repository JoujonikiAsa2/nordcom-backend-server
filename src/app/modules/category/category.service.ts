import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Category } from "@prisma/client";

const GetCategorysFromDB = async () => {
  let category = await prisma.category.findMany({
    omit: {
      parentId: true,
    },
  });
  category = category.map((c) => {
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      createdAt: new Date().toISOString(),
    };
  });
  return category;
};
const GetCategoryByIdFromDB = async (id: string) => {
  const uniqueCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  return uniqueCategory;
};

const CreateCategoryIntoDB = async (payload: Category) => {
  const { name } = payload;
  console.log("payload", payload);
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
  console.log("payload from category", payload);
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

  console.log("updated result", result);
  return result;
};

const DeleteCategoryFromDB = async (id: string) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (isCategoryExists == null) {
    throw new ApiError(status.BAD_REQUEST, "Category does not exists!");
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
