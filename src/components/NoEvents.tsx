import { CalendarPlus2 } from "lucide-react";
import { Button } from "./ui/button";

const NoEvents = ({
  setRenderEventDialog,
}: {
  setRenderEventDialog: (open: boolean) => void;
}) => {
  return (
    <>
      <div className="mt-40 flex flex-col items-center justify-center gap-4 text-center">
        <div className="bg-muted/50 flex size-16 items-center justify-center rounded-full">
          <CalendarPlus2 className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Looks like you don't have any events yet.
          </h2>
          <p className="text-muted-foreground">
            Create an event to get started.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setRenderEventDialog(true)}>
            Create an event
          </Button>
        </div>
      </div>
    </>
  );
};

export default NoEvents;
