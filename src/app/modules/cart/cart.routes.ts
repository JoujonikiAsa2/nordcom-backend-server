import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { cartControllers } from "./cart.controllers";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/add",
  AuthGurd(UserRole.CUSTOMER),
  // validateRequest(cartSchemas.addToCartSchema),
  cartControllers.addToCart
);

router.patch(
  "/update/:id",
  AuthGurd(UserRole.CUSTOMER),
  cartControllers.updateCart
);

export const cartRoutes = router;
