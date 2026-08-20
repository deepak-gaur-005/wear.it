import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { ApiResponse } from "./utils/ApiResponse.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler} from "./middlewares/errorHandler.middleware.js";

import { clerkMiddleware } from "@clerk/express";
import { authRouter } from "./routes/auth/auth.routes.js";


const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGINS.split(",") || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));

//clerk
app.use(clerkMiddleware());

//health check
app.get("/health", (req, res) => {
    res.status(200).json({
        statusCode: 200,
        data: {
            message: "server is healthy",
        },
        message: "Success",
        success: true,
    });
});

//Auth Routes
app.use("/auth", authRouter);

//404 handler'
app.use(notFound);

//Error handler - MUST be at the end
app.use(errorHandler)

export { app };