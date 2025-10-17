import "./App.css";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";

function App() {
  return (
    <>
      <h1 className="my-6">Web Chat App</h1>
      <div className="flex gap-10 justify-center">
        <Login />
        <Register />
      </div>
    </>
  );
}

export default App;
