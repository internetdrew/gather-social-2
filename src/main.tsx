import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { queryClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./routes/Home.tsx";
import RequireSignin from "./components/route-guards/RequireSignin.tsx";
import { AuthProvider } from "./contexts/auth.tsx";
import Event from "./routes/Event.tsx";
import EventGallery from "./routes/EventGallery.tsx";
import EventAdminGallery from "./routes/EventAdminGallery.tsx";
import AdminRouteGuard from "./components/route-guards/AdminRouteGuard.tsx";

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
      {
        path: "/events/:eventId",
        element: <Event />,
      },
      {
        path: "/events/:eventId/gallery",
        element: (
          <RequireSignin>
            <EventGallery />
          </RequireSignin>
        ),
      },
      {
        path: "/events/:eventId/admin",
        element: <AdminRouteGuard />,
        children: [
          {
            path: "gallery",
            element: <EventAdminGallery />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
