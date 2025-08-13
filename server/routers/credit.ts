import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "../supabase";

export const creditRouter = router({
  getAvailableCredits: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdminClient
      .from("user_credits")
      .select("*")
      .is("used_for_event_id", null)
      .eq("user_id", ctx.user.id);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    return data.length;
  }),
});
