import type { Tables } from "shared/database.types";
import EventCard from "./EventCard";

const EventList = ({
  events,
  onEditClick,
  onDeleteClick,
}: {
  events: Tables<"events">[];
  onEditClick: (event: Tables<"events">) => void;
  onDeleteClick: (event: Tables<"events">) => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default EventList;
