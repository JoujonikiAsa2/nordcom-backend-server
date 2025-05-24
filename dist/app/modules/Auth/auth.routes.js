"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_controllers_1 = require("./auth.controllers");
const Auth_ZodValidations_1 = require("./Auth.ZodValidations");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(Auth_ZodValidations_1.AuthSchemas.loginSchema), auth_controllers_1.AuthControllers.login);
router.patch("/forgot-password", auth_controllers_1.AuthControllers.forgotPassword);
router.patch("/reset-password", auth_controllers_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
