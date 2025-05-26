"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchemas = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"), // Secure length
});
exports.orderSchemas = {
    createOrderSchema: exports.createOrderSchema,
};
