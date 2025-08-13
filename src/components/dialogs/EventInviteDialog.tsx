import type { Tables } from "shared/database.types";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../ui/dialog";

interface EventInviteDialogProps {
  event: Tables<"events">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventInviteDialog = ({
  event,
  open,
  onOpenChange,
}: EventInviteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite guests to <em>{event.title}</em>
          </DialogTitle>
          <DialogDescription>
            Share the link with others to allow them to join.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EventInviteDialog;
