import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "@prisma/client";
import { ProductSchemas } from "./product.zodvalidation";
import { ProductControllers } from "./product.controller";
import { UploadImageInServer } from "../../middleware/UploadImage";
import AuthGurd from "../../middleware/AuthGurd";
import { UploadToCloudinary } from "../../../helpers/CloudinaryUpload";

const router = express.Router();

router.get("/", ProductControllers.GetProducts);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(ProductSchemas.createProductSchema),
  ProductControllers.CreateProduct
);

router.patch(
  "/update/:id",
  AuthGurd(UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(ProductSchemas.updateProductSchema),
  ProductControllers.UpdateProduct
);

router.delete("/delete/:id", ProductControllers.DeleteProduct);

router.get("/:id", ProductControllers.GetProductById);

router.get(
  "/popular-product/count",
  // AuthGurd(UserRole.ADMIN),
  ProductControllers.PopularProduct
);

export const ProductRoutes = router;
