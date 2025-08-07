import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { queryClient } from "../utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./routes/Home.tsx";
import RequireSignin from "./components/RequireSignin.tsx";
import { AuthProvider } from "./contexts/auth.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    ),
    children: [
      {
        path: "/",
        index: true,
        element: (
          <RequireSignin>
            <Home />
          </RequireSignin>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
