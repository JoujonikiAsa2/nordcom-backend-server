import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/authGurd";
import { AdminMangementControllers } from "./AdminManagement.controllers";
// import { AdminMangementControllers } from "./adminManagement.controllers";

const router = express.Router();

// Get all users
router.get(
  "/users",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetAllUsers
);

// Fetch analytics data
router.get(
  "/analytics",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetAnalytics
);

//update status of user
router.patch(
  "/:id",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.ChangeUserStatus
);

export const AdminMangementRoutes = router;
