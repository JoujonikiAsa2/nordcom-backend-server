import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { orderControllers } from "./orders.controllers";
import { orderSchemas } from "./orders.ZodValidations";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  AuthGurd(UserRole.CUSTOMER),
  // validateRequest(orderSchemas.createOrderSchema),
  orderControllers.createOrder
);

router.get("/", AuthGurd(UserRole.ADMIN), orderControllers.getAllOrders);
router.patch("/status/:id", AuthGurd(UserRole.ADMIN), orderControllers.changeOrderStatus);

export const OrderRoutes = router;
