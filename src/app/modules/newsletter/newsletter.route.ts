import express from "express";
import validateRequest from "../../middleware/validateRequest";
import AuthGurd from "../../middleware/authGurd";
import { UserRole } from "@prisma/client";
import { NewsletterControllers } from "./newsletter.controller";
import { NewsletterSchemas } from "./newsletter.zodvalidation";

const router = express.Router();

router.get("/", AuthGurd(UserRole.ADMIN), NewsletterControllers.GetNewsletters);

router.post(
  "/",

  validateRequest(NewsletterSchemas.createNewsletterSchema),
  NewsletterControllers.CreateNewsletter
);

router.delete(
  "/delete/:id",
  AuthGurd(UserRole.ADMIN),
  NewsletterControllers.DeleteNewsletter
);
router.get(
  "/:email",
  AuthGurd(UserRole.ADMIN),
  NewsletterControllers.GetNewsletterByEmail
);

export const NewsletterRoutes = router;
