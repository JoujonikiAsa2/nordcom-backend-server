import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

// Define allowed origins
const allowedOrigins = ["http://localhost:3000"];

// Single CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(
          new Error("The CORS policy does not allow this origin"),
          false
        );
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Backend is running successfully 🏃🏻‍♂️‍➡️",
  });
});

// API routes
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
