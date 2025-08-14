import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type RouterOutput = inferRouterOutputs<AppRouter>;
type PasscodeData = RouterOutput["passcode"]["create"];

const PasscodeAlertDialog = ({
  passcodeData,
  open,
  onOpenChange,
}: {
  passcodeData: PasscodeData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyCode = async () => {
    if (!passcodeData.code) {
      toast.error("No passcode found");
      return;
    }

    try {
      await navigator.clipboard.writeText(passcodeData.code);
      setCopied(true);
      toast.success("Your passcode has been copied to your clipboard");
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
      toast.error("Failed to copy code");
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Your passcode for{" "}
            <em className="text-pink-600">{passcodeData.event.title}</em> is
            ready.
          </AlertDialogTitle>
          <AlertDialogDescription>
            This code is unique, case-sensitive, and{" "}
            <strong>will only be shown once</strong>.
            <br />
            <br />
            Save this passcode now - you won't be able to view it again. If
            lost, you can generate a new passcode, but you'll need to share the
            new one with your guests. Note: Guests who already joined with the
            previous passcode will keep their access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 space-y-2">
          <Label htmlFor="passcode">Passcode</Label>
          <div className="flex">
            <Input
              id="passcode"
              value={passcodeData.code}
              readOnly
              className="font-mono text-sm"
              aria-label="Passcode"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-2 flex-shrink-0"
              onClick={handleCopyCode}
              aria-label={copied ? "Passcode copied" : "Copy passcode"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            id="codeCopied"
            checked={copyConfirmed}
            onCheckedChange={(checked) =>
              setCopyConfirmed(checked === "indeterminate" ? false : checked)
            }
          />
          <Label htmlFor="codeCopied" className="text-sm">
            I confirm I have copied and saved the passcode.
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction disabled={!copyConfirmed}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasscodeAlertDialog;
