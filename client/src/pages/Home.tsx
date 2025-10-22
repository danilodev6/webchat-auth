import Login from "../components/Login";
import Register from "../components/Register";

interface HomePageProps {
  onAuthSuccess: () => void;
}

export default function Home({ onAuthSuccess }: HomePageProps) {
  return (
    <>
      <h1 className="my-6">Web Chat App</h1>
      <div className="flex gap-10 justify-center">
        <Login onSuccess={onAuthSuccess} />
        <Register onSuccess={onAuthSuccess} />
      </div>
    </>
  );
}
