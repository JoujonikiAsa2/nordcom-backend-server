"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const category_controller_1 = require("./category.controller");
const category_zodvalidation_1 = require("./category.zodvalidation");
const router = express_1.default.Router();
router.get("/", category_controller_1.CategoryControllers.GetCategorys);
router.post("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_zodvalidation_1.CategorySchemas.createCategorySchema), category_controller_1.CategoryControllers.CreateCategory);
router.patch("/update/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_zodvalidation_1.CategorySchemas.updateCategorySchema), category_controller_1.CategoryControllers.UpdateCategory);
router.delete("/delete/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryControllers.DeleteCategory);
router.get("/:id", category_controller_1.CategoryControllers.GetCategoryById);
exports.CategoryRoutes = router;
