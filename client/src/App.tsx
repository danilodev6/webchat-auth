import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { getCurrentUser, logout } from "./services/api.ts";
import type { JwtPayload } from "../../server/src/types/session.ts";

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
    <div className="p-8">
      <h1>Welcome, {user.email}!</h1>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Logout
      </button>
    </div>
  );
}

export default App;
