import { useEffect, useRef, useState } from "react";
import type { Tables } from "shared/database.types";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [qrStatus, setQrStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventUrl = `${window.location.origin}/events/${event.id}`;

  const handleDownloadQRCode = async () => {
    if (!event.qr_code_url) return;

    try {
      const res = await fetch(event.qr_code_url);
      if (!res.ok) throw new Error("Failed to fetch QR code");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${event.title}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      toast.success("QR code downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Unable to download QR code. Please try manually.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      toast.success("Event link copied to clipboard");
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!event.qr_code_url) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = event.qr_code_url;

    if (!document.head.contains(link)) {
      document.head.appendChild(link);
    }

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [event.qr_code_url]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Invite guests to <em>{event.title}</em>
          </DialogTitle>
          <DialogDescription>
            Guests can find your event page by using the link below or by
            scanning the QR code.
          </DialogDescription>
          <div className="mt-4 flex justify-center">
            {qrStatus === "loading" && (
              <div role="status" aria-live="polite">
                Loading QR code...
              </div>
            )}
            {qrStatus === "error" && (
              <div role="status" aria-live="polite">
                QR code unavailable
              </div>
            )}
            <img
              src={event.qr_code_url ?? ""}
              alt={`QR code for event ${event.id}`}
              className={`h-auto w-full max-w-56 ${qrStatus === "loaded" ? "block" : "hidden"} select-none`}
              onLoad={() => setQrStatus("loaded")}
              onError={() => setQrStatus("error")}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="event-link">Event Link</Label>
            <div className="flex">
              <Input
                id="event-link"
                value={eventUrl}
                readOnly
                className="font-mono text-sm"
                aria-label="Event URL"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-2 flex-shrink-0"
                onClick={handleCopyLink}
                aria-label={copied ? "Link copied" : "Copy event link"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button className="flex-1" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy event link"}
            </Button>
            <Button className="flex-1" onClick={handleDownloadQRCode}>
              Download QR code
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EventInviteDialog;
