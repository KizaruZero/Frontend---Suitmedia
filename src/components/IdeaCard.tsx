import React from "react";

interface IdeaCardProps {
  imageUrl: string;
  title: string;
  date: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ imageUrl, title, date }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer">
    <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
    <div className="p-4 sm:p-6 flex flex-col grow">
      <span className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-medium">
        {date}
      </span>
      <h3
        className="text-base sm:text-lg font-bold text-gray-800 leading-snug overflow-hidden hover:text-orange-600 transition-colors duration-200"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          maxHeight: "4.5em",
        }}
        title={title}
      >
        {title}
      </h3>
    </div>
  </div>
);

export default IdeaCard;
