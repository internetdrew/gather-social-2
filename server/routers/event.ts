import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Constants } from "../../shared/database.types";
import { supabaseAdminClient } from "../supabase";
import { nanoid } from "nanoid";

export const eventRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.coerce.date(),
        trust_level: z.enum(Constants.public.Enums.TRUST_LEVEL),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data: eventData, error: eventError } = await supabaseAdminClient
        .from("events")
        .insert({
          title: input.title,
          trust_level: input.trust_level,
          date: input.date.toISOString(),
          host_id: ctx.user.id,
          join_code: nanoid(8),
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
      .select("*")
      .eq("host_id", ctx.user.id)
      .order("date", { ascending: false });

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
        trust_level: z.enum(Constants.public.Enums.TRUST_LEVEL),
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
});
