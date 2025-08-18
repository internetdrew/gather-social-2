import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams();
  console.log(`Checking admin rights for event ID: ${eventId}`);

  const { data: isAdmin, isLoading } = useQuery(
    trpc.eventMembership.isAdmin.queryOptions(
      { eventId: eventId ?? "" },
      { enabled: !!eventId },
    ),
  );

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default RequireAdmin;
