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
          className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 relative"
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
              className="w-[366px] h-[549px] object-cover rounded-lg mt-4 mb-4"
            />
          </div>

          <button
              className="absolute right-5 top-4 hover:bg-gray-100 text-gray-500 px-1 py-1 rounded-full self-start"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          {/* Right: Info */}
          <div className="flex flex-col mt-3">
            <h2 className="text-3xl font-bold text-gray-800">{review.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{review.createdAt || "N/A"}</p>
            <p className="text-sm text-purple-700 mt-1">{review.category}</p>
            <p className="text-sm text-gray-700 mt-[30px] pr-10">{review.review}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewPopup;
