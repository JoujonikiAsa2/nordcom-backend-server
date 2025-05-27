import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";
import { FavoriteProductSchemas } from "./favoriteProduct.zodvalidation";
import { FavoriteProductControllers } from "./favoriteProduct.controller";

const router = express.Router();

router.get("/",  AuthGurd(UserRole.ADMIN), FavoriteProductControllers.GetFavoriteProducts);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  validateRequest(FavoriteProductSchemas.createFavoriteProductSchema),
  FavoriteProductControllers.CreateFavoriteProduct
);
router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN, UserRole.CUSTOMER),
  FavoriteProductControllers.DeleteFavoriteProduct
);
router.get("/:userId",  AuthGurd(UserRole.CUSTOMER), FavoriteProductControllers.GetFavoriteProductByUserId);

export const FavoriteProductRoutes = router;
