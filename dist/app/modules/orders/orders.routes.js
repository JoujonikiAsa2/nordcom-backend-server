"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from "../../middleware/validateRequest";
const orders_controllers_1 = require("./orders.controllers");
// import { orderSchemas } from "./orders.ZodValidations";
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), 
// validateRequest(orderSchemas.createOrderSchema),
orders_controllers_1.orderControllers.createOrder);
router.get("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN), orders_controllers_1.orderControllers.getAllOrders);
router.patch("/status/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), orders_controllers_1.orderControllers.changeOrderStatus);
router.get("/my-orders", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), orders_controllers_1.orderControllers.getMyOrders);
router.get("/:id", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), orders_controllers_1.orderControllers.getOrderById);
exports.OrderRoutes = router;
