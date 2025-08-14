import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const eventPasscodeSchema = z.object({
  passcode: z
    .string()
    .min(4, { message: "Passcode must be at least 4 characters long" }),
});

const EventPasscodeForm = ({ eventId }: { eventId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof eventPasscodeSchema>>({
    resolver: zodResolver(eventPasscodeSchema),
    defaultValues: {
      passcode: "",
    },
  });

  const passcodeValidationMutation = useMutation(
    trpc.passcode.validate.mutationOptions(),
  );
  const eventMembershipMutation = useMutation(
    trpc.eventMembership.addUserToEvent.mutationOptions(),
  );

  const onSubmit = async (values: z.infer<typeof eventPasscodeSchema>) => {
    setSubmitting(true);
    try {
      const validPassword = await passcodeValidationMutation.mutateAsync({
        eventId,
        passcode: values.passcode,
      });

      if (validPassword) {
        await eventMembershipMutation.mutateAsync(
          { eventId },
          {
            onSuccess: () => {
              setSubmitting(false);
              queryClient.invalidateQueries({
                queryKey: trpc.eventMembership.isUserEventMember.queryKey({
                  eventId,
                }),
              });
              toast.success(
                "Passcode verified and membership added successfully!",
              );
            },
            onError: () => {
              setSubmitting(false);
              toast.error("Failed to add membership. Please try again.");
            },
          },
        );
      } else {
        setSubmitting(false);
        toast.error("Invalid passcode. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="passcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Passcode</FormLabel>
              <FormControl>
                <Input placeholder="Enter the event passcode" {...field} />
              </FormControl>
              <FormDescription>
                You will have gotten this passcode from the event host.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || submitting}
          >
            {submitting ? "Verifying..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventPasscodeForm;
