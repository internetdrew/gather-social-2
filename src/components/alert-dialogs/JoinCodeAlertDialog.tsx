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
type JoinCodeOutput = RouterOutput["joinCode"]["createCode"];

const JoinCodeAlertDialog = ({
  joinCode,
  open,
  onOpenChange,
}: {
  joinCode: JoinCodeOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyCode = async () => {
    if (!joinCode.code) {
      toast.error("No join code found");
      return;
    }

    try {
      await navigator.clipboard.writeText(joinCode.code);
      setCopied(true);
      toast.success("Your join code has been copied to your clipboard");
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
            Your join code for{" "}
            <em className="text-pink-600">{joinCode.event.title}</em> is ready.
          </AlertDialogTitle>
          <AlertDialogDescription>
            This code is unique, case-sensitive, and{" "}
            <strong>will only be shown once</strong>.
            <br />
            <br />
            Copy it now and keep it somewhere safe. If it's lost, you'll need to
            generate a new one and share that with your guests.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 space-y-2">
          <Label htmlFor="join-code">Join Code</Label>
          <div className="flex">
            <Input
              id="join-code"
              value={joinCode.code}
              readOnly
              className="font-mono text-sm"
              aria-label="Join Code"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-2 flex-shrink-0"
              onClick={handleCopyCode}
              aria-label={copied ? "Join code copied" : "Copy join code"}
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
            I have copied and saved the join code.
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

export default JoinCodeAlertDialog;
