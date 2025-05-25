import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/authGurd";
import { UploadImageInServer } from "../../middleware/UploadImage";
import validateRequest from "../../middleware/validateRequest";
import { UserControllers } from "./user.controllers";
import { UserSchemas } from "./user.zodvalidations";
import { UploadToCloudinary } from "../../../helpers/cloudinaryUpload";

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
