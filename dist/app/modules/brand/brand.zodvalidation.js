"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandSchemas = exports.updateBrandSchema = exports.createBrandSchema = void 0;
const zod_1 = require("zod");
exports.createBrandSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    logoUrl: zod_1.z.string().optional(),
    description: zod_1.z.string({ required_error: "Description is required" }),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.updateBrandSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.BrandSchemas = {
    createBrandSchema: exports.createBrandSchema,
    updateBrandSchema: exports.updateBrandSchema
};
