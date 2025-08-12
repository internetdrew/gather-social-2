import { Skeleton } from "../ui/skeleton";

const EventListSkeleton = () => {
  return (
    <>
      <div className="mb-8 flex justify-between gap-2 px-4 sm:justify-end">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full rounded-lg" />
        ))}
      </div>
    </>
  );
};

export default EventListSkeleton;
