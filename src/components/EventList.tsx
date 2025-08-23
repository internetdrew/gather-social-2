import type { Tables } from "shared/database.types";
import EventCard from "./EventCard";
import EventActivationAlertDialog from "./alert-dialogs/EventActivationAlertDialog";
import { useState } from "react";
import EventInviteDialog from "./dialogs/EventInviteDialog";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../server/index";
import PasscodeAlertDialog from "./alert-dialogs/PasscodeAlertDialog";

type PasscodeOutput = inferRouterOutputs<AppRouter>["passcode"]["create"];

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
  const [newPasscode, setNewPasscode] = useState<PasscodeOutput | null>(null);
  const [renderInviteDialog, setRenderInviteDialog] = useState(false);
  const [renderActivationAlertDialog, setRenderActivationAlertDialog] =
    useState(false);
  const [renderPasscodeAlertDialog, setRenderPasscodeAlertDialog] =
    useState(false);

  const handleActivateClick = (event: Tables<"events">) => {
    setEventSelectedForActivation(event);
    setRenderActivationAlertDialog(true);
  };

  const handleInviteClick = (event: Tables<"events">) => {
    setEventSelectedForInvite(event);
    setRenderInviteDialog(true);
  };

  const handleSuccessfulActivation = (passcode: PasscodeOutput) => {
    setNewPasscode(passcode);
    setRenderPasscodeAlertDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
        <EventActivationAlertDialog
          event={eventSelectedForActivation}
          open={renderActivationAlertDialog}
          onOpenChange={setRenderActivationAlertDialog}
          onSuccessfulActivation={handleSuccessfulActivation}
        />
      )}

      {eventSelectedForInvite && (
        <EventInviteDialog
          event={eventSelectedForInvite}
          open={renderInviteDialog}
          onOpenChange={setRenderInviteDialog}
        />
      )}

      {newPasscode && (
        <PasscodeAlertDialog
          passcodeData={newPasscode}
          open={renderPasscodeAlertDialog}
          onOpenChange={setRenderPasscodeAlertDialog}
        />
      )}
    </>
  );
};

export default EventList;
