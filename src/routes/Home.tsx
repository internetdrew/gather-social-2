import EventDialog from "@/components/dialogs/EventDialog";
import NoEvents from "@/components/NoEvents";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Tables } from "../../shared/database.types";
import EventList from "@/components/EventList";

const Home = () => {
  const [renderEventDialog, setRenderEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Tables<"events"> | null>(
    null,
  );
  const { data: events } = useQuery(trpc.event.list.queryOptions());

  const handleEventClick = (event: Tables<"events">) => {
    setSelectedEvent(event);
    setRenderEventDialog(true);
  };

  return (
    <div className="px-4">
      {events && events.length > 0 ? (
        <EventList events={events} handleEventClick={handleEventClick} />
      ) : (
        <NoEvents setRenderEventDialog={setRenderEventDialog} />
      )}
      <EventDialog
        event={selectedEvent}
        open={renderEventDialog}
        onOpenChange={setRenderEventDialog}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
};

export default Home;
