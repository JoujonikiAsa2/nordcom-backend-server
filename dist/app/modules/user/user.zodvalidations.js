"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemas = exports.updateSchema = exports.userCreationSchema = exports.UserRoleEnum = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Enum for role
exports.UserRoleEnum = zod_1.z.enum([client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN]);
// Base schema
exports.userCreationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"), // Secure length
});
exports.updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    imageUrl: zod_1.z.string().optional(),
});
exports.UserSchemas = {
    userCreationSchema: exports.userCreationSchema,
    updateSchema: exports.updateSchema,
};
