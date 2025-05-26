"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const adminManagement_routes_1 = require("../modules/adminManagement/adminManagement.routes");
const brand_route_1 = require("../modules/brand/brand.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const payment_routes_1 = require("../modules/payment/payment.routes");
const analytic_route_1 = require("../modules/analytic/analytic.route");
const favoriteProduct_route_1 = require("../modules/favoriteProduct/favoriteProduct.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const orders_routes_1 = require("../modules/orders/orders.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/admin",
        route: adminManagement_routes_1.AdminMangementRoutes,
    },
    {
        path: "/cart",
        route: cart_routes_1.cartRoutes,
    },
    {
        path: "/order",
        route: orders_routes_1.OrderRoutes,
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
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes,
    },
    {
        path: "/analytic-data",
        route: analytic_route_1.AnalyticRoutes,
    },
    {
        path: "/favorite-product",
        route: favoriteProduct_route_1.FavoriteProductRoutes,
    },
    {
        path: "/newsletter",
        route: newsletter_route_1.NewsletterRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
