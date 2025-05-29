import React from "react";
import { FaStar } from "react-icons/fa";

function Bookreview({ review, isFavorite, onToggleFavorite, userPhotoURL }) {
  return (
    <div className="relative flex flex-row p-5 bg-blue-100 rounded-3xl">
    <img
      src={review.books_pics_url || review.imageurl}
      alt={review.title}
      className="w-44 min-h-[262px] object-cover rounded-2xl"
    />
    <div className="ml-5 flex flex-col flex-grow text-gray-800">
      <h2 className="text-3xl text-[#2c3e50]">{review.title}</h2>
      <h2 className="text-2xl mt-2 text-purple-700">{review.category}</h2>
      <p className="mt-2 text-xl text-gray-600 leading-relaxed">{review.review || review.description}</p>
      <div className="flex items-center mt-auto pt-4">
        <img
          src={review.photoURL}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 text-sm text-gray-700 font-medium">{review.createdBy}</span>
      </div>
    </div>

    <button
      onClick={onToggleFavorite}
      aria-label="Favorite"
      className="absolute top-3 right-3 bg-transparent border-none cursor-pointer z-10"
    >
      <FaStar
        size={28}
        color={isFavorite ? "#000" : "#e0e0e0"}
        style={{ stroke: "#000", strokeWidth: 1 }}
      />
    </button>
  </div>
  );
}


export default Bookreview;
