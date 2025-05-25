"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const AuthGurd_1 = __importDefault(require("../../middleware/AuthGurd"));
const client_1 = require("@prisma/client");
const product_zodvalidation_1 = require("./product.zodvalidation");
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
router.get("/", product_controller_1.ProductControllers.GetProducts);
router.post("/", 
// AuthGurd(UserRole.ADMIN),
// validateRequest(ProductSchemas.createProductSchema),
product_controller_1.ProductControllers.CreateProduct);
router.patch("/update/:id", (0, AuthGurd_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(product_zodvalidation_1.ProductSchemas.updateProductSchema), product_controller_1.ProductControllers.UpdateProduct);
router.delete("/delete/:id", product_controller_1.ProductControllers.DeleteProduct);
router.get("/:id", product_controller_1.ProductControllers.GetProductById);
exports.ProductRoutes = router;
