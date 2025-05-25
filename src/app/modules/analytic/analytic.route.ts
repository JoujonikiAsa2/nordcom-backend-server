import { UserRole } from "@prisma/client";
import express from "express";
import AuthGurd from "../../middleware/authGurd";
import { AnalyticController } from "./analytic.controller";

const router = express.Router();

// Get all users
router.get(
  "/overview",
  AuthGurd(UserRole.ADMIN),
  AnalyticController.OverView
);

export const AnalyticRoutes = router;
