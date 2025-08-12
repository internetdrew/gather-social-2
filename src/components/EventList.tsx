import type { Tables } from "shared/database.types";
import EventCard from "./EventCard";
import EventActivatetionAlertDialog from "./alert-dialogs/EventActivatetionAlertDialog";
import { useState } from "react";

const EventList = ({
  events,
  onEditClick,
  onDeleteClick,
}: {
  events: Tables<"events">[];
  onEditClick: (event: Tables<"events">) => void;
  onDeleteClick: (event: Tables<"events">) => void;
}) => {
  const [renderActivationAlertDialog, setRenderActivationAlertDialog] =
    useState(false);
  const [eventToActivate, setEventToActivate] =
    useState<Tables<"events"> | null>(null);

  const handleActivateClick = (event: Tables<"events">) => {
    setEventToActivate(event);
    setRenderActivationAlertDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onActivateClick={handleActivateClick}
          />
        ))}
      </div>
      {eventToActivate && (
        <EventActivatetionAlertDialog
          event={eventToActivate}
          open={renderActivationAlertDialog}
          onOpenChange={setRenderActivationAlertDialog}
        />
      )}
    </>
  );
};

export default EventList;
