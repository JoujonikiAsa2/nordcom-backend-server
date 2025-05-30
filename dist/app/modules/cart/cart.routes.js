"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from "../../middleware/validateRequest";
const cart_controllers_1 = require("./cart.controllers");
// import AuthGurd from "../../middleware/AuthGurd";
const client_1 = require("@prisma/client");
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const router = express_1.default.Router();
router.post("/add", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER), 
// validateRequest(cartSchemas.addToCartSchema),
cart_controllers_1.cartControllers.addToCart);
router.delete("/remove/:id", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER), cart_controllers_1.cartControllers.removeItemFromCart);
router.delete("/remove-cart/:id", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER), cart_controllers_1.cartControllers.clearCart);
router.get("/", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER), cart_controllers_1.cartControllers.getCart);
exports.cartRoutes = router;
