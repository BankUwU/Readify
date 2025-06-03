import { useState } from "react";
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
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Book Cover */}
          <div className="w-full max-w-[200px] h-[260px] bg-gray-300 rounded-lg mx-auto lg:mx-0" />

          {/* Review Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
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

            <div className="mt-4 bg-gray-300 min-h-[150px] rounded-lg p-4">
              <p className="text-gray-700">Review goes here...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
