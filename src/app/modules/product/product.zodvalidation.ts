import { z } from "zod";

const SpecificationItemSchema = z.object({
  label: z.string({ required_error: "Specification label is required" }),
  value: z.string({ required_error: "Specification value is required" }),
});

const SEOInfoItemSchema = z.object({
  label: z.string({ required_error: "SEO label is required" }),
  value: z.string({ required_error: "SEO value is required" }),
});

export const createProductSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  sku: z.string({ required_error: "SKU is required" }),
  discountPrice: z.number({ required_error: "Discount price is required" }),
  description: z.string({ required_error: "Description is required" }),
  price: z.number({ required_error: "Price is required" }),
  stock: z.number({ required_error: "Stock is required" }),
  stockStatus: z.boolean({ required_error: "Stock status is required" }),
  brandId: z.string({ required_error: "Brand ID is required" }),
  purchasedPrice: z.number({ required_error: "Purchased price is required" }),
  specification: z.array(SpecificationItemSchema).optional().default([]),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string()).optional().default([]),
  categoryId: z.string({ required_error: "Category ID is required" }),
  seoInformation: z.array(SEOInfoItemSchema).optional().default([]),
  variants: z.array(z.string()).optional().default([]),
  isDeleted: z.boolean().optional().default(false),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  discountPrice: z.number().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  stockStatus: z.boolean().optional(),
  brandId: z.string().optional(),
  purchasedPrice: z.number().optional(),
  specification: z.array(SpecificationItemSchema).optional().default([]),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string()).optional().default([]),
  categoryId: z.string().optional(),
  seoInformation: z.array(SEOInfoItemSchema).optional().default([]),
  variants: z.array(z.string()).optional().default([]),
  isDeleted: z.boolean().optional().default(false),
});

export const ProductSchemas = {
  createProductSchema,
  updateProductSchema,
};
