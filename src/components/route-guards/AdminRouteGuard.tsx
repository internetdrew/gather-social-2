import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useParams } from "react-router";

const AdminRouteGuard = () => {
  const { eventId } = useParams();

  const { data: isAdmin, isLoading } = useQuery(
    trpc.eventMembership.isAdmin.queryOptions(
      { eventId: eventId ?? "" },
      { enabled: !!eventId },
    ),
  );

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRouteGuard;
