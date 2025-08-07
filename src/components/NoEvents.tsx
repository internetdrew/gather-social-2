import { CalendarPlus2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import EventDetailsForm from "@/forms/EventDetailsForm";

const NoEvents = () => {
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create an event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create an event</DialogTitle>
                <DialogDescription>
                  Once you create an event,you can activate it whenever you'd
                  like and others will have access to it for up to 30 days.
                </DialogDescription>
              </DialogHeader>
              <EventDetailsForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* <AddHouseholdDialog
        open={showAddHouseholdDialog}
        onOpenChange={setShowAddHouseholdDialog}
      /> */}
    </>
  );
};

export default NoEvents;
