import express from "express";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth.ts";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { sessionMiddleware } from "./middleware/auth.ts";
import { StartSocketServer } from "./socket/index.ts";

export function startServer() {
  const port = process.env.PORT || 3000;
  const app = express();

  app.use(cors({ origin: ["http://localhost:5173", "https://webchat-frontend-96ns.onrender.com"], credentials: true }));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(sessionMiddleware);

  app.use("/api/auth", authRoutes);

  const server = createServer(app);
  StartSocketServer(server);

  // --- Routes ---
  app.get("/", (req, res) => {
    res.sendFile(new URL("../../client/index.html", import.meta.url).pathname);
  });

  // --- Start ---
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}
