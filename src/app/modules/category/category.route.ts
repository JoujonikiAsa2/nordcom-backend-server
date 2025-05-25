import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/AuthGurd";
import { UserRole } from "@prisma/client";
import { CategoryControllers } from "./category.controller";
import { CategorySchemas } from "./category.zodvalidation";

const router = express.Router();

router.get("/", CategoryControllers.GetCategorys);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  validateRequest(CategorySchemas.createCategorySchema),
  CategoryControllers.CreateCategory
);
router.patch(
  "/update/:id",
  AuthGurd(UserRole.ADMIN),
  validateRequest(CategorySchemas.updateCategorySchema),
  CategoryControllers.UpdateCategory
);
router.delete("/delete/:id", CategoryControllers.DeleteCategory);
router.get("/:id", CategoryControllers.GetCategoryById);

export const CategoryRoutes = router;