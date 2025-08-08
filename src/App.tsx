import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen flex-col">
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
