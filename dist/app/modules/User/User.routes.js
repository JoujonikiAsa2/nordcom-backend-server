"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const UploadImage_1 = require("../../middleware/UploadImage");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const User_controllers_1 = require("./User.controllers");
const User_ZodValidations_1 = require("./User.ZodValidations");
const CloudinaryUpload_1 = require("../../../Helpers/CloudinaryUpload");
const router = express_1.default.Router();
// Create user
router.post("/register", (0, validateRequest_1.default)(User_ZodValidations_1.UserSchemas.userCreationSchema), User_controllers_1.UserControllers.registerUser);
// Get user profile BY id
router.get("/profile/:id", (0, AuthGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), User_controllers_1.UserControllers.getUserProfile);
//update user
router.patch("/update", (0, AuthGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), CloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(User_ZodValidations_1.UserSchemas.updateSchema), User_controllers_1.UserControllers.updateUser);
exports.UserRoutes = router;
