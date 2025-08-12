import EventDialog from "@/components/dialogs/EventDialog";
import NoEvents from "@/components/NoEvents";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Tables } from "../../shared/database.types";
import EventList from "@/components/EventList";
import { Button } from "@/components/ui/button";
import DeleteEventAlertDialog from "@/components/alert-dialogs/DeleteEventAlertDialog";
import EventListSkeleton from "@/components/skeleton-ui/EventListSkeleton";
import { toast } from "sonner";

const Home = () => {
  const [renderEventDialog, setRenderEventDialog] = useState(false);
  const [renderDeleteEventAlertDialog, setRenderDeleteEventAlertDialog] =
    useState(false);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<Tables<"events"> | null>(null);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<Tables<"events"> | null>(null);

  const {
    data: events,
    isLoading: eventListLoading,
    isRefetching: eventListRefetching,
  } = useQuery(trpc.event.list.queryOptions());

  const handleEditEvent = (event: Tables<"events">) => {
    setSelectedEventForEdit(event);
    setRenderEventDialog(true);
  };

  const handleDeleteEvent = (event: Tables<"events">) => {
    setSelectedEventForDelete(event);
    setRenderDeleteEventAlertDialog(true);
  };

  const checkoutSessionQuery = useMutation(
    trpc.checkout.createCheckoutSession.mutationOptions(),
  );

  const createCheckoutSession = () => {
    setStartingCheckout(true);
    checkoutSessionQuery.mutateAsync(undefined, {
      onSuccess: (data) => {
        if (data) {
          window.location.href = data;
        }
      },
      onError: (error) => {
        setStartingCheckout(false);
        toast.error(error.message);
      },
    });
  };

  if (
    eventListLoading ||
    (events && events.length === 0 && eventListRefetching)
  ) {
    return <EventListSkeleton />;
  }

  return (
    <div className="px-4">
      {events && events.length > 0 ? (
        <>
          <div className="mb-8 flex justify-between gap-2 sm:justify-end">
            <Button variant="outline" onClick={createCheckoutSession}>
              {startingCheckout ? "Starting checkout..." : "Buy Event Credits"}
            </Button>
            <Button
              onClick={() => {
                setRenderEventDialog(true);
                setSelectedEventForEdit(null);
              }}
            >
              Create event
            </Button>
          </div>
          <EventList
            events={events}
            onEditClick={handleEditEvent}
            onDeleteClick={handleDeleteEvent}
          />
        </>
      ) : (
        <NoEvents setRenderEventDialog={setRenderEventDialog} />
      )}
      <EventDialog
        event={selectedEventForEdit}
        open={renderEventDialog}
        onOpenChange={setRenderEventDialog}
        setSelectedEvent={setSelectedEventForEdit}
      />

      {selectedEventForDelete && (
        <DeleteEventAlertDialog
          event={selectedEventForDelete}
          open={renderDeleteEventAlertDialog}
          onOpenChange={setRenderDeleteEventAlertDialog}
        />
      )}
    </div>
  );
};

export default Home;
