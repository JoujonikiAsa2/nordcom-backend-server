"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterSchemas = exports.updateNewsletterSchema = exports.createNewsletterSchema = void 0;
const zod_1 = require("zod");
exports.createNewsletterSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Name is required" })
});
exports.updateNewsletterSchema = zod_1.z.object({
    email: zod_1.z.string().optional(),
});
exports.NewsletterSchemas = {
    createNewsletterSchema: exports.createNewsletterSchema,
    updateNewsletterSchema: exports.updateNewsletterSchema
};
