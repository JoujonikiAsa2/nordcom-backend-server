import { PaymentStatus, UserRole } from "@prisma/client";
import { z } from "zod";

export const UserRoleEnum = z.enum([UserRole.CUSTOMER, UserRole.ADMIN]);

export const paymentCreationSchema = z.object({
  orderId: z.string().optional(),
  amount: z.number().optional(),
  method: z.string().optional(),
  transactionId: z.string().optional(),
  satus: z.enum([
    PaymentStatus.UNPAID,
    PaymentStatus.FAILED,
    PaymentStatus.PAID,
  ]).optional(),
});

export type TPayment = z.infer<typeof paymentCreationSchema>;

export const PaymentSchemas = {
  paymentCreationSchema,
};
