import { useParams } from "react-router";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import type { Photo } from "react-photo-album";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

const EventAdminGallery = () => {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const { eventId } = useParams();

  const {
    data: photos,
    isLoading,
    error,
  } = useQuery(
    trpc.event.getAllImages.queryOptions(
      { eventId: eventId ?? "" },
      { enabled: !!eventId },
    ),
  );

  if (isLoading) {
    return <div>Loading images...</div>;
  }

  if (error) {
    return <div>Error loading images: {error.message}</div>;
  }

  return (
    <div className="mx-4">
      {photos && photos.length > 0 ? (
        <>
          <RowsPhotoAlbum
            photos={photos}
            targetRowHeight={(containerWidth) =>
              containerWidth < 600 ? 150 : 250
            }
            componentsProps={(containerWidth) => ({
              image: {
                loading: (containerWidth ?? 0) > 800 ? "eager" : "lazy",
              },
            })}
            onClick={({ event, photo }) => {
              event.preventDefault();
              setLightboxPhoto(photo);
            }}
          />
          <Lightbox
            open={Boolean(lightboxPhoto)}
            close={() => setLightboxPhoto(null)}
            slides={lightboxPhoto ? [lightboxPhoto] : undefined}
            carousel={{ finite: true }}
            render={{ buttonPrev: () => null, buttonNext: () => null }}
            controller={{
              closeOnBackdropClick: true,
              closeOnPullUp: true,
              closeOnPullDown: true,
            }}
          />
        </>
      ) : (
        <div className="text-muted-foreground text-center">
          <p className="mt-28">No images have been added for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default EventAdminGallery;
