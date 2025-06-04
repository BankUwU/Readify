import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../api/auth";
import { db } from "../config/firebaseConfig";

const AllReviewPopup = ({ review, onClose }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
      userId: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      editedAt: null,
    });

    setNewComment("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!review?.id || !commentId) return;

    try {
      await deleteDoc(doc(db, "allreview", review.id, "comments", commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      // No toast or alert shown as per request
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const saveEdit = async (commentId) => {
    if (!editText.trim()) {
      // no alert or toast, just silently ignore save if empty
      return;
    }

    try {
      await updateDoc(doc(db, "allreview", review.id, "comments", commentId), {
        text: editText.trim(),
        editedAt: Timestamp.now(),
      });
      setEditingCommentId(null);
      setEditText("");
      // no toast or message on save success
    } catch (error) {
      console.error("Error updating comment:", error);
      // no alert or toast on error either
    }
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

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "";
    let date;
    if (createdAt.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else {
      date = new Date(createdAt);
    }
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
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
                  const canDelete =
                    currentUser &&
                    (currentUser.uid === comment.userId || currentUser.uid === review.createdBy);

                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.photoURL}
                        alt={comment.displayName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-700">
                            {comment.displayName || "Anonymous"}
                          </p>
                          <div className="flex space-x-2">
                            {canDelete && !isEditing && (
                              <>
                                <button
                                  className="text-red-500 hover:text-red-700 text-xs"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  title="Delete comment"
                                >
                                  Delete
                                </button>
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                  onClick={() => startEdit(comment)}
                                  title="Edit comment"
                                >
                                  Edit
                                </button>
                              </>
                            )}
                            {isEditing && (
                              <>
                                <button
                                  className="text-green-600 hover:text-green-800 text-xs"
                                  onClick={() => saveEdit(comment.id)}
                                  title="Save edit"
                                >
                                  Save
                                </button>
                                <button
                                  className="text-gray-500 hover:text-gray-700 text-xs"
                                  onClick={cancelEdit}
                                  title="Cancel edit"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-y"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        )}

                        {/* Time ago below comment, show (edited) if editedAt */}
                        <p className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(comment.createdAt)}
                          {comment.editedAt ? " (edited)" : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Comment */}
              {currentUser && (
                <div className="mt-4">
                  <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-1 text-sm"
                    disabled={!newComment.trim()}
                  >
                    Post Comment
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
