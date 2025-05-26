import { z } from "zod";

export const createNewsletterSchema = z.object({
  email: z.string({ required_error: "Name is required" })
});

export const updateNewsletterSchema = z.object({
  email: z.string().optional(),
});

export const NewsletterSchemas = {
  createNewsletterSchema,
  updateNewsletterSchema
};
