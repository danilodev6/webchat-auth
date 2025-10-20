import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth.ts";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middleware/auth.ts";

export function startServer() {
  const port = process.env.PORT || 3000;
  const app = express();

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(sessionMiddleware);

  app.use("/api/auth", authRoutes);

  // --- Getting current user ---
  app.get("/api/auth/me", (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ user: null });
    }
    res.json({ user: req.session.user });
  });

  // --- Routes ---
  app.get("/", (req, res) => {
    res.sendFile(new URL("../../client/index.html", import.meta.url).pathname);
  });

  // --- HTTP + WebSocket server ---
  const server = createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => console.log("user disconnected"));
  });

  // --- Start ---
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

// export interface JwtPayload {
//   id: string;
//   email: string;
// }
//
// export interface SessionData {
//   user: JwtPayload | null;
// }
