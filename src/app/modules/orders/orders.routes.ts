import express from "express";
// import validateRequest from "../../middleware/validateRequest";
import { orderControllers } from "./orders.controllers";
// import { orderSchemas } from "./orders.ZodValidations";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  AuthGurd(UserRole.CUSTOMER, UserRole.ADMIN),
  // validateRequest(orderSchemas.createOrderSchema),
  orderControllers.createOrder
);

router.get("/", AuthGurd(UserRole.ADMIN), orderControllers.getAllOrders);
router.patch("/status/:id", AuthGurd(UserRole.ADMIN), orderControllers.changeOrderStatus);
router.get("/my-orders", AuthGurd(UserRole.CUSTOMER, UserRole.ADMIN), orderControllers.getMyOrders);

export const OrderRoutes = router;
