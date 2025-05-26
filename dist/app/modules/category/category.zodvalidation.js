"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchemas = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    slug: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.CategorySchemas = {
    createCategorySchema: exports.createCategorySchema,
    updateCategorySchema: exports.updateCategorySchema
};
