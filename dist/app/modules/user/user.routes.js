"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const UploadImage_1 = require("../../middleware/UploadImage");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const User_controllers_1 = require("./User.controllers");
const user_zodvalidations_1 = require("./user.zodvalidations");
const cloudinaryUpload_1 = require("../../../helpers/cloudinaryUpload");
const router = express_1.default.Router();
// Create user
router.post("/register", (0, validateRequest_1.default)(user_zodvalidations_1.UserSchemas.userCreationSchema), User_controllers_1.UserControllers.registerUser);
//update user
router.patch("/update", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), cloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(user_zodvalidations_1.UserSchemas.updateSchema), User_controllers_1.UserControllers.updateUser);
router.get("/my-profile", (0, authGurd_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), User_controllers_1.UserControllers.getUserProfile);
// Get user profile BY id
router.get("/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), User_controllers_1.UserControllers.getUserById);
exports.UserRoutes = router;
