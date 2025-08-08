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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
