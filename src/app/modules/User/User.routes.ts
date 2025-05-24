import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/AuthGurd";
import { UploadImageInServer } from "../../middleware/UploadImage";
import validateRequest from "../../middleware/validateRequest";
import { UserControllers } from "./User.controllers";
import { UserSchemas } from "./User.ZodValidations";
import { UploadToCloudinary } from "../../../Helpers/CloudinaryUpload";

const router = express.Router();

// Create user
router.post(
  "/register",
  validateRequest(UserSchemas.userCreationSchema),
  UserControllers.registerUser
);

// Get user profile BY id
router.get(
  "/profile/:id",
  AuthGurd(UserRole.CUSTOMER, UserRole.ADMIN),
  UserControllers.getUserProfile
);

//update user
router.patch(
  "/update",
  AuthGurd(UserRole.CUSTOMER, UserRole.ADMIN),
  UploadImageInServer.single("file"),
  UploadToCloudinary,
  validateRequest(UserSchemas.updateSchema),
  UserControllers.updateUser
);

export const UserRoutes = router;
