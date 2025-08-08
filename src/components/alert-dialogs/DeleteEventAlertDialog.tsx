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
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import type { Tables } from "shared/database.types";
import { toast } from "sonner";

interface DeleteEventAlertDialogProps {
  event: Tables<"events">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteEventAlertDialog = ({
  event,
  open,
  onOpenChange,
}: DeleteEventAlertDialogProps) => {
  const deleteEventMutation = useMutation(trpc.event.delete.mutationOptions());

  const handleDeleteEvent = () => {
    deleteEventMutation.mutate(
      { id: event.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("Event deleted successfully");
          queryClient.invalidateQueries(trpc.event.list.queryOptions());
        },
        onError: (error) => {
          console.error(error);
          toast.error(
            "Uh oh! Something went wrong while attempting to delete the event.",
          );
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete{" "}
            <span className="text-destructive">{event.title}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event
            and all of it's associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteEvent}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEventAlertDialog;
