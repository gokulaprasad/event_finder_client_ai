export const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export const EventListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default { EventCardSkeleton, EventListSkeleton, DetailSkeleton };
