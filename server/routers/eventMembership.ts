import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "../supabase";

export const eventMembershipRouter = router({
  isUserEventMember: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { eventId } = input;
      const { data, error } = await supabaseAdminClient
        .from("event_memberships")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", ctx.user.id)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return !!data;
    }),
  addUserToEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input;
      const userId = ctx.user.id;
      const { data, error } = await supabaseAdminClient
        .from("event_memberships")
        .insert({
          event_id: eventId,
          user_id: userId,
          role: "GUEST",
        })
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
  isAdmin: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { eventId } = input;
      const { data, error } = await supabaseAdminClient
        .from("event_memberships")
        .select("role")
        .eq("event_id", eventId)
        .eq("user_id", ctx.user.id)
        .maybeSingle();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data?.role === "ADMIN";
    }),
});
