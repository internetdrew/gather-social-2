import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { supabaseAdminClient } from "../supabase";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

export const passcodeRouter = router({
  create: protectedProcedure
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

      const { data: passcode, error: passcodeError } = await supabaseAdminClient
        .from("passcodes")
        .insert({
          event_id: eventId,
          code: hashedCode,
        })
        .select("*, event:events(title)")
        .single();

      if (passcodeError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: passcodeError.message,
        });
      }

      return { ...passcode, code: plainCode };
    }),
});
