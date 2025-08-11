import type { Tables } from "../../../shared/database.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventActivatetionAlertDialogProps {
  event: Tables<"events">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventActivatetionAlertDialog = ({
  event,
  open,
  onOpenChange,
}: EventActivatetionAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You're about to activate <em>{event.title}</em>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            Doing so will take you to a checkout page where you can pay for the
            event gallery access. Once you've paid, your gallery will be active
            for the next 30 days, after which it will be deactivated. Do not
            purchase if you're more than 30 days away from your event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventActivatetionAlertDialog;
