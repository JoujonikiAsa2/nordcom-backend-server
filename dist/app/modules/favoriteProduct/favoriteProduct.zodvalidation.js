"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteProductSchemas = exports.updateFavoriteProductSchema = exports.createFavoriteProductSchema = void 0;
const zod_1 = require("zod");
exports.createFavoriteProductSchema = zod_1.z.object({
    userId: zod_1.z.string({ required_error: "User ID is required" }),
    productId: zod_1.z.string({ required_error: "Product ID is required" })
});
exports.updateFavoriteProductSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    productId: zod_1.z.string().optional(),
});
exports.FavoriteProductSchemas = {
    createFavoriteProductSchema: exports.createFavoriteProductSchema,
    updateFavoriteProductSchema: exports.updateFavoriteProductSchema
};
