import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Tables } from "../../shared/database.types.ts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const eventDetailsSchema = z.object({
  title: z.string().min(1, { message: "Please add an event title" }),
  date: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      message: "Event date cannot be in the past",
    },
  ),
});

const EventDetailsForm = ({
  onSuccess,
  event,
}: {
  onSuccess: () => void;
  event?: Tables<"events"> | null;
}) => {
  const form = useForm<z.infer<typeof eventDetailsSchema>>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      title: event?.title || "",
      date: event?.date ? new Date(event.date) : new Date(),
    },
  });

  const createEventMutation = useMutation(trpc.event.create.mutationOptions());
  const updateEventMutation = useMutation(trpc.event.update.mutationOptions());

  const onSubmit = (values: z.infer<typeof eventDetailsSchema>) => {
    if (event) {
      updateEventMutation.mutateAsync(
        {
          id: event.id,
          ...values,
        },
        {
          onSuccess: async () => {
            form.reset();
            onSuccess();
            await queryClient.invalidateQueries({
              queryKey: trpc.event.list.queryKey(),
            });
            toast.success("Event updated successfully");
          },
          onError: (error) => {
            console.error(error);
            toast.error("Failed to update event");
          },
        },
      );
    } else {
      createEventMutation.mutateAsync(
        {
          ...values,
        },
        {
          onSuccess: async () => {
            form.reset();
            onSuccess();
            await queryClient.invalidateQueries({
              queryKey: trpc.event.list.queryKey(),
            });
            toast.success("Event created successfully");
          },
          onError: (error) => {
            console.error(error);
            toast.error("Failed to create event");
          },
        },
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="What's the name of your event?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the name your guests will see when you invite them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the date your event will take place.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              createEventMutation.isPending ||
              updateEventMutation.isPending ||
              !form.formState.isDirty
            }
          >
            {createEventMutation.isPending || updateEventMutation.isPending
              ? "Saving..."
              : event
                ? "Update event"
                : "Create event"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventDetailsForm;
