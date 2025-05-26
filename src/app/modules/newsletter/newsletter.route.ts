import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";
import { NewsletterControllers } from "./newsletter.controller";
import { NewsletterSchemas } from "./newsletter.zodvalidation";

const router = express.Router();

router.get("/", NewsletterControllers.GetNewsletters);

router.post(
  "/",
  AuthGurd(UserRole.ADMIN),
  validateRequest(NewsletterSchemas.createNewsletterSchema),
  NewsletterControllers.CreateNewsletter
);

router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN),
  NewsletterControllers.DeleteNewsletter
);
router.get("/:email", NewsletterControllers.GetNewsletterByEmail);

export const NewsletterRoutes = router;
