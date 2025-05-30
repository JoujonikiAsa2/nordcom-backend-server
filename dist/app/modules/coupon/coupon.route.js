"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.get("/", coupon_controller_1.CouponControllers.GetCoupons);
router.post("/add", (0, authGurd_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponControllers.CreateCoupon);
router.patch("/update/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponControllers.UpdateCoupon);
router.delete("/delete/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponControllers.DeleteCoupon);
router.get("/:id", coupon_controller_1.CouponControllers.GetCouponById);
exports.CouponRoutes = router;
