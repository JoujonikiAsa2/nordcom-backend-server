import express from "express";
import { UserRoutes } from "../modules/User/User.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AdminMangementRoutes } from "../modules/AdminManagement/AdminManagement.routes";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
