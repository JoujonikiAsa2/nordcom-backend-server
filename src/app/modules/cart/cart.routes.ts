import express from "express";
// import validateRequest from "../../middleware/validateRequest";
import { cartControllers } from "./cart.controllers";
// import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";
import AuthGurd from "../../middleware/authGurd";

const router = express.Router();

router.post(
  "/add",
  AuthGurd(UserRole.CUSTOMER),
  // validateRequest(cartSchemas.addToCartSchema),
  cartControllers.addToCart
);

router.delete(
  "/remove/:id",
  AuthGurd(UserRole.CUSTOMER),
  cartControllers.removeItemFromCart
);
router.delete(
  "/remove-cart/:id",
  AuthGurd(UserRole.CUSTOMER),
  cartControllers.clearCart
);
router.get("/", AuthGurd(UserRole.CUSTOMER), cartControllers.getCart);

export const cartRoutes = router;
