import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { orderControllers } from "./orders.controllers";
import { orderSchemas } from "./orders.ZodValidations";

const router = express.Router();

router.post(
  "/create",
  validateRequest(orderSchemas.createOrderSchema),
  orderControllers.createOrder
);

export const OrderRoutes = router;
