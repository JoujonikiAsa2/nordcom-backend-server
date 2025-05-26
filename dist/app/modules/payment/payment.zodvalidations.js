"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchemas = exports.paymentCreationSchema = exports.UserRoleEnum = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.UserRoleEnum = zod_1.z.enum([client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN]);
exports.paymentCreationSchema = zod_1.z.object({
    orderId: zod_1.z.string().optional(),
    amount: zod_1.z.number().optional(),
    method: zod_1.z.string(),
    transactionId: zod_1.z.string().optional(),
    satus: zod_1.z.enum([
        client_1.PaymentStatus.UNPAID,
        client_1.PaymentStatus.FAILED,
        client_1.PaymentStatus.PAID,
    ]).optional(),
});
exports.PaymentSchemas = {
    paymentCreationSchema: exports.paymentCreationSchema,
};
