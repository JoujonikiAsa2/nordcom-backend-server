import express from "express";
import { PayementControllers } from "./payment.controllers";
import { PaymentSchemas } from "./payment.zodvalidations";
import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/authGurd";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();
//create session
router.post(
  "/create-checkout-session",
  PayementControllers.CreateCheckoutSession
);

//create payment
router.post(
  "/create",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  validateRequest(PaymentSchemas.paymentCreationSchema),
  PayementControllers.CreatePayment
);

//get payments
router.get(
  "/",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetAllPayments
);

// get payments by id
router.get(
  "/:id",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetPaymentById
)

// get all payment of a user
router.get(
  "/my-payments/:email",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  PayementControllers.GetMyPayments
)

// get payment by transaction 
router.get(
  "/transId/:transId",
  AuthGurd(UserRole.ADMIN),
  PayementControllers.GetPaymentByTransId
)

export const PaymentRoutes = router;
