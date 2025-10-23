import { Server, Socket } from "socket.io";
import { db } from "../../db/init-db.ts";

export function setupChatHandlers(io: Server, socket: Socket) {
  const userId = socket.handshake.auth?.userId;
  const userEmail = socket.handshake.auth?.email;

  console.log("User connected to chat:", { userId, userEmail });

  // Send previous messages when user connects
  (async () => {
    try {
      const result = await db.execute({
        sql: "SELECT email, content, created_at FROM messages ORDER BY created_at ASC LIMIT 50",
        args: [],
      });

      // Send all previous messages to this specific client
      socket.emit("previous-messages", result.rows);
    } catch (error) {
      console.error("Failed to fetch previous messages:", error);
    }
  })();

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
