import { Server, Socket } from "socket.io";
import { db } from "../../db/init-db.ts";

export function setupChatHandlers(io: Server, socket: Socket) {
  const userId = socket.handshake.auth?.userId;
  const userEmail = socket.handshake.auth?.email;

  console.log("User connected to chat:", { userId, userEmail });

  socket.on("message", (text: string) => {
    const message = {
      email: userEmail || "Anonymous",
      text: text,
    };

    // inserting messages to db for data persistence
    try {
      db.execute({
        sql: "INSERT INTO messages (email, content) VALUES (?, ?)",
        args: [message.email, message.text],
      });
    } catch (error) {
      console.error("Failed to save message to database:", error);
    }

    // console.log("Broadcasting message:", message);

    io.emit("message", message);
  });
}
