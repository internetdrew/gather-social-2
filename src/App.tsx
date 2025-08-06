import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="flex h-screen flex-col font-mono">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
