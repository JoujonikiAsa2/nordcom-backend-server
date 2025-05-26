import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  slug: z.string().optional(),
  parentId: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  parentId: z.string().optional(),
});

export const CategorySchemas = {
  createCategorySchema,
  updateCategorySchema
};
