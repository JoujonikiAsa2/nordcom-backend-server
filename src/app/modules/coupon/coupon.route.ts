import express from "express";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";
import { CouponControllers } from "./coupon.controller";

const router = express.Router();

router.get("/", CouponControllers.GetCoupons);

router.post(
  "/add",
  AuthGurd(UserRole.ADMIN),
  CouponControllers.CreateCoupon
);
router.patch(
  "/update/:id",
  AuthGurd(UserRole.ADMIN),
  CouponControllers.UpdateCoupon
);
router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN),
  CouponControllers.DeleteCoupon
);
router.get("/:id", CouponControllers.GetCouponById);

export const CouponRoutes = router;
