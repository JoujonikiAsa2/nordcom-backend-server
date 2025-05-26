import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  logoUrl: z.string().optional(),
  description: z.string({required_error:"Description is required"}),
  isFeatured: z.boolean().optional(),
});

export const updateBrandSchema = z.object({
  name: z.string().optional(),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export const BrandSchemas = {
  createBrandSchema,
  updateBrandSchema
};