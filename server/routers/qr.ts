import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import QRCode from "qrcode";
import { supabaseAdminClient } from "../supabase";
import { TRPCError } from "@trpc/server";
import { generateQRFilePath } from "../utils/generateQRFilePath";

export const qrRouter = router({
  generateEventQRCode: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        baseUrl: z.url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId, baseUrl } = input;

      const { data: event, error: eventError } = await supabaseAdminClient
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("host_id", ctx.user.id)
        .single();

      if (eventError) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found or you don't have access to it",
        });
      }

      const qrCodeDataUrl = await QRCode.toDataURL(
        `${baseUrl}/events/${event.id}`,
        {
          width: 400,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        },
      );

      // Convert data URL to buffer
      const base64Data = qrCodeDataUrl.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const filePath = generateQRFilePath(event.id);

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } =
        await supabaseAdminClient.storage
          .from("qr-codes")
          .upload(filePath, buffer, {
            contentType: "image/png",
            cacheControl: "3600",
            upsert: false,
          });

      if (uploadError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to upload QR code to storage: ${uploadError.message}`,
        });
      }

      // Get public URL
      const { data: urlData } = supabaseAdminClient.storage
        .from("qr-codes")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabaseAdminClient
        .from("events")
        .update({ qr_code_url: urlData.publicUrl })
        .eq("id", event.id);

      if (updateError) {
        await supabaseAdminClient.storage.from("qr-codes").remove([filePath]);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update event with QR code URL: ${updateError.message}`,
        });
      }

      return uploadData;
    }),
  deleteEventQR: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data: event, error: eventError } = await supabaseAdminClient
        .from("events")
        .select("*")
        .eq("id", input.eventId)
        .eq("host_id", ctx.user.id)
        .single();

      if (eventError || !event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found or you don't have permission to access it",
        });
      }

      if (!event.qr_code_url) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No QR code found for this event",
        });
      }

      const urlParts = event.qr_code_url.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === "qr-codes");
      const filePath = urlParts.slice(bucketIndex + 1).join("/");

      const { data: deletedData, error: deleteError } =
        await supabaseAdminClient.storage.from("qr-codes").remove([filePath]);

      if (deleteError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete QR code: ${deleteError.message}`,
        });
      }

      const { error: updateError } = await supabaseAdminClient
        .from("events")
        .update({ qr_code_url: null })
        .eq("id", event.id);

      if (updateError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update event: ${updateError.message}`,
        });
      }

      return deletedData;
    }),
});
