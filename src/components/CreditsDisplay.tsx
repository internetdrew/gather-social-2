import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

const CreditsDisplay = () => {
  const { data: userCredits, isLoading: userCreditsLoading } = useQuery(
    trpc.credit.getAvailableCredits.queryOptions(),
  );

  if (userCreditsLoading) {
    return <Skeleton className="h-4 w-16 rounded-sm" />;
  }

  return (
    <span className="text-muted-foreground text-sm">
      Credits: {userCredits || 0}
    </span>
  );
};

export default CreditsDisplay;
