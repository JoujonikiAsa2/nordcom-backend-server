import { ErrorRequestHandler } from "express";
import config from "../../config";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error?.statusCode || 500;
  let message = error?.message || "Something went wrong";
  const stack = error?.stack || "No stack trace available";
  // Check if the error is an instance of ZodError
  if (error?.name === "ZodError") {
    message = "";
    error.issues.forEach((issue: any) => {
      message += `${issue.path[0]} ${issue.message} `;
    });
  }
  console.log("hallo", { message, error });
  res.status(statusCode).json({
    success: false,
    message: message || "Something went wrong",
    error: error,
    stack: config.env === "development" ? stack : undefined,
  });
};

export default globalErrorHandler;
