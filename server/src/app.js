import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(clerkMiddleware());


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

export { app };