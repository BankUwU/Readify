import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Header from "../components/header";

function ReviewPage() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="p-8">
        <div className="flex gap-8">
          {/* Book Cover */}
          <div className="w-[200px] h-[260px] bg-gray-300 rounded-lg"></div>

          {/* Review Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-0">Book Title</h2>
                <p className="text-sm text-gray-600 mt-1">reviewer's user</p>
              </div>

              {/* Star Button */}
              <button
                onClick={toggleFavorite}
                className="bg-transparent border-0 p-1 flex items-center cursor-pointer"
              >
                <FaStar
                  size={24}
                  color={isFavorite ? "black" : "transparent"}
                  style={{ stroke: "black", strokeWidth: 20 }}
                />
              </button>
            </div>

            <div className="mt-4 bg-gray-300 h-[150px] rounded-lg p-4">
              <p className="text-gray-700">Review goes here...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
