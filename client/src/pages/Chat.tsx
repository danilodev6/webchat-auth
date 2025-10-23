import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { logout } from "../services/api.ts";

interface ChatPageProps {
  user: { id: string; email: string };
  onLogout: () => void;
}

interface Message {
  email: string;
  text: string;
  content?: string;
  created_at?: string;
}

export default function Chat({ user, onLogout }: ChatPageProps) {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const newSocket = io("https://webchat-backend-d7v2.onrender.com", {
      auth: {
        userId: user.id,
        email: user.email,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      console.log("Loaded previous messages:", previousMessages.length);
      const normalized = previousMessages.map((msg) => ({
        email: msg.email,
        text: msg.content || msg.text,
        created_at: msg.created_at,
      }));
      setMessages(normalized);
    });

    newSocket.on("message", (msg: Message) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user.id, user.email]);

  const sendMessageEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      socket.emit("message", input);
      setInput("");
    }
  };

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
    console.log("Logout successful!");
  };

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white mr-40">Chat Room</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="text-left  bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet...</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((msg, i) => (
              <li key={i} className="border-b border-sky-400">
                <p className="text-gray-800 ">{msg.email}</p>
                <p className="text-black">{msg.text}</p>
              </li>
            ))}
          </ul>
        )}
        {/* Div for scrolling to the latest message */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 text-black">
        <input
          type="text"
          onKeyDown={sendMessageEnter}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#662249]"
        />
        <button onClick={sendMessage} className="px-6 py-2 bg-[#44174E] text-white rounded-md hover:bg-[#662249]">
          Send
        </button>
      </div>
    </div>
  );
}
