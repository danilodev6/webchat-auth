import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import logger from "morgan";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth";

export function startServer() {
  const port = process.env.PORT || 3000;
  const app = express();

  app.use(cors);
  app.use(logger("dev"));
  app.use(express.json());
  app.use("/api/auth", authRoutes);

  // --- Routes ---
  app.get("/", (req, res) => {
    res.sendFile(new URL("../../client/index.html", import.meta.url).pathname);
  });

  app.post("/login", (req, res) => {
    res.send("Login endpoint");
  });

  app.post("/register", async (req, res) => {
    res.send("Register endpoint");
  });

  app.post("/logout", (req, res) => {
    res.send("Logout endpoint");
  });

  app.get("/messages", (req, res) => {
    res.send("Get messages endpoint");
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
