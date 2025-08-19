import { useParams } from "react-router";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import { useResponsiveImages } from "@/hooks/useResponsiveImages";

const EventAdminGallery = () => {
  const { eventId } = useParams();

  const { containerRef, photos, isLoading, error } = useResponsiveImages(
    eventId ?? "",
  );

  if (isLoading) {
    return <div>Loading images...</div>;
  }

  if (error) {
    return <div>Error loading images: {error.message}</div>;
  }

  return (
    <div ref={containerRef} className="mx-4">
      {photos && photos.length > 0 ? (
        <RowsPhotoAlbum targetRowHeight={200} photos={photos} />
      ) : (
        <div className="text-muted-foreground text-center">
          <p className="mt-28">No images have been added for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default EventAdminGallery;
