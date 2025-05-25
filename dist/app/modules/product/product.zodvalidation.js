"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchemas = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    slug: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.ProductSchemas = {
    createProductSchema: exports.createProductSchema,
    updateProductSchema: exports.updateProductSchema
};
