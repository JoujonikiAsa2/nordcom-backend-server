"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const client_1 = require("@prisma/client");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_zodvalidation_1 = require("./newsletter.zodvalidation");
const router = express_1.default.Router();
router.get("/", newsletter_controller_1.NewsletterControllers.GetNewsletters);
router.post("/", (0, authGurd_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(newsletter_zodvalidation_1.NewsletterSchemas.createNewsletterSchema), newsletter_controller_1.NewsletterControllers.CreateNewsletter);
router.delete("/delete/:id", (0, authGurd_1.default)(client_1.UserRole.ADMIN), newsletter_controller_1.NewsletterControllers.DeleteNewsletter);
router.get("/:email", newsletter_controller_1.NewsletterControllers.GetNewsletterByEmail);
exports.NewsletterRoutes = router;
