import { useRef } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useContainerWidth } from "./useContainerWidth";

export const useResponsiveImages = (eventId: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  const devicePixelRatio =
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const requestedWidth = Math.ceil(containerWidth * devicePixelRatio);

  const {
    data: photos,
    isLoading,
    error,
  } = useQuery(
    trpc.event.getAllImages.queryOptions(
      { eventId: eventId ?? "", width: requestedWidth },
      { enabled: !!eventId && requestedWidth > 0 },
    ),
  );

  return { containerRef, photos, isLoading, error };
};
