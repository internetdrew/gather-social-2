import type { Tables } from "shared/database.types";
import EventCard from "./EventCard";

const EventList = ({
  events,
  handleEventClick,
}: {
  events: Tables<"events">[];
  handleEventClick: (event: Tables<"events">) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          handleEventClick={handleEventClick}
        />
      ))}
    </div>
  );
};

export default EventList;
