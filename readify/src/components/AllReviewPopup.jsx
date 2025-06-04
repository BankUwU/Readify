import { formatDistanceToNow } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../api/auth";
import { db } from "../config/firebaseConfig";

const AllReviewPopup = ({ review, onClose }) => {
  const { currentUser } = useAuth(); // Get logged-in user
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!review?.id) return;
    const q = query(
      collection(db, "allreview", review.id, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [review]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;

    await addDoc(collection(db, "allreview", review.id, "comments"), {
      text: newComment.trim(),
      createdAt: serverTimestamp(),
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    });

    setNewComment("");
  };

  const handleDeleteComment = async (commentId) => {
    const commentRef = doc(db, "allreview", review.id, "comments", commentId);
    await deleteDoc(commentRef);
  };

  const getFormattedDate = (createdAt) => {
    if (!createdAt) return "N/A";
    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    const date = new Date(createdAt);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Invalid date";
  };

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
          className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-4xl grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 relative max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Sticky Book Image */}
          <div className="sticky top-6 self-start flex items-center justify-center">
            <img
              src={review.books_pics_url}
              alt={review.title}
              className="w-72 h-[450px] object-cover rounded-lg"
            />
          </div>

          {/* Right: Scrollable Review & Comments */}
          <div className="flex flex-col overflow-y-auto pr-2 max-h-[80vh]">
            {/* Close button */}
            <button
              className="absolute right-5 top-4 hover:bg-gray-100 text-gray-500 px-1 py-1 rounded-full"
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

            {/* Review Info */}
            <h2 className="text-3xl font-bold text-gray-800">{review.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{getFormattedDate(review.createdAt)}</p>
            <p className="text-sm text-purple-700 mt-1">{review.category}</p>
            <p className="text-sm text-gray-700 mt-6 whitespace-pre-line break-words">{review.review}</p>

            {/* Author */}
            <div className="flex items-center mt-6">
              <img
                src={review.photoURL}
                alt="User"
                className="w-7 h-7 rounded-full object-cover"
              />
              <p className="ml-2 text-sm text-gray-600 font-semibold">
                {review.createdBy || "Unknown"}
              </p>
            </div>

            {/* Comments */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>

              <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                {comments.map((comment) => {
                  const isAuthorOfComment = currentUser?.uid === comment.uid;
                  const isAuthorOfReview = currentUser?.uid === review.uid;

                  return (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.photoURL}
                        alt={comment.displayName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-gray-700">
                            {comment.displayName || "Anonymous"}
                          </p>
                          {comment.createdAt?.toDate && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>

                      {(isAuthorOfComment || isAuthorOfReview) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Comment */}
              {currentUser && (
                <div className="mt-4 flex items-center space-x-2">
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  />
                  <button
                    className="text-sm text-white bg-purple-600 px-3 py-1 rounded-lg hover:bg-purple-700"
                    onClick={handleCommentSubmit}
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AllReviewPopup;
