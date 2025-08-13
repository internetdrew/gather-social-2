import type { Tables } from "shared/database.types";
import EventCard from "./EventCard";
import EventActivatetionAlertDialog from "./alert-dialogs/EventActivatetionAlertDialog";
import { useState } from "react";
import EventInviteDialog from "./dialogs/EventInviteDialog";

const EventList = ({
  events,
  onEditClick,
  onDeleteClick,
}: {
  events: Tables<"events">[];
  onEditClick: (event: Tables<"events">) => void;
  onDeleteClick: (event: Tables<"events">) => void;
}) => {
  const [eventSelectedForInvite, setEventSelectedForInvite] =
    useState<Tables<"events"> | null>(null);
  const [eventSelectedForActivation, setEventSelectedForActivation] =
    useState<Tables<"events"> | null>(null);
  const [renderInviteDialog, setRenderInviteDialog] = useState(false);
  const [renderActivationAlertDialog, setRenderActivationAlertDialog] =
    useState(false);

  const handleActivateClick = (event: Tables<"events">) => {
    setEventSelectedForActivation(event);
    setRenderActivationAlertDialog(true);
  };

  const handleInviteClick = (event: Tables<"events">) => {
    setEventSelectedForInvite(event);
    setRenderInviteDialog(true);
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
            onInviteClick={handleInviteClick}
          />
        ))}
      </div>

      {eventSelectedForActivation && (
        <EventActivatetionAlertDialog
          event={eventSelectedForActivation}
          open={renderActivationAlertDialog}
          onOpenChange={setRenderActivationAlertDialog}
        />
      )}

      {eventSelectedForInvite && (
        <EventInviteDialog
          event={eventSelectedForInvite}
          open={renderInviteDialog}
          onOpenChange={setRenderInviteDialog}
        />
      )}
    </>
  );
};

export default EventList;
