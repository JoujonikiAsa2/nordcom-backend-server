"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_routes_1 = require("../modules/User/User.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const AdminManagement_routes_1 = require("../modules/AdminManagement/AdminManagement.routes");
const brand_route_1 = require("../modules/brand/brand.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/admin",
        route: AdminManagement_routes_1.AdminMangementRoutes,
    },
    {
        path: "/brand",
        route: brand_route_1.BrandRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/product",
        route: product_route_1.ProductRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
