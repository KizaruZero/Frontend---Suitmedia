import React from "react";

const IdeaCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden animate-pulse">
    <div className="w-full aspect-[16/9] bg-gray-200 flex items-center justify-center">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>

    <div className="p-4 sm:p-6 flex flex-col grow">
      <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-20 sm:w-24 mb-2 sm:mb-3"></div>

      <div className="space-y-2">
        <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-full"></div>
        <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-4/5"></div>
        <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded w-3/5"></div>
      </div>
    </div>
  </div>
);

export default IdeaCardSkeleton;
