"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controllers_1 = require("./cart.controllers");
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/add", (0, AuthGurd_1.default)(client_1.UserRole.CUSTOMER), 
// validateRequest(cartSchemas.addToCartSchema),
cart_controllers_1.cartControllers.addToCart);
router.patch("/update/:id", (0, AuthGurd_1.default)(client_1.UserRole.CUSTOMER), cart_controllers_1.cartControllers.updateCart);
exports.cartRoutes = router;
