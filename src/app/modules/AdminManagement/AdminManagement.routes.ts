import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/authGurd";
import { AdminMangementControllers } from "./adminManagement.controllers";

const router = express.Router();

// Get all users
router.get(
  "/users",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetAllUsers
);

//update status of user
router.patch(
  "/:id",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.ChangeUserStatus
);

export const AdminMangementRoutes = router;
