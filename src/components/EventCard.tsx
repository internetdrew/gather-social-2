import type { Tables } from "shared/database.types";
import { Button } from "./ui/button";
import { format } from "date-fns";
const EventCard = ({
  event,
  handleEventClick,
}: {
  event: Tables<"events">;
  handleEventClick: (event: Tables<"events">) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <h3 className="text-lg font-bold">{event.title}</h3>
      <p className="text-sm text-gray-500">
        {format(event.date, "MMM d, yyyy")}
      </p>
      <Button onClick={() => handleEventClick(event)}>View event</Button>
    </div>
  );
};

export default EventCard;
