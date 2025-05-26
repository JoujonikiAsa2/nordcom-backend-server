import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";
import { BrandControllers } from "./brand.controller";
import { BrandSchemas } from "./brand.zodvalidation";

const router = express.Router();

router.get("/", BrandControllers.GetBrands);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  validateRequest(BrandSchemas.createBrandSchema),
  BrandControllers.CreateBrand
);
router.patch(
  "/update/:id",
  AuthGurd(UserRole.ADMIN),
  validateRequest(BrandSchemas.updateBrandSchema),
  BrandControllers.UpdateBrand
);
router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN),
  BrandControllers.DeleteBrand
);
router.get("/:id", BrandControllers.GetBrandById);

export const BrandRoutes = router;
