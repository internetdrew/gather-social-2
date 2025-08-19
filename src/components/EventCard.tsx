import type { Tables } from "shared/database.types";
import { Button } from "./ui/button";
import { format } from "date-fns";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardAction,
  CardFooter,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EllipsisVerticalIcon, Calendar } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router";

const EventCard = ({
  event,
  onEditClick,
  onDeleteClick,
  onActivateClick,
  onInviteClick,
}: {
  event: Tables<"events">;
  onEditClick: (event: Tables<"events">) => void;
  onDeleteClick: (event: Tables<"events">) => void;
  onActivateClick: (event: Tables<"events">) => void;
  onInviteClick: (event: Tables<"events">) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="inline size-3.5" />
          {format(event.date, "MMM d, yyyy")}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditClick(event)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteClick(event)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          {event.status === "ACTIVE" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onInviteClick(event)}
            >
              Invite Guests
            </Button>
          )}
        </div>
        <EventCardCTA event={event} onActivateClick={onActivateClick} />
      </CardFooter>
    </Card>
  );
};

export default EventCard;

const EventCardCTA = ({
  event,
  onActivateClick,
}: {
  event: Tables<"events">;
  onActivateClick: (event: Tables<"events">) => void;
}) => {
  const { data: userCredits, isLoading: userCreditsLoading } = useQuery(
    trpc.credit.getAvailableCredits.queryOptions(),
  );

  if (userCreditsLoading) {
    return <Skeleton className="h-6 w-20 rounded-sm" />;
  }

  return event.status === "ACTIVE" ? (
    <Button size="sm" className="text-xs" asChild>
      <Link to={`/events/${event.id}/admin/gallery`}>Visit Gallery</Link>
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      className="text-xs"
      disabled={userCredits === 0}
      onClick={() => onActivateClick(event)}
    >
      Activate
    </Button>
  );
};
