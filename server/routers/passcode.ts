import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { supabaseAdminClient } from "../supabase";
import { TRPCError } from "@trpc/server";
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

      const { nanoid } = await import("nanoid");
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
  validate: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        passcode: z
          .string()
          .min(4, { message: "Passcode must be at least 4 characters long" }),
      }),
    )
    .mutation(async ({ input }) => {
      const { eventId, passcode } = input;

      const { data: storedPasscode, error: fetchError } =
        await supabaseAdminClient
          .from("passcodes")
          .select("code")
          .eq("event_id", eventId)
          .single();

      if (fetchError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: fetchError.message,
        });
      }

      if (!storedPasscode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Passcode not found for the given event.",
        });
      }

      const isValid = bcrypt.compareSync(passcode, storedPasscode.code);

      return isValid;
    }),
});
