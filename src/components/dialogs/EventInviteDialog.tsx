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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router";

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
  const [isCopied, setIsCopied] = useState(false);
  const [qrStatus, setQrStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyInstructions = async () => {
    try {
      await navigator.clipboard.writeText(
        `Here's how to join ${event.title} on Gather Social:
1. Visit the event page: ${window.location.origin}/events/${event.id}
2. Sign in with Google
3. Enter this invite code: ${event.join_code}`,
      );
      setIsCopied(true);
      toast.success("Instructions copied to clipboard");

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy instructions. Please try manually.");
    }
  };

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite guests to <em>{event.title}</em>
          </DialogTitle>
          <DialogDescription>
            Use these instructions to invite guests to your event gallery.
          </DialogDescription>

          <Tabs defaultValue="link" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="link">
              <div className="mt-4 flex flex-col gap-2">
                <p>
                  Here&apos;s how to join <strong>{event.title}</strong> on
                  Gather Social:
                </p>
                <ol className="list-inside list-decimal space-y-2">
                  <li>
                    Visit{" "}
                    <Link
                      to={`/events/${event.id}`}
                      className="text-pink-600 underline-offset-2 hover:underline"
                    >
                      the event page
                    </Link>
                  </li>
                  <li>Sign in with Google</li>
                  <li>
                    Enter this invite code:{" "}
                    <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-black">
                      {event.join_code}
                    </span>
                  </li>
                </ol>
                <Button className="mt-6" onClick={handleCopyInstructions}>
                  {isCopied ? "Copied!" : "Copy instructions"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="qr">
              <div className="mt-4 flex flex-col gap-2">
                <ol className="mb-4 list-inside list-decimal space-y-2">
                  <li>
                    Scan this QR code to open <strong>{event.title}</strong> in
                    Gather Social.
                  </li>
                  <li>Sign in with Google</li>
                  <li>
                    Enter this invite code:{" "}
                    <span className="rounded bg-neutral-100 px-2 py-1 font-mono text-black">
                      {event.join_code}
                    </span>
                  </li>
                </ol>

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
                    className={`h-auto w-full max-w-56 ${qrStatus === "loaded" ? "block" : "hidden"}`}
                    onLoad={() => setQrStatus("loaded")}
                    onError={() => setQrStatus("error")}
                  />
                </div>
                <Button className="mt-6" onClick={handleDownloadQRCode}>
                  Download QR code
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EventInviteDialog;
