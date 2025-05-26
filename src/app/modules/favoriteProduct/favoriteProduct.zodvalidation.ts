import { z } from "zod";

export const createFavoriteProductSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  productId: z.string({ required_error: "Product ID is required" })
});

export const updateFavoriteProductSchema = z.object({
  userId: z.string().optional(),
  productId: z.string().optional(),
});

export const FavoriteProductSchemas = {
  createFavoriteProductSchema,
  updateFavoriteProductSchema
};
