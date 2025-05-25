"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const orders_controllers_1 = require("./orders.controllers");
const orders_ZodValidations_1 = require("./orders.ZodValidations");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(orders_ZodValidations_1.orderSchemas.createOrderSchema), orders_controllers_1.orderControllers.createOrder);
exports.OrderRoutes = router;
