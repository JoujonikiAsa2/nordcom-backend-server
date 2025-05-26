"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const product_zodvalidation_1 = require("./product.zodvalidation");
const product_controller_1 = require("./product.controller");
const UploadImage_1 = require("../../middleware/UploadImage");
const cloudinaryUpload_1 = require("../../../helpers/cloudinaryUpload");
const router = express_1.default.Router();
router.get("/", product_controller_1.ProductControllers.GetProducts);
router.post("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), cloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(product_zodvalidation_1.ProductSchemas.createProductSchema), product_controller_1.ProductControllers.CreateProduct);
router.patch("/update/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), UploadImage_1.UploadImageInServer.single("file"), cloudinaryUpload_1.UploadToCloudinary, (0, validateRequest_1.default)(product_zodvalidation_1.ProductSchemas.updateProductSchema), product_controller_1.ProductControllers.UpdateProduct);
router.delete("/delete/:id", product_controller_1.ProductControllers.DeleteProduct);
router.get("/:id", product_controller_1.ProductControllers.GetProductById);
router.get("/view/popular-product", 
// AuthGurd(UserRole.ADMIN),
product_controller_1.ProductControllers.PopularProduct);
exports.ProductRoutes = router;
