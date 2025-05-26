"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Define allowed origins
const allowedOrigins = ["http://localhost:3000", "https://nordcom-marketplace.vercel.app"];
// Single CORS configuration
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        }
        else {
            callback(new Error("The CORS policy does not allow this origin"), false);
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Test route
app.get("/", (req, res) => {
    res.send({
        Message: "Backend is running successfully smoothly 🏃🏻‍♂️‍➡️",
    });
});
// API routes
app.use("/api/v1", routes_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
