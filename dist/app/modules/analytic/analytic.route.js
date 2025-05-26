"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const analytic_controller_1 = require("./analytic.controller");
const router = express_1.default.Router();
// Get all users
router.get("/overview", (0, authGurd_1.default)(client_1.UserRole.ADMIN), analytic_controller_1.AnalyticController.OverView);
exports.AnalyticRoutes = router;
