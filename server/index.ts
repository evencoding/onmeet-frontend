import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Initialize Sentry for Node.js
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });
}

export function createServer() {
  const app = express();

  // Middleware
  if (process.env.SENTRY_DSN && Sentry.Handlers?.requestHandler) {
    app.use(Sentry.Handlers.requestHandler());
  }
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Sentry error handler - must be last
  if (process.env.SENTRY_DSN && Sentry.Handlers?.errorHandler) {
    app.use(Sentry.Handlers.errorHandler());
  }

  return app;
}
