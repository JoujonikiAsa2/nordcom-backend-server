import express from "express";
import { UserRoutes } from "../modules/User/User.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AdminMangementRoutes } from "../modules/AdminManagement/AdminManagement.routes";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
