// components/ReviewPopup.jsx
import { AnimatePresence, motion } from "framer-motion";

const ReviewPopup = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Image */}
          <div className="flex items-center justify-center">
            <img
              src={review.books_pics_url}
              alt={review.title}
              className="w-280 h-392 rounded-xl object-cover"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">{review.title}</h2>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Created At:</span>{" "}
              {review.datecreated || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Genre:</span> {review.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Review:</span> {review.review}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Created by:</span> {review.creator || "Unknown"}
            </p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg self-start"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewPopup;
