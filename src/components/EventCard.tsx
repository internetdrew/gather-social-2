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
import { EllipsisVerticalIcon, Users, Shield, Calendar } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
const EventCard = ({
  event,
  onEditClick,
  onDeleteClick,
  onActivateClick,
}: {
  event: Tables<"events">;
  onEditClick: (event: Tables<"events">) => void;
  onDeleteClick: (event: Tables<"events">) => void;
  onActivateClick: (event: Tables<"events">) => void;
}) => {
  const { data: userCredits, isLoading: userCreditsLoading } = useQuery(
    trpc.credit.fetchUserCredits.queryOptions(),
  );

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
          {event.trust_level === "HIGH" ? (
            <div className="flex items-center gap-1 text-green-600">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Familiar crowd</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Unfamiliar crowd</span>
            </div>
          )}
        </div>
        {userCreditsLoading ? (
          <Skeleton className="h-6 w-20 rounded-sm" />
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={userCredits?.credits_remaining === 0}
            onClick={() => onActivateClick(event)}
          >
            Activate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
