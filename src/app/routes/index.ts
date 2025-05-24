import express from "express";
import { UserRoutes } from "../modules/User/User.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AdminMangementRoutes } from "../modules/AdminManagement/AdminManagement.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
