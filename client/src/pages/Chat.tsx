import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { logout } from "../services/api";

interface ChatPageProps {
  user: { id: string; email: string };
  onLogout: () => void;
}

export default function Chat({ user, onLogout }: ChatPageProps) {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Connect to socket.io server
    const newSocket = io("http://localhost:3000", {
      auth: { userId: user.id },
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user.id]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  const handleLogout = async () => {
    await logout();
    socket?.close();
    onLogout();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat Room</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user.email}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-2 p-2 bg-gray-100 rounded">
              {msg}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}
