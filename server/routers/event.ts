import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "../supabase";

export const eventRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.coerce.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data: eventData, error: eventError } = await supabaseAdminClient
        .from("events")
        .insert({
          title: input.title,
          date: input.date.toISOString(),
          host_id: ctx.user.id,
        })
        .select()
        .single();

      if (eventError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: eventError.message,
        });
      }

      const { error: eventMembershipError } = await supabaseAdminClient
        .from("event_memberships")
        .insert({
          event_id: eventData.id,
          user_id: ctx.user.id,
          role: "ADMIN",
        })
        .select()
        .single();

      if (eventMembershipError) {
        await supabaseAdminClient
          .from("events")
          .delete()
          .eq("id", eventData.id);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: eventMembershipError.message,
        });
      }

      return eventData;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdminClient
      .from("events")
      .select("*, host:profiles(full_name, avatar_url)")
      .eq("host_id", ctx.user.id)
      .order("date", { ascending: true });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
    return data;
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.coerce.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdminClient
        .from("events")
        .update({
          ...input,
          date: input.date.toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      return data;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdminClient
        .from("events")
        .delete()
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      return data;
    }),
  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

      const { data: availableCredit, error: availableCreditError } =
        await supabaseAdminClient
          .from("user_credits")
          .select("*")
          .is("used_for_event_id", null)
          .eq("user_id", ctx.user.id)
          .maybeSingle();

      if (availableCreditError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: availableCreditError.message,
        });
      }

      if (!availableCredit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient credits to activate event",
        });
      }

      const { data: eventData, error: eventError } = await supabaseAdminClient
        .from("events")
        .update({
          activated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + THIRTY_DAYS_IN_MS).toISOString(),
          status: "ACTIVE",
        })
        .eq("id", input.id)
        .select()
        .single();

      if (eventError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: eventError.message,
        });
      }

      const { error: userCreditsUpdateError } = await supabaseAdminClient
        .from("user_credits")
        .update({
          used_for_event_id: eventData.id,
          used_at: new Date().toISOString(),
        })
        .eq("id", availableCredit.id);

      if (userCreditsUpdateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: userCreditsUpdateError.message,
        });
      }

      return eventData;
    }),
  getById: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdminClient
        .from("events")
        .select("*, host:profiles(full_name, avatar_url)")
        .eq("id", input.eventId)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data;
    }),
});
