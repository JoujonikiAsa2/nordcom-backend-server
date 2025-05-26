"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const globalErrorHandler = (error, req, res, next) => {
    const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    let message = (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong";
    const stack = (error === null || error === void 0 ? void 0 : error.stack) || "No stack trace available";
    // Check if the error is an instance of ZodError
    if ((error === null || error === void 0 ? void 0 : error.name) === "ZodError") {
        message = "";
        error.issues.forEach((issue) => {
            message += `${issue.path[0]} ${issue.message} `;
        });
    }
    console.log("hallo", { message, error });
    res.status(statusCode).json({
        success: false,
        message: message || "Something went wrong",
        error: error,
        stack: config_1.default.env === "development" ? stack : undefined,
    });
};
exports.default = globalErrorHandler;
