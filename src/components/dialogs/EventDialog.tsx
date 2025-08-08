import { type Tables } from "shared/database.types";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../ui/dialog";
import EventDetailsForm from "@/forms/EventDetailsForm";

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
          <DialogTitle>{event ? "Edit event" : "Create an event"}</DialogTitle>
          <DialogDescription>
            Once you create an event,you can activate it whenever you'd like and
            others will have access to it for up to 30 days.
          </DialogDescription>
        </DialogHeader>
        <EventDetailsForm
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
