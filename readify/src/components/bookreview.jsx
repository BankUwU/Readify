import React from "react";
import { FaStar } from "react-icons/fa";

function Bookreview({ review, isFavorite, onToggleFavorite, userPhotoURL, onClick }) {
  return (
<div
  className="relative flex flex-col sm:flex-row 
             px-3 py-2 sm:p-5 
             bg-white shadow hover:shadow-lg transition cursor-pointer 
             rounded-3xl 
             w-full max-w-xs sm:max-w-md mx-auto"
  onClick={onClick}
>
    <img
      src={review.books_pics_url || review.imageurl}
      alt={review.title}
      className="w-[80px] h-[130px] sm:w-[150px] sm:h-[220px] object-cover rounded-2xl mx-auto"
    />
    <div className="sm:ml-5 mt-4 sm:mt-0 flex flex-col flex-grow text-gray-800">
      <h2 className="text-base sm:text-xl font-semibold text-gray-800 break-words pr-8">{review.title}</h2>
      <h2 className="text-sm sm:text-md mt-1 text-purple-700">{review.category}</h2>
      {/* <p className="mt-2 text-m text-gray-600 leading-relaxed">{review.review || review.description}</p> */}
      <div className="flex items-center mt-auto pt-4">
        <img
          src={review.photoURL}
          alt="User"
          className="w-5 h-5 sm:w-7 sm:h-7 rounded-full object-cover"
        />
        <span className="ml-2 text-xs sm:text-sm text-gray-700 font-medium">{review.createdBy}</span>
      </div>
    </div>

    <button
      onClick={(e) => {
      e.stopPropagation(); 
      onToggleFavorite();  
    }}
      aria-label="Favorite"
      className="absolute top-4 right-4 bg-transparent border-none cursor-pointer z-10"
    >
      <FaStar
        size={22}
        color={isFavorite ? "#000" : "#e0e0e0"}
        style={{ stroke: "#000", strokeWidth: 1 }}
      />
    </button>
  </div>
  );
}


export default Bookreview;
