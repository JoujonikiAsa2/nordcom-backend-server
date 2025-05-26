import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { AdminMangementRoutes } from "../modules/adminManagement/adminManagement.routes";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.route";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { AnalyticRoutes } from "../modules/analytic/analytic.route";
import { FavoriteProductRoutes } from "../modules/favoriteProduct/favoriteProduct.route";
import { NewsletterRoutes } from "../modules/newsletter/newsletter.route";
import { OrderRoutes } from "../modules/orders/orders.routes";
import { cartRoutes } from "../modules/cart/cart.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminMangementRoutes,
  },

  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/analytic-data",
    route: AnalyticRoutes,
  },
  {
    path: "/favorite-product",
    route: FavoriteProductRoutes,
  },
  {
    path: "/newsletter",
    route: NewsletterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
