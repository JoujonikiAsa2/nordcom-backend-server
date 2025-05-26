"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchemas = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const SpecificationItemSchema = zod_1.z.object({
    label: zod_1.z.string({ required_error: "Specification label is required" }),
    value: zod_1.z.string({ required_error: "Specification value is required" }),
});
const SEOInfoItemSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: "SEO label is required" }),
    keyword: zod_1.z.string({ required_error: "SEO value is required" }),
    description: zod_1.z.string({ required_error: "SEO value is required" }),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    sku: zod_1.z.string({ required_error: "SKU is required" }),
    discountPrice: zod_1.z.number({ required_error: "Discount price is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    price: zod_1.z.number({ required_error: "Price is required" }),
    stock: zod_1.z.number({ required_error: "Stock is required" }),
    stockStatus: zod_1.z.boolean({ required_error: "Stock status is required" }),
    brandId: zod_1.z.string({ required_error: "Brand ID is required" }),
    purchasedPrice: zod_1.z.number({ required_error: "Purchased price is required" }),
    specification: zod_1.z.array(SpecificationItemSchema).optional().default([]),
    isFeatured: zod_1.z.boolean().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    categoryId: zod_1.z.string({ required_error: "Category ID is required" }),
    seoInformation: zod_1.z.array(SEOInfoItemSchema).optional().default([]),
    variants: zod_1.z.array(zod_1.z.string()).optional().default([]),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    discountPrice: zod_1.z.number().optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    stock: zod_1.z.number().optional(),
    stockStatus: zod_1.z.boolean().optional(),
    brandId: zod_1.z.string().optional(),
    purchasedPrice: zod_1.z.number().optional(),
    specification: zod_1.z.array(SpecificationItemSchema).optional().default([]),
    isFeatured: zod_1.z.boolean().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    categoryId: zod_1.z.string().optional(),
    seoInformation: zod_1.z.array(SEOInfoItemSchema).optional().default([]),
    variants: zod_1.z.array(zod_1.z.string()).optional().default([]),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.ProductSchemas = {
    createProductSchema: exports.createProductSchema,
    updateProductSchema: exports.updateProductSchema,
};
