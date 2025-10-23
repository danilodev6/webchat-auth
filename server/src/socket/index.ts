import type { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { setupChatHandlers } from "./handlers/chat.ts";

// --- HTTP + WebSocket server ---

export function StartSocketServer(server: httpServer) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://webchat-frontend-96ns.onrender.com"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("a user connected");
    setupChatHandlers(io, socket);
    socket.on("disconnect", () => console.log("user disconnected"));
  });

  return io;
}
