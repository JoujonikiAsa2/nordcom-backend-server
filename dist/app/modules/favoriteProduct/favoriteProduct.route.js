"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const favoriteProduct_zodvalidation_1 = require("./favoriteProduct.zodvalidation");
const favoriteProduct_controller_1 = require("./favoriteProduct.controller");
const router = express_1.default.Router();
router.get("/", favoriteProduct_controller_1.FavoriteProductControllers.GetFavoriteProducts);
router.post("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(favoriteProduct_zodvalidation_1.FavoriteProductSchemas.createFavoriteProductSchema), favoriteProduct_controller_1.FavoriteProductControllers.CreateFavoriteProduct);
router.delete("/delete/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), favoriteProduct_controller_1.FavoriteProductControllers.DeleteFavoriteProduct);
router.get("/:userId", favoriteProduct_controller_1.FavoriteProductControllers.GetFavoriteProductByUserId);
exports.FavoriteProductRoutes = router;
