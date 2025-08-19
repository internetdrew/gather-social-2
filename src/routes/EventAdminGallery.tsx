import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const EventAdminGallery = () => {
  const { eventId } = useParams();

  const { data, isLoading, error } = useQuery(
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

  const photosToRender = data?.map(({ id, url, width, height }) => ({
    id,
    src: url,
    width,
    height,
  }));

  return (
    <div className="px-4">
      {photosToRender && photosToRender.length > 0 ? (
        <RowsPhotoAlbum targetRowHeight={250} photos={photosToRender} />
      ) : (
        <div className="text-muted-foreground text-center">
          <p className="mt-28">No images have been added for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default EventAdminGallery;
