import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ReadingPopup from "../components/AddReadingPopup";
import Header from "../components/header";
import { db } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";


function MyReading() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchReadingList(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReadingList = async (uid) => {
    const snapshot = await getDocs(collection(db, "users", uid, "myreading"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setReadingList(list);
  };

  const handleReadingAdded = () => {
    fetchReadingList(user.uid);
    setShowPopup(false);
  };

  const handleDeleteClick = (readingId) => {
    setBookToDelete(readingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "myreading", bookToDelete));
      fetchReadingList(user.uid);
    } catch (error) {
      console.error("Failed to delete reading:", error);
      alert("Error deleting the book. Try again.");
    } finally {
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };


  return (
    <>
      <Header />
      <div className="p-10 min-h-[calc(100vh-60px)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Reading List</h2>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-2" /> Add Reading
          </button>
        </div>

        {readingList.length === 0 ? (
          <p>No readings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 ">
            {readingList.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate("/book-information", { state: { book } })}
                className="relative flex flex-row p-5 bg-white shadow hover:shadow-lg transition cursor-pointer rounded-3xl"
              >
                <img
                  src={book.booksCover}
                  alt="Book Cover"
                  className="w-[150px] h-[220px] object-cover rounded-2xl"
                />
                <div className="ml-5 flex flex-col flex-grow text-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 line-clamp-6 pr-8" title={book.title}>
                  {book.title || "Untitled"}
                </h3>

                <p className="text-md mt-1 text-purple-700">{book.category}</p>
                {/* <p className="text-sm text-gray-600">Pages: {book.numberOfPage}</p> */}
                {/* <p className="text-sm text-gray-400">📅 Date: {book.createDate}</p> */}               
                <p className={`text-sm font-medium ${book.progress === 100 ? "text-green-600" : "text-gray-500"}`}>
                {book.progress === 100 ? "Complete" : `In Progress (${book.progress || 0}%)`}
              </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(book.id);
                  }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <ReadingPopup
          user={user}
          onClose={() => setShowPopup(false)}
          onReadingAdded={handleReadingAdded}
        />
      )}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />


      {/* {selectedReading && (
        <BookLogPopupa
          reading={selectedReading}
          user={user}
          onClose={() => setSelectedReading(null)}
          refresh={() => fetchReadingList(user.uid)}
        />
      )} */}

    </>
  );
}

export default MyReading;
