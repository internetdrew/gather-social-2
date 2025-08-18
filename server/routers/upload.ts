import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { supabaseAdminClient } from "../supabase";

export const uploadRouter = router({
  getSignedUploadUrls: protectedProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            name: z.string(),
            size: z.number(),
            type: z.string(),
          }),
        ),
        eventId: z.uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const { eventId, files } = input;
      const signedUrls = [];

      for (const file of files) {
        const timestamp = Date.now();
        const fileExt = file.name.split(".").pop();

        const uniqueName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const filePath = `events/${eventId}/${uniqueName}`;

        const { data, error } = await supabaseAdminClient.storage
          .from("images")
          .createSignedUploadUrl(filePath);

        if (error) {
          console.error("Failed to create signed upload URL:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create upload URL.`,
          });
        }

        signedUrls.push({
          token: data.token,
          signedUrl: data.signedUrl,
          path: data.path,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
        });
      }

      return { signedUrls };
    }),
});
