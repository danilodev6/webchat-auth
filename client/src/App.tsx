import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { getCurrentUser, logout } from "./services/api.ts";
import type { JwtPayload } from "../../server/src/types/session.ts";
import Home from "./pages/Home.tsx";
import Chat from "./pages/Chat.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

function App() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <h1 className="my-6">Web Chat App</h1>
        <div className="flex gap-10 justify-center">
          <Login onSuccess={handleAuthSuccess} />
          <Register onSuccess={handleAuthSuccess} />
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home page - login/register */}
        <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Home onAuthSuccess={handleAuthSuccess} />} />

        {/* Chat page - protected route */}
        <Route
          path="/chat"
          element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
