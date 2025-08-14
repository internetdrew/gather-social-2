import { type Tables } from "../../../shared/database.types";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../ui/dialog";
import EventDetailsForm from "@/components/forms/EventDetailsForm";

interface EventDialogProps {
  event?: Tables<"events"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedEvent: (event: Tables<"events"> | null) => void;
}

const EventDialog = ({
  event,
  open,
  onOpenChange,
  setSelectedEvent,
}: EventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event ? "Update event details" : "Create an event"}
          </DialogTitle>
          <DialogDescription>
            {event
              ? "Update the details of your event."
              : "Create an event and share the link with others to allow them to join."}
          </DialogDescription>
        </DialogHeader>
        <EventDetailsForm
          event={event}
          onSuccess={() => {
            onOpenChange(false);
            setSelectedEvent(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
