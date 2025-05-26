"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controllers_1 = require("./payment.controllers");
const payment_zodvalidations_1 = require("./payment.zodvalidations");
const client_1 = require("@prisma/client");
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
//create session
router.post("/create-checkout-session", payment_controllers_1.PayementControllers.CreateCheckoutSession);
//create payment
router.post("/create", (0, authGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(payment_zodvalidations_1.PaymentSchemas.paymentCreationSchema), payment_controllers_1.PayementControllers.CreatePayment);
//get payments
router.get("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), payment_controllers_1.PayementControllers.GetAllPayments);
// get payments by id
router.get("/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), payment_controllers_1.PayementControllers.GetPaymentById);
// get all payment of a user
router.get("/my-payments/:email", (0, authGurd_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), payment_controllers_1.PayementControllers.GetMyPayments);
// get payment by transaction 
router.get("/transId/:transId", (0, authGurd_1.default)(client_1.UserRole.ADMIN), payment_controllers_1.PayementControllers.GetPaymentByTransId);
exports.PaymentRoutes = router;
