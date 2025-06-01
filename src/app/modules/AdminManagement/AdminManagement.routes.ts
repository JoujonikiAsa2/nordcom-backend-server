import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/AuthGurd";
import { AdminMangementControllers } from "./AdminManagement.controllers";

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

// Total Orders by Status (Pie Chart)
router.get(
  "/analytics/order-by-status",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetOrdersByStatus
);

// Monthly Sales Revenue (Bar Chart)
router.get(
  "/analytics/monthly-sales",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetMonthlySales
);

// Top Selling Products (Table or Bar Chart)
router.get(
  "/analytics/top-products?limit=5",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetTopSellingProducts
);

// Total Revenue by Category (Pie or Bar Chart)
router.get(
  "/analytics/sales-by-category",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetSalesByCategory
);

// New Users Over Time (Line/Bar Chart)
router.get(
  "/analytics/users-growth",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.GetUsersGrowth
);

//update status of user
router.patch(
  "/:id",
  AuthGurd(UserRole.ADMIN),
  AdminMangementControllers.ChangeUserStatus
);

export const AdminMangementRoutes = router;
