import { queryClient, trpc } from "@/utils/trpc";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/index";

type PasscodeData = inferRouterOutputs<AppRouter>["passcode"]["create"];

interface EventActivationAlertDialogProps {
  event: Tables<"events">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessfulActivation: (passcodeData: PasscodeData) => void;
}

const EventActivationAlertDialog = ({
  event,
  open,
  onOpenChange,
  onSuccessfulActivation,
}: EventActivationAlertDialogProps) => {
  const activateEventMutation = useMutation(
    trpc.event.activate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.event.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.credit.getAvailableCredits.queryKey(),
        });
      },
      onError: (error) => {
        console.error("Error activating event:", error);
        toast.error(
          "Uh oh! Something went wrong while attempting to activate the event.",
        );
      },
    }),
  );
  const qrCodeMutation = useMutation(
    trpc.qr.generateEventQRCode.mutationOptions(),
  );
  const createPasscodeMutation = useMutation(
    trpc.passcode.create.mutationOptions({
      onSuccess: (passcodeData) => {
        onSuccessfulActivation(passcodeData);
      },
    }),
  );

  const pending = activateEventMutation.isPending || qrCodeMutation.isPending;

  const handleActivateEvent = async () => {
    try {
      await activateEventMutation.mutateAsync({ id: event.id });
      await createPasscodeMutation.mutateAsync({ eventId: event.id });
      await qrCodeMutation.mutateAsync(
        {
          eventId: event.id,
          baseUrl: window.location.origin,
        },
        {
          onSuccess: () => {
            toast.success("Event activated successfully");
            onOpenChange(false);
          },
          onError: (qrError) => {
            console.error("QR code generation failed:", qrError);
            toast.warning(
              "Event activated successfully, but QR code generation failed.",
            );
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Uh oh! Something went wrong while attempting to activate the event.",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You're about to activate <em>{event.title}</em>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            This will activate your event gallery for 30 days. After 30 days, it
            will automatically deactivate. <br />
            <br />
            <span className="font-bold text-pink-600">Important:</span> Once
            activated, this cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivateEvent} disabled={pending}>
            {pending ? "Activating..." : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EventActivationAlertDialog;
