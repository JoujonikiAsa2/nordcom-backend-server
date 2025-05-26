import express from "express";
import { PayementControllers } from "./payment.controllers";
import { PaymentSchemas } from "./payment.zodvalidations";
import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/authGurd";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/create-checkout-session",
  PayementControllers.CreateCheckoutSession
);

router.post(
  "/create",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(PaymentSchemas.paymentCreationSchema),
  PayementControllers.CreatePayment
);

router.get(
  "/",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetAllPayments
);

router.get(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetPaymentById
)
router.get(
  "/my-payments/:email",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetMyPayments
)
router.get(
  "/transId/:email/:transId",
  AuthGurd(UserRole.ADMIN),
  PayementControllers.GetPaymentByTransId
)

export const PaymentRoutes = router;
