import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controllers";
import { AuthSchemas } from "./Auth.ZodValidations";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthSchemas.loginSchema),
  AuthControllers.login
);

router.patch("/forgot-password", AuthControllers.forgotPassword);
router.patch("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;
