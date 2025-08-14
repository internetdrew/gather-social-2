import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { supabaseAdminClient } from "../supabase";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

export const joinCodeRouter = router({
  createCode: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { eventId } = input;

      const saltRounds = 10;
      const plainCode = nanoid(8);
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedCode = bcrypt.hashSync(plainCode, salt);

      const { data: joinCode, error: joinCodeError } = await supabaseAdminClient
        .from("join_codes")
        .insert({
          event_id: eventId,
          code: hashedCode,
        })
        .select("*, event:events(title)")
        .single();

      if (joinCodeError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: joinCodeError.message,
        });
      }

      return { ...joinCode, code: plainCode };
    }),
});
