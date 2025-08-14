import EventWelcomeCard from "@/components/EventWelcomeCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";

const Event = () => {
  const { eventId } = useParams();

  const { data: event, isLoading } = useQuery(
    trpc.event.getById.queryOptions({
      eventId: eventId ?? "",
    }),
  );

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col px-4">
        <Skeleton className="mx-auto mt-32 h-56 w-96" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen flex-col px-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Event not found</CardTitle>
            <CardDescription>
              The event you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="link" asChild className="mx-auto text-pink-600">
              <Link to="/">Go back to home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col px-4">
      <EventWelcomeCard event={event} />
    </div>
  );
};

export default Event;
