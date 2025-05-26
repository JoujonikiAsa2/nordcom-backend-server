import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";
import { FavoriteProductSchemas } from "./favoriteProduct.zodvalidation";
import { FavoriteProductControllers } from "./favoriteProduct.controller";

const router = express.Router();

router.get("/", FavoriteProductControllers.GetFavoriteProducts);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  validateRequest(FavoriteProductSchemas.createFavoriteProductSchema),
  FavoriteProductControllers.CreateFavoriteProduct
);
router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN),
  FavoriteProductControllers.DeleteFavoriteProduct
);
router.get("/:userId", FavoriteProductControllers.GetFavoriteProductByUserId);

export const FavoriteProductRoutes = router;
