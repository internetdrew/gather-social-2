import ImageUploader from "@/components/ImageUploader";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import EventPasscodeForm from "./forms/EventPasscodeForm";
import { Skeleton } from "./ui/skeleton";

const EventWelcomeUserActions = ({ eventId }: { eventId: string }) => {
  const { data: isMember, isLoading: membershipLoading } = useQuery(
    trpc.eventMembership.isUserEventMember.queryOptions(
      {
        eventId,
      },
      {
        enabled: !!eventId,
      },
    ),
  );

  if (membershipLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      {isMember ? <ImageUploader /> : <EventPasscodeForm eventId={eventId} />}
    </div>
  );
};

export default EventWelcomeUserActions;
