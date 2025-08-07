import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Constants } from "../../shared/database.types";
import { supabaseAdminClient } from "../supabase";

export const eventRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.date(),
        trust_level: z.enum(Constants.public.Enums.TRUST_LEVEL),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdminClient
        .from("events")
        .insert({
          title: input.title,
          trust_level: input.trust_level,
          date: input.date.toISOString(),
          host_id: ctx.user.id,
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
});
