"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMangementRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const AdminManagement_controllers_1 = require("./AdminManagement.controllers");
// import { AdminMangementControllers } from "./adminManagement.controllers";
const router = express_1.default.Router();
// Get all users
router.get("/users", (0, authGurd_1.default)(client_1.UserRole.ADMIN), AdminManagement_controllers_1.AdminMangementControllers.GetAllUsers);
// Fetch analytics data
router.get("/analytics", (0, authGurd_1.default)(client_1.UserRole.ADMIN), AdminManagement_controllers_1.AdminMangementControllers.GetAnalytics);
//update status of user
router.patch("/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), AdminManagement_controllers_1.AdminMangementControllers.ChangeUserStatus);
exports.AdminMangementRoutes = router;
