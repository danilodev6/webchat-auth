import { Server, Socket } from "socket.io";

export function setupChatHandlers(io: Server, socket: Socket) {
  const userId = socket.handshake.auth?.userId;
  const userEmail = socket.handshake.auth?.email;

  console.log("User connected to chat:", { userId, userEmail });

  socket.on("message", (text: string) => {
    const message = {
      email: userEmail || "Anonymous",
      text: text,
    };

    // console.log("Broadcasting message:", message);

    io.emit("message", message);
  });
}
